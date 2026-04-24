import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import { Download, Copy, Smartphone, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function QrPage() {
  const defaultUrl = window.location.origin;
  const [url, setUrl] = useState(defaultUrl);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Enlace copiado", description: "URL lista para compartir." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "No se pudo copiar", variant: "destructive" });
    }
  };

  const handleDownload = () => {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "eduvisitas-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Código QR de acceso</h1>
        <p className="text-muted-foreground mt-1">
          Comparte este QR para que las visitas accedan al sistema desde su celular.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 border-0 shadow-card flex flex-col items-center justify-center text-center">
          <div
            ref={wrapperRef}
            className="p-6 rounded-2xl bg-white border-2 border-primary-soft shadow-elegant"
          >
            <QRCodeCanvas
              value={url}
              size={240}
              level="H"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground max-w-xs">
            Escanea con la cámara de tu celular para abrir EduVisitas.
          </p>
          <div className="flex gap-3 mt-6 w-full max-w-xs">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <Button className="flex-1 bg-gradient-primary shadow-md" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-0 shadow-card">
            <h2 className="font-semibold mb-1">URL del sistema</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Modifica el enlace si quieres apuntar a una pantalla específica.
            </p>
            <Label className="text-xs">Enlace</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1.5 h-11 font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="secondary" size="sm" onClick={() => setUrl(defaultUrl)}>
                Inicio
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setUrl(`${defaultUrl}/registro`)}>
                Registrar visita
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setUrl(`${defaultUrl}/visitas`)}>
                Listado
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-card bg-gradient-soft">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Cómo usarlo</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Imprime o muestra el QR en recepción.</li>
                  <li>El visitante abre la cámara y escanea.</li>
                  <li>Se abre EduVisitas directamente en su navegador.</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
