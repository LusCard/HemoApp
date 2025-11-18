import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Droplet } from "lucide-react";
import { DonationHistoryChart } from "@/components/charts/DonationHistoryChart";
import { BloodTypeAvailabilityChart } from "@/components/charts/BloodTypeAvailabilityChart";

// Datos mock de solicitudes
const mockRequests = [
  {
    id: 1,
    patientName: "María González",
    bloodType: "O+",
    hospital: "Hospital Central de Formosa",
    urgency: "urgente",
    time: "Hace 15 minutos",
    units: 2,
  },
  {
    id: 2,
    patientName: "Juan Pérez",
    bloodType: "A+",
    hospital: "Hospital de Alta Complejidad (HAC)",
    urgency: "media",
    time: "Hace 1 hora",
    units: 1,
  },
  {
    id: 3,
    patientName: "Carlos Ramírez",
    bloodType: "B-",
    hospital: "Centro Provincial de Hemoterapia",
    urgency: "urgente",
    time: "Hace 30 minutos",
    units: 3,
  },
  {
    id: 4,
    patientName: "Ana Martínez",
    bloodType: "AB+",
    hospital: "Hospital Central de Formosa",
    urgency: "baja",
    time: "Hace 3 horas",
    units: 1,
  },
  {
    id: 5,
    patientName: "Luis Fernández",
    bloodType: "O-",
    hospital: "Hospital de Alta Complejidad (HAC)",
    urgency: "urgente",
    time: "Hace 5 minutos",
    units: 4,
  },
];

export default function BloodRequestsPage({ user }) {
  const [filterBloodType, setFilterBloodType] = useState("all");

  const filteredRequests = filterBloodType === "all" ? mockRequests : mockRequests.filter((req) => req.bloodType === filterBloodType);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgente":
        return "destructive";
      case "media":
        return "default";
      case "baja":
        return "secondary";
      default:
        return "default";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case "urgente":
        return "URGENTE";
      case "media":
        return "Media";
      case "baja":
        return "Baja";
      default:
        return urgency;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-2">Solicitudes de Sangre</h1>
          <p className="text-muted-foreground mb-8">Ayuda a quienes más lo necesitan</p>

          {/* Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Filtrar por tipo de sangre</label>
            <Select value={filterBloodType} onValueChange={setFilterBloodType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="border-l-4"
                style={{
                  borderLeftColor:
                    request.urgency === "urgente" ? "hsl(var(--destructive))" : request.urgency === "media" ? "hsl(var(--accent))" : "hsl(var(--muted))",
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{request.patientName}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={getUrgencyColor(request.urgency)}>{getUrgencyText(request.urgency)}</Badge>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                          <Droplet className="w-3 h-3 mr-1" />
                          {request.bloodType}
                        </Badge>
                        <Badge variant="outline">
                          {request.units} {request.units === 1 ? "unidad" : "unidades"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{request.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{request.time}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90">Quiero ayudar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <DonationHistoryChart />
          </div>

          {filteredRequests.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No hay solicitudes para este tipo de sangre en este momento</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
