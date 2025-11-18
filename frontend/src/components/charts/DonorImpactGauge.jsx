import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function DonorImpactGauge({ data, totalLives }) {
  // Validación: Si no hay datos o las donaciones son 0, mostramos un anillo gris "vacío"
  const hasData = data && data.some((item) => item.value > 0);

  // Datos para mostrar (o placeholder si está vacío)
  const chartData = hasData ? data : [{ name: "Sin actividad", value: 1, fill: "#e5e7eb" }];

  return (
    <Card className="w-full h-full min-h-[350px]">
      <CardHeader>
        <CardTitle>Uso de Componentes Sanguíneos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" // Centro X
                cy="50%" // Centro Y
                innerRadius={80} // Radio interno (hace que sea un aro/gauge)
                outerRadius={110} // Radio externo
                paddingAngle={5} // Espacio blanco entre secciones
                dataKey="value"
                cornerRadius={6} // Bordes redondeados de cada sección
                stroke="none"
              >
                {/* Mapeamos los datos para asignar el color específico de cada elemento */}
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>

              {/* Tooltip personalizado al pasar el mouse */}
              <Tooltip
                formatter={(value, name) => {
                  if (!hasData) return ["-", "Sin datos"];
                  return [`${value} Unidades`, name];
                }}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              {/* Leyenda en la parte inferior */}
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>

          {/* Texto en el centro del Aro (Gauge) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-4xl font-extrabold text-foreground">{hasData ? totalLives : 0}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
              Vidas
              <br />
              Impactadas
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
