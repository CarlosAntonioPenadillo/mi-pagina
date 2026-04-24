import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVisits } from "@/hooks/useVisits";
import { ArrowLeft, Calendar, IdCard, MessageSquare, Trash2, User, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVisit, removeVisit, loaded } = useVisits();
  const visit = id ? getVisit(id) : undefined;

  if (loaded && !visit) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Visita no encontrada</h2>
        <p className="text-muted-foreground mb-6">El registro solicitado no existe o fue eliminado.</p>
        <Button asChild>
          <Link to="/visitas">Volver al listado</Link>
        </Button>
      </div>
    );
  }
  if (!visit) return null;

  const created = new Date(visit.createdAt);

  const handleDelete = () => {
    removeVisit(visit.id);
    toast({ title: "Visita eliminada", description: visit.fullName });
    navigate("/visitas");
  };

  const rows = [
    { icon: User, label: "Nombre completo", value: visit.fullName },
    { icon: IdCard, label: "DNI", value: visit.dni },
    { icon: UserCheck, label: "Persona visitada", value: visit.visiting },
    { icon: MessageSquare, label: "Motivo", value: visit.reason },
    {
      icon: Calendar,
      label: "Fecha y hora",
      value: created.toLocaleString("es-PE", { dateStyle: "long", timeStyle: "short" }),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/visitas")} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver al listado
      </Button>

      <Card className="overflow-hidden border-0 shadow-elegant">
        <div className="bg-gradient-hero text-primary-foreground p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur grid place-items-center text-2xl font-bold">
              {visit.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1">
              <Badge className="bg-white/20 hover:bg-white/20 text-primary-foreground mb-2 border-0">
                Registro #{visit.id.slice(0, 8)}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold">{visit.fullName}</h1>
              <p className="text-white/80 text-sm mt-1">
                Registrado el {created.toLocaleDateString("es-PE", { dateStyle: "long" })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-1">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 py-3 border-b last:border-b-0">
              <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary grid place-items-center shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {label}
                </p>
                <p className="font-medium mt-0.5 break-words">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-muted/40 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="outline" asChild>
            <Link to="/visitas">Cerrar</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar registro
          </Button>
        </div>
      </Card>
    </div>
  );
}
