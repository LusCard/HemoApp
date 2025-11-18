import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const institutions = [
  {
    id: 1,
    name: "Hospital Central de Formosa",
    location: "Formosa, Argentina",
    needed: "O+, A-",
    priority: "Alta",
  },
  {
    id: 2,
    name: "Hospital de Alta Complejidad (HAC)",
    location: "Formosa, Argentina",
    needed: "Todos los tipos",
    priority: "Media",
  },
  {
    id: 3,
    name: "Hospital Distrital 8",
    location: "Formosa, Argentina",
    needed: "B+",
    priority: "Media",
  },
  {
    id: 4,
    name: "Centro Provincial de Hemoterapia",
    location: "Mendoza, Argentina",
    needed: "AB+",
    priority: "Baja",
  },
  {
    id: 5,
    name: "Hospital de la Madre y el Niño",
    location: "Formosa, Argentina",
    needed: "O-",
    priority: "Urgente",
  },
  {
    id: 6,
    name: "Hospital Odontológico de Complejidad Integrada",
    location: "Formosa, Argentina",
    needed: "A-",
    priority: "Media",
  },
];

const priorityStyles = {
  Urgente: "bg-red-500 text-white",
  Alta: "bg-red-400 text-white",
  Media: "bg-yellow-400 text-gray-800",
  Baja: "bg-green-400 text-gray-800",
};

export default function InstitutionCarousel() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 352;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="container mx-auto px-6 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-foreground">Instituciones Con Solicitudes</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => scroll("left")}
            className="p-3 bg-primary/10 text-primary rounded-full shadow-lg hover:bg-primary/20 transition-colors"
            aria-label="Desplazar izquierda"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 bg-primary/10 text-primary rounded-full shadow-lg hover:bg-primary/20 transition-colors"
            aria-label="Desplazar derecha"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-scroll snap-x snap-mandatory space-x-4 pb-4 md:pb-6 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {institutions.map((institution) => (
          <div key={institution.id} className="flex-shrink-0 w-80 md:w-96 snap-start">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl border border-gray-100 h-full flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/30">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary leading-tight">{institution.name}</h3>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                    priorityStyles[institution.priority] || "bg-gray-200 text-gray-800"
                  }`}
                >
                  <Heart size={14} className="mr-1 fill-current" />
                  {institution.priority}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground border-b pb-2">
                  <strong className="text-foreground">Ubicación:</strong> {institution.location}
                </p>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold text-foreground">
                    Tipos de Sangre <span className="text-red-600 font-extrabold">Necesarios</span>:
                  </p>
                  <p className="text-lg font-extrabold text-red-600 mt-1">{institution.needed}</p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/mapa"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Ver en el Mapa y Donar
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
}
