import { useState, useEffect } from "react";
import Header from "@/components/Header"; // Cambio a alias @
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Cambio a alias @
import { Progress } from "@/components/ui/progress"; // Cambio a alias @
import { DonorImpactGauge } from "@/components/charts/DonorImpactGauge"; // Cambio a alias @
import { useAuth } from "@/context/AuthContext"; // Cambio a alias @

export default function DonorStatusPage() {
  const { user, handleUpdateUser } = useAuth();
  const [status, setStatus] = useState("donante");

  // Constantes de lógica de negocio
  const ESTIMATE_HELPER = {
    blood: 3, // Sangre entera impacta a 3 (RBC + Plasma + Plaquetas)
    plasma: 1, // Plasma solo impacta a 1
    platelets: 1, // Plaquetas solo impactan a 1
    unknown: 1,
  };

  const DEFERRAL_PERIODS = {
    blood: 90, // 90 días
    plasma: 30, // 30 días
    platelets: 15, // 15 días
    unknown: 90,
  };

  useEffect(() => {
    if (user?.status) {
      setStatus(user.status);
    }
  }, [user]);

  // Lógica Mock/Real:
  const realDonationCount = (user?.donations || []).length || user?.donationCount || 0;

  // **CORRECCIÓN AQUÍ**: Si el usuario tiene 0 donaciones, usamos 5 para mostrar los MOCK DATA.
  // Si tiene donaciones reales, usamos ese número.
  const showMockData = realDonationCount === 0;
  const donationCount = showMockData ? 5 : realDonationCount;

  // Calculamos vidas impactadas totales
  const livesImpacted = donationCount * ESTIMATE_HELPER.blood;

  // Generamos los datos del gráfico simulando que cada donación se separó en sus 3 componentes
  const bloodComponentsData = [
    {
      name: "Glóbulos Rojos",
      value: donationCount, // 1 unidad por donación
      impact: "Oxigenación",
      fill: "#ef4444", // Rojo
    },
    {
      name: "Plasma",
      value: donationCount, // 1 unidad por donación
      impact: "Coagulación",
      fill: "#eab308", // Amarillo
    },
    {
      name: "Plaquetas",
      value: donationCount, // 1 unidad por donación
      impact: "Tratamientos Cáncer",
      fill: "#3b82f6", // Azul
    },
  ];

  const saveStatus = (newStatus) => {
    setStatus(newStatus);
    const updatedData = { status: newStatus };
    handleUpdateUser(updatedData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Impacto de tus Donaciones</h1>
          <p className="text-muted-foreground mb-8">Descubre cómo tu sangre se transforma en vida.</p>

          {/* Aviso de Datos Mock (Solo visible si son datos falsos) */}
          {showMockData && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center justify-center">
              ℹ️ Visualizando datos de demostración. Registra una donación real para ver tus estadísticas personales.
            </div>
          )}

          {/* Panel Principal de Métricas */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 1. Estado del Donante */}
            <Card className="border-2 border-muted/20">
              <CardHeader>
                <CardTitle className="text-foreground">Estado Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select
                    className="w-full rounded-md border border-input bg-background p-2 text-sm"
                    value={status}
                    onChange={(e) => saveStatus(e.target.value)}
                  >
                    <option value="donante">🟢 Disponible para donar</option>
                    <option value="no_puede_donar">🔴 Periodo de espera (Deferral)</option>
                    <option value="paciente">🏥 Soy Paciente</option>
                    <option value="otro">⚪ Otro</option>
                  </select>

                  {status === "no_puede_donar" && (
                    <div className="p-3 bg-accent/10 rounded-md text-sm text-accent">
                      <strong>Recordatorio:</strong> Debes esperar {DEFERRAL_PERIODS.blood} días entre donaciones de sangre entera.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 2. Métrica Clave: Vidas Salvadas */}
            <Card className="border-2 border-muted/20 bg-gradient-to-br from-white to-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">Vidas Impactadas Estimadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-5xl font-extrabold text-foreground block">{livesImpacted}</span>
                    <span className="text-sm text-muted-foreground">personas beneficiadas</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-foreground">{donationCount}</span>
                    <span className="text-xs text-muted-foreground block">donaciones totales</span>
                  </div>
                </div>
                <Progress value={Math.min((livesImpacted / 30) * 100, 100)} className="h-2 mt-4" />
                <p className="text-xs text-right text-muted-foreground mt-1">Meta anual: 30 vidas</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Desglose */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <DonorImpactGauge data={bloodComponentsData} totalLives={livesImpacted} />
            </div>

            {/* Info Card lateral */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-lg">¿Sabías qué?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Tu donación de sangre entera se separa en tres componentes vitales en el laboratorio.</p>

                <p>Con una donacion de 450ml de sangre entera estas ayuduando en un promedio a:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>
                      <strong>Globulos rojos:</strong> 3 personas en cirugías y accidentes.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>
                      <strong>Plasma:</strong> 1 persona en quemaduras y coagulación.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>
                      <strong>Plaquetas:</strong> 1 persona en tratamientos oncológicos.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
