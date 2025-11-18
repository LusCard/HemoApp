import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/apiService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const credentials = { email, password };

      const responseData = await loginUser(credentials);
      if (responseData.ok && responseData.data.user) {
        handleLogin(responseData.data.user);

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });

        navigate("/dashboard");
      } else {
        throw new Error(responseData.msg || "Respuesta de login inesperada.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      let errorMessage = "Ocurrió un error inesperado al iniciar sesión.";

      if (error.message.includes("Credenciales invalidas") || error.message.includes("credenciales incorrectas")) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (error.message.includes("La institucion esta en proceso de validacion")) {
        errorMessage = "Tu institución está pendiente de validación. Serás notificado cuando sea aprobada.";
      } else if (error.message.includes("Cuenta no verificada")) {
        errorMessage = "Cuenta no verificada. Por favor verifica tu correo.";
      }

      toast({
        title: "Error de Autenticación",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-card-foreground to-primary flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute left-0 w-[400px] h-[400px] bg-background/40 rounded-full blur-3xl"></div>
      <div className="absolute left-0 top-2/4 w-[400px] h-[400px] bg-accent/40 rounded-full blur-3xl"></div>
      <div className="absolute right-20 top-1/2 w-[300px] h-[300px] bg-background/30 rounded-full blur-3xl"></div>
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-24 h-24 bg-background rounded-full flex items-center justify-center">
            <img src={logo} alt="Marca HemoApp" className="w-16 h-auto object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Iniciar Sesión</CardTitle>
          <CardDescription className="text-lg font-semibold">Ingresa a tu cuenta de HemoApp</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando..." : "Entrar"}
            </Button>
            <div className="text-center">
              <Link to="#" className="text-base text-muted-foreground hover:text-primary">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="text-center pt-4 border-t">
              <span className="text-base text-muted-foreground">¿No tienes cuenta? </span>
              <Link to="/register" className="text-base text-primary font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
