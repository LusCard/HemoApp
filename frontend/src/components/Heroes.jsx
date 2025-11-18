import React from "react";
import { HeartHandshake, Syringe, Calendar, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Asumiendo que tienes un componente Card básico

export default function InformativeHeroes() {
  return (
    <section className="container mx-auto px-6 mt-12 mb-20">
      <h2 className="text-3xl font-extrabold text-foreground text-center mb-10">Información Clave para Donar</h2>
      <div className="grid  gap-8">
        <Card className="bg-red-50 p-6 shadow-2xl border-t-4 border-red-500 transition-transform duration-300 hover:scale-[1.01]">
          <CardHeader className="p-0 mb-4 flex-row items-center space-x-4">
            <HeartHandshake className="w-10 h-10 text-red-600 flex-shrink-0" />
            <CardTitle className="text-2xl font-bold text-red-600">Tu Donación Salva Vidas</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <p className="text-gray-700 text-lg leading-relaxed">
              Una simple donación de sangre puede ayudar a hasta tres personas. Es un acto de solidaridad irremplazable, vital para tratamientos, cirugías
              complejas y emergencias.
            </p>
            <ul className="text-gray-600 space-y-2 pt-2">
              <li className="flex items-center">
                <Droplets size={16} className="text-red-500 mr-2 flex-shrink-0" />
                Necesidad Constante: La sangre no se puede fabricar y tiene una vida útil limitada.
              </li>
              <li className="flex items-center">
                <Calendar size={16} className="text-red-500 mr-2 flex-shrink-0" />
                **Impacto Inmediato:** Garantiza que los hospitales tengan reservas ante cualquier emergencia.
              </li>
            </ul>
            <a href="#" className="inline-block mt-4 text-sm font-semibold text-red-600 hover:underline">
              Conoce más sobre el impacto &rarr;
            </a>
          </CardContent>
        </Card>

        <Card className="bg-primary-50 p-6 shadow-2xl border-t-4 border-primary transition-transform duration-300 hover:scale-[1.01]">
          <CardHeader className="p-0 mb-4 flex-row items-center space-x-4">
            <Syringe className="w-10 h-10 text-primary flex-shrink-0" />
            <CardTitle className="text-2xl font-bold text-primary">Prepara tu Cuerpo para Donar</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <p className="text-gray-700 text-lg leading-relaxed">
              Para que tu experiencia sea segura y exitosa, sigue estos pasos esenciales antes de acudir a un centro de donación.
            </p>
            <ul className="text-gray-600 space-y-2 pt-2">
              <li className="flex items-center">
                <span className="font-extrabold text-primary mr-2">1.</span>
                **Hidratación:** Bebe abundante agua y líquidos 24 horas antes.
              </li>
              <li className="flex items-center">
                <span className="font-extrabold text-primary mr-2">2.</span>
                **Comida:** Come alimentos ricos en hierro y evita las grasas justo antes de donar.
              </li>
              <li className="flex items-center">
                <span className="font-extrabold text-primary mr-2">3.</span>
                **Descanso:** Duerme al menos 7-8 horas la noche anterior.
              </li>
            </ul>
            <a href="/estado-donador" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
              Requisitos y Consejos Adicionales &rarr;
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
