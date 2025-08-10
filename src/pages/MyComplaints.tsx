import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getComplaintsByUser, getComplaintsByUserRemote, Complaint } from "@/state/complaints";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }: { status: Complaint["status"] }) => {
  const color = status === "Resolved" ? "bg-green-100 text-green-800" : status === "Reviewed" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";
  return <span className={`px-2 py-1 rounded-md text-xs ${color}`}>{status}</span>;
};

const MyComplaints = () => {
  const { data: items = getComplaintsByUser(), isLoading } = useQuery({
    queryKey: ["complaints", "me"],
    queryFn: () => getComplaintsByUserRemote(),
  });

  return (
    <div className="container py-6">
      <Helmet>
        <title>My Complaints | VNR AntiRag</title>
        <meta name="description" content="View and track your anti-ragging complaints and their statuses." />
        <link rel="canonical" href="/my" />
      </Helmet>

      <h1 className="text-2xl font-bold">My Complaints</h1>

      {isLoading ? (
        <p className="mt-4 text-muted-foreground">Loading complaints...</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No complaints yet. You can file a new report from the Report tab.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((c) => (
            <li key={c.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{c.type} — {c.location}</h3>
                  <p className="text-sm text-muted-foreground">Submitted on {new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-2 text-sm line-clamp-2">{c.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyComplaints;
