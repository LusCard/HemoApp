import { verifyToken } from "../helpers/jwt.helper.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  try {
    // 1. INTENTAR OBTENER EL TOKEN DE LA COOKIE (Método HttpOnly)
    // Requiere que 'cookie-parser' esté configurado en Express.
    let token = req.cookies.accessToken;

    // 2. SI NO HAY COOKIE, INTENTAR OBTENER DEL ENCABEZADO (Método Bearer)
    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // 3. SI EL TOKEN SIGUE SIN EXISTIR, FALLAR
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "Token de acceso requerido",
      });
    }

    // El resto de la lógica de verificación sigue igual:
    const decoded = verifyToken(token);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    // Si verifyToken falla (token expirado o inválido)
    return res.status(403).json({
      ok: false,
      msg: "Token inválido o expirado",
    });
  }
};
export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        msg: "Refresh del token requerido",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        ok: false,
        msg: "Refresh del token invalido",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      ok: false,
      msg: "Refresh token inválido o expirado",
    });
  }
};
