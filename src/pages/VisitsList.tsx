import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useVisits } from "@/hooks/useVisits";
import { Search, UserPlus, Eye, Trash2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type FilterRange = "all" | "today" | "week";

export default function VisitsList() {
  const { visits, removeVisit } = useVisits();
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<FilterRange>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return visits.filter((v) => {
      const matchesQ =
        !q ||
        v.fullName.toLowerCase().includes(q) ||
        v.dni.includes(q) ||
        v.visiting.toLowerCase().includes(q) ||
        v.reason.toLowerCase().includes(q);

      let matchesRange = true;
      const d = new Date(v.createdAt);
      if (range === "today") {
        matchesRange =
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate();
      } else if (range === "week") {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesRange = d.getTime() >= weekAgo;
      }
      return matchesQ && matchesRange;
    });
  }, [visits, query, range]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = (id: string, name: string) => {
    removeVisit(id);
    toast({ title: "Visita eliminada", description: `Se eliminó el registro de ${name}.` });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listado de visitas</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} de {visits.length} registros
          </p>
        </div>
        <Button asChild className="bg-gradient-primary shadow-md">
          <Link to="/registro">
            <UserPlus className="h-4 w-4 mr-2" /> Nueva visita
          </Link>
        </Button>
      </div>

      <Card className="p-4 border-0 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, DNI, motivo..."
              className="pl-10 h-11"
            />
          </div>
          <Select value={range} onValueChange={(v) => setRange(v as FilterRange)}>
            <SelectTrigger className="sm:w-48 h-11">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Solo hoy</SelectItem>
              <SelectItem value="week">Últimos 7 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Visitante</TableHead>
                <TableHead className="font-semibold">DNI</TableHead>
                <TableHead className="font-semibold">Motivo</TableHead>
                <TableHead className="font-semibold">Visita a</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No se encontraron visitas con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v) => (
                  <TableRow key={v.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-soft text-primary grid place-items-center font-semibold text-xs shrink-0">
                          {v.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium">{v.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{v.dni}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {v.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.visiting}</TableCell>
                    <TableCell className="text-muted-foreground tabular-nums whitespace-nowrap">
                      {fmtDate(v.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link to={`/visitas/${v.id}`} aria-label="Ver detalle">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(v.id, v.fullName)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
