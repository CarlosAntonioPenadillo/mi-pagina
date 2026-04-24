import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Clock, CalendarDays, ArrowRight, ListChecks, QrCode } from "lucide-react";
import { useVisits } from "@/hooks/useVisits";
import { useMemo } from "react";

export default function Dashboard() {
  const { visits } = useVisits();

  const stats = useMemo(() => {
    const today = new Date();
    const isToday = (iso: string) => {
      const d = new Date(iso);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    };
    const todayVisits = visits.filter((v) => isToday(v.createdAt));
    const lastHour = visits.filter(
      (v) => Date.now() - new Date(v.createdAt).getTime() < 60 * 60 * 1000
    );
    return {
      today: todayVisits.length,
      total: visits.length,
      lastHour: lastHour.length,
      latest: visits.slice(0, 5),
    };
  }, [visits]);

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const cards = [
    { label: "Visitas hoy", value: stats.today, icon: CalendarDays, accent: "from-primary to-primary-glow" },
    { label: "Última hora", value: stats.lastHour, icon: Clock, accent: "from-accent to-primary-glow" },
    { label: "Total registradas", value: stats.total, icon: Users, accent: "from-primary-glow to-accent" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Resumen del día</h1>
        </div>
        <Button asChild className="bg-gradient-primary shadow-md">
          <Link to="/registro">
            <UserPlus className="h-4 w-4 mr-2" />
            Nueva visita
          </Link>
        </Button>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="p-6 border-0 shadow-card hover:shadow-elegant transition-base">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <p className="text-4xl font-bold mt-2 tracking-tight">{value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${accent} grid place-items-center shadow-md`}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions + recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 border-0 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Visitas recientes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/visitas">
                Ver todas <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y">
            {stats.latest.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Aún no hay visitas registradas.
              </p>
            )}
            {stats.latest.map((v) => (
              <Link
                key={v.id}
                to={`/visitas/${v.id}`}
                className="flex items-center gap-4 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-base"
              >
                <div className="h-10 w-10 rounded-full bg-primary-soft text-primary grid place-items-center font-semibold text-sm">
                  {v.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{v.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {v.reason} · {v.visiting}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {fmtTime(v.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-card">
          <h2 className="font-semibold text-lg mb-4">Accesos rápidos</h2>
          <div className="space-y-3">
            <QuickLink to="/registro" icon={UserPlus} title="Registrar" desc="Nueva visita" />
            <QuickLink to="/visitas" icon={ListChecks} title="Listado" desc="Ver todas" />
            <QuickLink to="/qr" icon={QrCode} title="Código QR" desc="Compartir acceso" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary-soft/40 transition-base group"
    >
      <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-base">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-base" />
    </Link>
  );
}
