import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addComplaint, addComplaintRemote } from "@/state/complaints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LOCATIONS = [
  "Annapurna Canteen",
  "C Block",
  "B Block",
  "A Block",
  "JSK Greens",
  "Girls Hostel",
  "Boys Hostel",
];

const TYPES = ["Bullying", "Harassing", "Underrated Harassment"];

type Step = 1 | 2 | 3;

const Report = () => {
  const [step, setStep] = useState<Step>(1);
  const [location, setLocation] = useState<string>("");
  const [issueType, setIssueType] = useState<string>("");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [knows, setKnows] = useState(false);
  const [privacy, setPrivacy] = useState<"Private" | "Anonymous">("Private");
  const navigate = useNavigate();

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const canNext = () => {
    if (step === 1) return !!location;
    if (step === 2) return !!issueType;
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roll || !email || !mobile || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    const local = addComplaint({
      location,
      type: issueType,
      name,
      rollNumber: roll,
      email,
      mobile,
      description,
      knowsPerson: knows,
      privacy,
    });
    // Attempt remote write in background; do not block UX
    addComplaintRemote({
      location,
      type: issueType,
      name,
      rollNumber: roll,
      email,
      mobile,
      description,
      knowsPerson: knows,
      privacy,
    }).catch(() => {/* ignore */});
    toast.success("Complaint submitted successfully");
    navigate("/my");
    return local;
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>Report | VNR AntiRag — Submit Complaint</title>
        <meta name="description" content="File a new anti-ragging complaint in 3 quick steps: location, type, and details." />
        <link rel="canonical" href="/report" />
      </Helmet>

      <h1 className="text-2xl font-bold">Report Ragging</h1>
      <p className="text-muted-foreground mb-4">3-step interactive form</p>

      <div className="rounded-xl border p-4">
        <div className="mb-4 flex items-center gap-3 text-sm">
          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>1</div>
          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>2</div>
          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>3</div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="font-semibold mb-2">Step 1 – Select Location</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={`rounded-md border px-3 py-2 text-sm ${location === loc ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary'}`}
                  onClick={() => setLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold mb-2">Step 2 – Select Type of Bullying</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`rounded-md border px-3 py-2 text-sm ${issueType === t ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary'}`}
                  onClick={() => setIssueType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="roll">Roll Number</Label>
                <Input id="roll" value={roll} onChange={(e) => setRoll(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="desc">Issue Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <input id="knows" type="checkbox" className="h-4 w-4" checked={knows} onChange={(e) => setKnows(e.target.checked)} />
              <Label htmlFor="knows">Do you know the person who ragged you?</Label>
            </div>
            <div>
              <Label htmlFor="privacy">Privacy Option</Label>
              <select id="privacy" className="mt-1 w-full rounded-md border bg-background p-2" value={privacy} onChange={(e) => setPrivacy(e.target.value as any)}>
                <option value="Private">Private</option>
                <option value="Anonymous">Anonymous</option>
              </select>
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="secondary" onClick={back}>Go Back</Button>
              <Button type="submit">Submit Report</Button>
            </div>
          </form>
        )}

        {step !== 3 && (
          <div className="flex justify-between pt-4">
            <Button type="button" variant="secondary" onClick={back} disabled={step === 1}>Go Back</Button>
            <Button type="button" onClick={next} disabled={!canNext()}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
