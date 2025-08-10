import heroImage from "@/assets/hero-anti-rag.jpg";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ListChecks, Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <Helmet>
        <title>Home | VNR AntiRag — Report Ragging Safely</title>
        <meta name="description" content="Welcome to VNR AntiRag. Quickly report ragging, view your complaints, or contact the committee." />
        <link rel="canonical" href="/" />
      </Helmet>

      <section className="relative">
        <img
          src={heroImage}
          alt="VNR Anti Ragging safety banner with abstract campus and shield icon"
          loading="lazy"
          className="w-full h-56 object-cover"
        />
        <div className="container relative -mt-10">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold inline-flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              VNR Anti Ragging Committee
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your safety matters. Report incidents privately or anonymously. Offline-first with auto-sync when online.
            </p>
          </div>
        </div>
      </section>

      <section className="container grid gap-4 sm:grid-cols-3 mt-6">
        <Link to="/report" className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-3 font-semibold">File New Complaint</h2>
          <p className="text-sm text-muted-foreground">Start a 3-step guided report.</p>
        </Link>

        <Link to="/my" className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <ListChecks className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-3 font-semibold">View My Complaints</h2>
          <p className="text-sm text-muted-foreground">Track status and details.</p>
        </Link>

        <Link to="/contact" className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-3 font-semibold">Contact Committee</h2>
          <p className="text-sm text-muted-foreground">Reach us via call or email.</p>
        </Link>
      </section>
    </div>
  );
};

export default Index;
