import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { ShieldCheck, Home, FileText, Phone, User } from "lucide-react";
import logo from "@/assets/vnr-logo.png";

const MainLayout = () => {
  const location = useLocation();
  const active = useMemo(() => location.pathname, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 border-b bg-white/70 dark:bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="VNR Anti Ragging logo" className="h-8 w-8" loading="eager" />
            <span className="inline-flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Anti Ragging Committee
            </span>
          </Link>
          <NavLink to="/profile" className="inline-flex items-center justify-center h-9 w-9 rounded-full border hover:bg-secondary transition-[background]" aria-label="Profile">
            <User className="h-5 w-5" />
          </NavLink>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 z-40 border-t bg-white/80 dark:bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl grid grid-cols-3">
          <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 py-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}> 
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `flex flex-col items-center gap-1 py-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}> 
            <FileText className="h-5 w-5" />
            <span className="text-xs">Report</span>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 py-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}> 
            <Phone className="h-5 w-5" />
            <span className="text-xs">Contact Us</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
