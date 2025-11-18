import React from "react";
import { Droplets, Zap, ShieldCheck, Droplet } from "lucide-react";
import { Link } from "react-router-dom";

export default function CallToActionBanners() {
  return (
    <section className="container mx-auto px-6 mt-16 mb-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-red-500 flex items-start space-x-4 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <div className="flex-shrink-0 mt-1">
            <Droplets className="w-10 h-10 text-red-600 fill-red-100/50" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">¿Necesitas Donantes Urgentes?</h3>
            <p className="text-gray-600 mb-4">
              Si tienes un familiar o conocido que necesita sangre inmediatamente, puedes publicar una solicitud en segundos.
            </p>
            <Link to="/solicitar-sangre">
              <button className="flex items-center text-sm font-semibold px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md">
                <Zap size={18} className="mr-2" />
                Publicar Solicitud
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-primary flex items-start space-x-4 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <div className="flex-shrink-0 mt-1">
            <ShieldCheck className="w-10 h-10 text-primary fill-primary/10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">Programa de Recompensas y Beneficios</h3>
            <p className="text-gray-600 mb-4">¡Tu generosidad tiene recompensa! Descubre los beneficios exclusivos para donantes activos de HemoApp.</p>
            <Link to="/perfil">
              <button className="flex items-center text-sm font-semibold px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                Ver mis Beneficios
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
