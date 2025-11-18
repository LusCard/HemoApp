import { Link } from "react-router-dom";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import botonDonar from "../assets/boton-donar.png";
import botonMapa from "../assets/boton-mapa.png";
import botonEstado from "../assets/boton-estado.png";
import { useAuth } from "../context/AuthContext";
import InstitutionCarousel from "../components/Carroussel";
import CallToActionBanners from "../components/Banners";
import InformativeHeroes from "../components/Heroes";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log(user?.role);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <img src={logo} alt="HemoApp" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-4xl font-extrabold text-primary mb-2">Hola, {user?.profile?.firstName || user?.email || "Bienvenido"}!</h1>
          <h2 className="text-4xl font-bold text-accent">¿Qué quieres ver hoy?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Link to="/solicitudes" className="group">
            <div className="text-center transition-transform hover:scale-105 rounded-xl p-4 bg-white shadow-lg">
              <div className="mb-4">
                <img src={botonDonar} alt="Donar" className="w-48 h-48 mx-auto object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-accent">Donar</h3>
              <p className="text-sm text-gray-500">Encuentra solicitudes de sangre urgentes.</p>
            </div>
          </Link>

          <Link to="/mapa" className="group">
            <div className="text-center transition-transform hover:scale-105 rounded-xl p-4 bg-white shadow-lg">
              <div className="mb-4">
                <img src={botonMapa} alt="Mapa" className="w-48 h-48 mx-auto object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-accent">Mapa</h3>
              <p className="text-sm text-gray-500">Localiza bancos de sangre cercanos.</p>
            </div>
          </Link>

          <Link to="/estado-donador" className="group">
            <div className="text-center transition-transform hover:scale-105 rounded-xl p-4 bg-white shadow-lg">
              <div className="mb-4">
                <img src={botonEstado} alt="Estado como donador" className="w-48 h-48 mx-auto object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-accent">Estado Donador</h3>
              <p className="text-sm text-gray-500">Gestiona tu disponibilidad para donar.</p>
            </div>
          </Link>
        </div>

        <CallToActionBanners />
        <InformativeHeroes />
      </div>
    </div>
  );
}
