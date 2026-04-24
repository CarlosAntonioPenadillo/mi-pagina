import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, Lock, User, AlertCircle, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loaded } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (loaded && user) navigate("/dashboard", { replace: true });
  }, [loaded, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const res = login(username.trim(), password);
      if (res.ok) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.error);
        setSubmitting(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <Card className="w-full max-w-md p-8 shadow-elegant border-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">EduVisitas</p>
            <p className="text-xs text-muted-foreground">Control institucional</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
          <p className="text-muted-foreground text-sm">
            Inicia sesión para continuar al panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                className="pl-10 h-11"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-10 h-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-gradient-primary hover:opacity-95 shadow-md"
          >
            {submitting ? "Verificando..." : "Acceder"}
          </Button>

          <div className="text-xs text-center text-muted-foreground bg-muted/60 rounded-lg p-3">
            <strong className="text-foreground">Demo:</strong> usuario <code className="px-1 rounded bg-background">admin</code> · contraseña <code className="px-1 rounded bg-background">admin123</code>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Acceso rápido por QR</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white border shrink-0">
              <QRCodeCanvas
                value={appUrl}
                size={96}
                level="M"
                includeMargin={false}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Escanea con tu celular para abrir EduVisitas.
              </p>
              <p className="text-xs font-mono break-all text-foreground/80">
                {appUrl}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
