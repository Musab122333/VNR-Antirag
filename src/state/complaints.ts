export type ComplaintStatus = "Pending" | "Reviewed" | "Resolved";

export type Complaint = {
  id: string;
  createdAt: string;
  userId: string;
  location: string;
  type: string;
  name: string;
  rollNumber: string;
  email: string;
  mobile: string;
  description: string;
  knowsPerson: boolean;
  privacy: "Private" | "Anonymous";
  status: ComplaintStatus;
};

const STORAGE_KEY = "vnr_antirag_complaints";
const PROFILE_KEY = "vnr_antirag_profile";
const FIREBASE_COLLECTION = "complaints";

function read(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Complaint[]) : [];
  } catch {
    return [];
  }
}

function write(items: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getCurrentUserId(): string {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return "guest";
  try {
    const p = JSON.parse(raw);
    return p?.userId || "guest";
  } catch {
    return "guest";
  }
}

export function upsertProfile(profile: { userId?: string; name?: string; email?: string; mobile?: string }) {
  const existing = getProfile();
  const next = { ...existing, ...profile };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

export function getProfile(): { userId: string; name?: string; email?: string; mobile?: string } {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { userId: "guest" };
    const parsed = JSON.parse(raw);
    return { userId: parsed.userId || "guest", name: parsed.name, email: parsed.email, mobile: parsed.mobile };
  } catch {
    return { userId: "guest" };
  }
}

export function addComplaint(data: Omit<Complaint, "id" | "createdAt" | "status" | "userId">) {
  const list = read();
  const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const userId = getCurrentUserId();
  const item: Complaint = {
    id,
    createdAt: new Date().toISOString(),
    userId,
    status: "Pending",
    ...data,
  };
  list.unshift(item);
  write(list);
  return item;
}

export function getComplaintsByUser(userId?: string) {
  const uid = userId || getCurrentUserId();
  return read().filter((c) => c.userId === uid);
}

export function updateComplaintStatus(id: string, status: ComplaintStatus) {
  const list = read();
  const idx = list.findIndex((c) => c.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    write(list);
  }
}

// --- Firebase (Firestore) integration ---
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

function isFirebaseConfigured(): boolean {
  return (
    Boolean(import.meta.env.VITE_FIREBASE_API_KEY) &&
    Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)
  );
}

function parseCreatedAt(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    try {
      return (value as Timestamp).toDate().toISOString();
    } catch {
      /* noop */
    }
  }
  return new Date().toISOString();
}

export async function addComplaintRemote(
  data: Omit<Complaint, "id" | "createdAt" | "status" | "userId"> & { userId?: string }
): Promise<Complaint | null> {
  if (!isFirebaseConfigured()) return null;
  const userId = data.userId || getCurrentUserId();
  const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), {
    userId,
    location: data.location,
    type: data.type,
    name: data.name,
    rollNumber: data.rollNumber,
    email: data.email,
    mobile: data.mobile,
    description: data.description,
    knowsPerson: data.knowsPerson,
    privacy: data.privacy,
    status: "Pending",
    createdAt: serverTimestamp(),
  });
  const created: Complaint = {
    id: docRef.id,
    createdAt: new Date().toISOString(),
    userId,
    status: "Pending",
    location: data.location,
    type: data.type,
    name: data.name,
    rollNumber: data.rollNumber,
    email: data.email,
    mobile: data.mobile,
    description: data.description,
    knowsPerson: data.knowsPerson,
    privacy: data.privacy,
  };
  return created;
}

export async function getComplaintsByUserRemote(userId?: string): Promise<Complaint[]> {
  if (!isFirebaseConfigured()) return getComplaintsByUser(userId);
  const uid = userId || getCurrentUserId();
  const q = query(collection(db, FIREBASE_COLLECTION), where("userId", "==", uid));
  const snap = await getDocs(q);
  const items: Complaint[] = [];
  snap.forEach((doc) => {
    const d = doc.data() as any;
    items.push({
      id: doc.id,
      userId: d.userId,
      location: d.location,
      type: d.type,
      name: d.name,
      rollNumber: d.rollNumber,
      email: d.email,
      mobile: d.mobile,
      description: d.description,
      knowsPerson: d.knowsPerson,
      privacy: d.privacy,
      status: d.status as ComplaintStatus,
      createdAt: parseCreatedAt(d.createdAt),
    });
  });
  // newest first
  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return items;
}

export async function attemptSync(): Promise<{ synced: number }>{
  const local = read();
  if (!isFirebaseConfigured()) return { synced: local.length };
  let synced = 0;
  for (const item of local) {
    try {
      await addDoc(collection(db, FIREBASE_COLLECTION), {
        ...item,
        createdAt: Timestamp.fromDate(new Date(item.createdAt)),
      });
      synced += 1;
    } catch {
      // ignore
    }
  }
  return { synced };
}
