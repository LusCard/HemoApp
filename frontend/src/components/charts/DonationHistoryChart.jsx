import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  { month: "Ene", donaciones: 3, intenciones: 6, solicitudes: 10 },
  { month: "Feb", donaciones: 3, intenciones: 5, solicitudes: 12 },
  { month: "Mar", donaciones: 5, intenciones: 4, solicitudes: 8 },
  { month: "Abr", donaciones: 2, intenciones: 3, solicitudes: 15 },
  { month: "May", donaciones: 6, intenciones: 7, solicitudes: 7 },
  { month: "Jun", donaciones: 4, intenciones: 6, solicitudes: 11 },
];

export function DonationHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Donaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="solicitudes" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="intenciones" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="donaciones" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
