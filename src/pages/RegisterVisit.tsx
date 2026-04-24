import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVisits } from "@/hooks/useVisits";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(3, "Nombre demasiado corto").max(100),
  dni: z.string().trim().regex(/^\d{7,12}$/, "DNI debe tener 7-12 dígitos"),
  reason: z.string().trim().min(3, "Indica un motivo").max(200),
  visiting: z.string().trim().min(3, "Indica a quién visita").max(100),
});

const initial = { fullName: "", dni: "", reason: "", visiting: "" };

export default function RegisterVisit() {
  const navigate = useNavigate();
  const { addVisit } = useVisits();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const fmtNow = now.toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const onChange = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const v = addVisit(parsed.data as Required<typeof parsed.data>);
      toast({
        title: "Visita registrada",
        description: `${v.fullName} fue registrado correctamente.`,
      });
      navigate(`/visitas/${v.id}`);
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registrar visita</h1>
        <p className="text-muted-foreground mt-1">
          Completa los datos de la persona que ingresa a la institución.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-0 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary-soft/60 text-primary px-3 py-2 rounded-lg mb-6 w-fit">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{fmtNow}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre completo *" error={errors.fullName}>
              <Input
                value={form.fullName}
                onChange={onChange("fullName")}
                placeholder="Ej. María Fernández López"
                className="h-11"
              />
            </Field>

            <Field label="DNI *" error={errors.dni}>
              <Input
                value={form.dni}
                onChange={onChange("dni")}
                placeholder="Ej. 45821093"
                inputMode="numeric"
                className="h-11"
                maxLength={12}
              />
            </Field>

            <Field label="Persona a quien visita *" error={errors.visiting}>
              <Input
                value={form.visiting}
                onChange={onChange("visiting")}
                placeholder="Ej. Prof. Carlos Ramírez"
                className="h-11"
              />
            </Field>

            <Field label="Motivo de la visita *" error={errors.reason}>
              <Input
                value={form.reason}
                onChange={onChange("reason")}
                placeholder="Ej. Reunión con tutor"
                className="h-11"
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setForm(initial)}>
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-primary shadow-md h-11"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {submitting ? "Registrando..." : "Registrar visita"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
