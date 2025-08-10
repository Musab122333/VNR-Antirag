import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { upsertProfile, getProfile } from "@/state/complaints";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const p = getProfile();
    setName(p.name || "");
    setEmail(p.email || "");
    setMobile(p.mobile || "");
  }, []);

  const save = () => {
    const userId = `u_${email || 'guest'}`;
    upsertProfile({ userId, name, email, mobile });
    toast.success("Profile saved");
  };

  const logout = () => {
    upsertProfile({ userId: "guest", name: "", email: "", mobile: "" });
    setName("");
    setEmail("");
    setMobile("");
    toast.success("Logged out");
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>Profile | VNR AntiRag</title>
        <meta name="description" content="View and edit your profile for the VNR AntiRag app." />
        <link rel="canonical" href="/profile" />
      </Helmet>

      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 grid gap-4 max-w-xl">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile</Label>
          <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button onClick={save}>Save</Button>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
