import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getComplaintsByUser, getComplaintsByUserRemote, Complaint } from "@/state/complaints";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const StatusBadge = ({ status }: { status: Complaint["status"] }) => {
  const color = status === "Resolved" ? "bg-green-100 text-green-800" : status === "Reviewed" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800";
  return <span className={`px-2 py-1 rounded-md text-xs ${color}`}>{status}</span>;
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const userEmail = "user@email.com"; // Replace with logged-in user's email

  useEffect(() => {
    async function fetchComplaints() {
      const q = query(collection(db, "reports"), where("email", "==", userEmail));
      const snapshot = await getDocs(q);
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchComplaints();
  }, []);

  return (
    <div className="container py-6">
      <Helmet>
        <title>My Complaints | VNR AntiRag</title>
        <meta name="description" content="View and track your anti-ragging complaints and their statuses." />
        <link rel="canonical" href="/my" />
      </Helmet>

      <h1 className="text-2xl font-bold">My Complaints</h1>

      {complaints.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Your complaint Have been recieved. Action will be taken Immediately.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {complaints.map((c) => (
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
