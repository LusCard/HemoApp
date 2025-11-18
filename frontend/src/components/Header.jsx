import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function Header({ user }) {
  const navigate = useNavigate();

  return (
    <header className="bg-primary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="HemoApp" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-primary-foreground">
            Hemo<span className="font-normal">App</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/perfil">
            <Button variant="outline" className="text-primary border-primary-foreground hover:bg-primary-foreground hover:text-primary hover:border-ring">
              Mi Perfil
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-accent hover:bg-accent/90">Inicio</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
