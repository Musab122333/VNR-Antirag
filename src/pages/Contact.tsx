import { Helmet } from "react-helmet-async";
import { Phone, Mail } from "lucide-react";

const Contact = () => {
  const contact = {
    name: "Anti Ragging Committee, VNRVJIET",
    phone: "+91 98765 43210",
    email: "antirag@vnrvjiet.ac.in",
  };

  return (
    <div className="container py-6">
      <Helmet>
        <title>Contact Us | VNR AntiRag</title>
        <meta name="description" content="Get in touch with the VNR Anti Ragging Committee via phone or email." />
        <link rel="canonical" href="/contact" />
      </Helmet>

      <h1 className="text-2xl font-bold">Contact Us</h1>
      <div className="mt-4 rounded-xl border p-4 space-y-3">
        <p className="font-semibold">{contact.name}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-secondary">
            <Phone className="h-4 w-4" /> Call {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-secondary">
            <Mail className="h-4 w-4" /> Email {contact.email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
