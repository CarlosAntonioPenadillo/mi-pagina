import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserPlus, ListChecks, QrCode, LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/registro", label: "Registrar visita", icon: UserPlus },
  { to: "/visitas", label: "Listado", icon: ListChecks },
  { to: "/qr", label: "Código QR", icon: QrCode },
];

export default function AppLayout() {
  const { user, logout, loaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaded && !user) navigate("/login", { replace: true });
  }, [loaded, user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-md">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground leading-tight">EduVisitas</p>
            <p className="text-xs text-muted-foreground">Sistema de control</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-base ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">EduVisitas</span>
          </div>
          <Button size="sm" variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden order-last fixed bottom-0 inset-x-0 bg-card border-t flex justify-around py-2 z-40">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label.split(" ")[0]}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
