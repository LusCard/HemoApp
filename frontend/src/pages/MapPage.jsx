import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header"; // Ruta corregida
import { Search, MapPin, LocateFixed } from "lucide-react"; // Nuevos iconos para el estilo
import { useAuth } from "../context/AuthContext"; // Asumiendo que se sigue usando useAuth
import InstitutionCarousel from "../components/Carroussel";

// ** IMPORTANTE: Corrección de iconos de Leaflet **
// Esto asegura que los iconos del marcador se carguen correctamente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

// Lista de hospitales y centros de donación en Formosa
const hospitals = [
  {
    id: 1,
    name: "Hospital Central de Formosa",
    coords: [-26.1841, -58.1781],
    type: "Hospital General",
    urgency: "O+",
  },
  {
    id: 2,
    name: "Hospital de Alta Complejidad (HAC)",
    coords: [-26.186, -58.17],
    type: "Hospital Especializado",
    urgency: "Todos los tipos",
  },
  {
    id: 3,
    name: "Hospital Distrital 8",
    coords: [-26.1935, -58.1653],
    type: "Hospital Distrital",
    urgency: "B+",
  },
  {
    id: 4,
    name: "Centro Provincial de Hemoterapia",
    coords: [-26.19, -58.182],
    type: "Centro de Sangre",
    urgency: "O- (Urgente)",
  },
  {
    id: 5,
    name: "Hospital de la Madre y el Niño",
    coords: [-26.1812, -58.1745],
    type: "Hospital Materno-Infantil",
    urgency: "AB+",
  },
  {
    id: 6,
    name: "Hospital Odontológico de Complejidad Integrada",
    coords: [-26.1855, -58.1734],
    type: "Hospital Especializado",
    urgency: "A-",
  },
];

/**
 * FitBoundsToMarkers - Ajusta el zoom del mapa para mostrar todos los marcadores.
 */
function FitBoundsToMarkers({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;
    const latlngs = markers.map((m) => m.coords);
    // Ajusta el mapa con un padding de 50px
    map.fitBounds(latlngs, { padding: [50, 50], maxZoom: 14 });
  }, [map, markers]);
  return null;
}

/**
 * LocateButton - Botón de geolocalización con estilo FAB.
 */
function LocateButton({ onLocated }) {
  const map = useMap();

  const handleLocate = () => {
    // Solicita la ubicación del usuario al navegador y centra la vista
    map.locate({ setView: true, maxZoom: 14 });
  };

  useEffect(() => {
    // Escucha el evento cuando se encuentra la ubicación
    function onLocationFound(e) {
      const { latlng } = e;
      onLocated([latlng.lat, latlng.lng]);
    }
    map.on("locationfound", onLocationFound);
    return () => {
      map.off("locationfound", onLocationFound);
    };
  }, [map, onLocated]);

  // Estilizado como un botón de acción flotante (FAB)
  return (
    <div className="leaflet-bottom leaflet-right" style={{ padding: 15 }}>
      <button
        onClick={handleLocate}
        className="bg-primary text-white p-3 rounded-full shadow-xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        title="Encontrar mi ubicación"
      >
        <LocateFixed size={24} />
      </button>
    </div>
  );
}

export default function MapPage() {
  const { user } = useAuth(); // Obtener user del contexto
  const [userPos, setUserPos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Centro inicial de Formosa
  const center = [-26.1841, -58.1781];

  // Filtrar hospitales según el término de búsqueda
  const filteredHospitals = hospitals.filter(
    (h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.urgency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="container mx-auto py-8 px-6">
        {/* Título y Búsqueda */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-b-4 border-accent">
          <h1 className="text-4xl font-extrabold text-accent mb-2 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-red-500" />
            Mapa de Centros de Donación
          </h1>
          <p className="text-gray-600 mb-4">Localiza hospitales y bancos de sangre cercanos en Formosa.</p>

          {/* Barra de Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar hospital o tipo de sangre necesario (ej: O-)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-shadow duration-200 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Contenedor del Mapa */}
        <div className="w-full h-[65vh] md:h-[75vh] rounded-2xl shadow-2xl overflow-hidden border-4 border-white transform hover:scale-[1.005] transition-transform duration-300">
          <MapContainer
            center={center}
            zoom={12} // Zoom ligeramente más cerca
            style={{ height: "100%", width: "100%", zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredHospitals.map((h) => (
              <Marker key={h.id} position={h.coords}>
                <Popup>
                  <div className="p-3">
                    <strong className="block text-xl font-bold text-primary mb-1">{h.name}</strong>
                    <span className="text-sm text-gray-600 block mb-2">{h.type}</span>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                        h.urgency.includes("Urgente") ? "bg-red-500 text-white" : "bg-green-100 text-green-700"
                      }`}
                    >
                      Necesidad: {h.urgency}
                    </span>
                    <button className="mt-3 w-full bg-accent text-white py-1 rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium">
                      Cómo llegar
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Marcador y Círculo de Ubicación del Usuario */}
            {userPos && (
              <>
                <Marker position={userPos}>
                  <Popup>Tu ubicación actual</Popup>
                </Marker>
                <Circle center={userPos} radius={3000} pathOptions={{ color: "#ef4444", weight: 2, opacity: 0.8, fillOpacity: 0.1 }} />
              </>
            )}

            {/* Componentes Auxiliares */}
            <FitBoundsToMarkers markers={filteredHospitals} />
            <LocateButton onLocated={(pos) => setUserPos(pos)} />
          </MapContainer>
        </div>
      </div>

      {/* Carrusel de Instituciones (debajo del mapa) */}
      <InstitutionCarousel />
    </div>
  );
}
