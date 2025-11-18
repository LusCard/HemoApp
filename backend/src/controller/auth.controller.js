import { userModel } from "../models/user.model.js";
import { generateToken, verifyToken, generateTokenRefresh } from "../helpers/jwt.helper.js";
import { comparePasswords } from "../helpers/bcrypt.helper.js";
import { RegistrationService } from "../services/registration.service.js";
import { envs } from "../config/config.env.js";

//MODIFICAR LA VERIFICACION DE LA CUENTA!!!

export const register = async (req, res) => {
  try {
    const { userName, email, password, role, profileData, institutionData } = req.body;
    const result = await RegistrationService.registerUser({
      userName,
      email,
      password,
      role,
      profileData,
      institutionData,
    });
    const message = result.isInstitution
      ? "Registro exitoso. La institucion esta en proceso de validacion."
      : "Registro eexitoso: Por favor, verifica tu bandeja de entrada de email.";

    return res.status(201).json({
      ok: true,
      msg: message,
      data: {
        id: result.user._id,
        userName: result.user.userName,
        email: result.user.email,
        role: result.user.role,
        accountStatus: result.user.accountStatus,
        ...(result.isInstitution && {
          institutionStatus: "pending_validation",
        }),
        profile: result.user.profile
          ? {
              firstName: result.user.profile.firstName,
              lastName: result.user.profile.lastName,
              dni: result.user.profile.dni,
              birthDate: result.user.profile.birthDate,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.log("error en registro", error);
    res.status(400).json({
      ok: false,
      msg: "Ups! Ocurrio un error al registrar el usuario",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const user = await userModel
      .findOne({
        $or: [{ userName }, { email }],
      })
      .select("+password");
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales invalidas",
      });
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        msg: "credenciales incorrectas",
      });
    }
    if (user.role === "institution") {
      if (user.accountStatus === "pending_validation") {
        return res.status(401).json({
          ok: false,
          msg: "La institucion esta en proceso de validacion. Te notificaremos cuando sea aprobada",
        });
      }
    }
    if (!user.emailVerified || user.accountStatus !== "verified") {
      return res.status(401).json({
        ok: false,
        msg: "Cuenta no verificada. Por favor verifica tu email o espera la aprobación del moderador.",
      });
    }
    const accessToken = generateToken(user);
    //parte para la auditoria
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.Token = accessToken;
    await user.save();
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });
    return res.status(200).json({
      ok: true,
      msg: "Logueado correctamente, bienvenido!",
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          donationStatus: user.donationStatus,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const myProfile = await userModel.findById(userId).select("-password -Token");
    res.status(200).json({
      ok: true,
      data: myProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Ups! ocurrio un error",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    await userModel.findByIdAndUpdate(userId, {
      Token: null,
      //$unset: {refreshToken: 1} elimina todo el campo, activar cuando deje de probar
    });
    return res.status(200).json({
      ok: true,
      msg: "Sesion cerrada",
    });
  } catch (error) {
    console.log("Error al cerrar la sesion", error);
    return res.status(500).json({
      ok: false,
      msg: "Ups! Error al querer cerrar sesion",
      error: error.message,
    });
  }
};
//     try {
//         const user = req.user;
//         const newAccesToken = generateToken(user);
//         const newRefreshToken = generateTokenRefresh(user);

//         //actualizar el refhesh
//         user.refreshToken = newRefreshToken;
//         await user.save()

//         return res.status(200).json({
//             ok:true,
//             msg: "Token actualizado correctamente",
//             data: {
//                 accessToken: newAccesToken,
//                 refreshToken: newRefreshToken
//             }
//         });
//     } catch (error) {
//         console.log("eeror al refrescar la token", error);
//         return res.status(500).json({
//             ok: false,
//             msg: "Error interno del servidor: fallo en refresh Token"
//         });
//     }
// };
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Token de verificacion invalido o expirado",
      });
    }
    //PARA ACTIVAR LA CUENTA (NO DISPONIBILIDAD DE DONACION)
    user.accountStatus = "verified";
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    // Si la petición viene de un navegador (acepta HTML), redirigimos al frontend
    const successUrl = `${envs.FRONTEND_URL}/onboarding`;
    const wantsHtml = req.headers.accept && req.headers.accept.includes("text/html");

    if (wantsHtml) {
      // Generar refresh token y setearlo en cookie HttpOnly (opcional rotación)
      try {
        const refreshToken = generateTokenRefresh(user);
        user.refreshToken = refreshToken;
        await user.save();

        const cookieOptions = {
          httpOnly: true,
          secure: envs.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
      } catch (err) {
        console.error("Error setting refresh token cookie:", err);
        // continuamos con la redirección aunque falle el cookie set
      }

      return res.redirect(successUrl);
    }

    // Respuesta JSON por defecto para clientes API
    return res.status(200).json({
      ok: true,
      msg: "Email verificado con exitos, ya puede iniicar sesion y donar",
      data: {
        id: user._id,
        userName: user.userName,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    console.log("error en la verificacion del mail", error);
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servir, fallo la verificacion del mail",
    });
  }
};
