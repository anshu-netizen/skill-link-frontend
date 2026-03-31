"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Mail, User, Briefcase, Calendar } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  skills: any[];
  savedJobs: any[];
  postedJobs: any[];
  education: any[];
  experience: any[];
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);

  // FULL FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    skills: "",
    education: "",
    experience: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(storedUser);

    const load = async () => {
      try {
        const data = await userService.getUserById(id);
        const u = data.user;

        setUser(u);

        // preload form
        setForm({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "",
          skills: (u.skills || []).join(", "),
          education: (u.education || []).join(", "),
          experience: (u.experience || []).join(", "),
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // UPDATE USER
  const handleUpdate = async () => {
    if (!user) return;

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,

      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      education: form.education
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      experience: form.experience
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const updated = await userService.updateUser(user._id, payload);

    setUser(updated.user);
    setEditOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        No user found
      </div>
    );
  }

  const avatar = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* HEADER */}
      <div className="bg-[#003580] py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

          <div className="w-28 h-28 rounded-full bg-[#ffb700] flex items-center justify-center text-4xl font-black text-[#003580] shadow-lg">
            {avatar}
          </div>

          <div className="text-white">
            <h1 className="text-4xl font-black">{user.name}</h1>

            <p className="text-blue-100 mt-1 flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Badge text={user.role} />
              <Badge text={user.isVerified ? "Verified" : "Not Verified"} />
              <Badge text={user.isActive ? "Active" : "Inactive"} />
            </div>

            {/* <button
              onClick={() => setEditOpen(true)}
              className="mt-5 bg-[#ffb700] text-[#003580] px-4 py-2 rounded-lg font-bold"
            >
              Edit Profile
            </button> */}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard icon={<User />} label="Skills" value={user.skills.length} />
        <StatCard icon={<Briefcase />} label="Saved Jobs" value={user.savedJobs.length} />
        <StatCard icon={<Briefcase />} label="Posted Jobs" value={user.postedJobs.length} />
        <StatCard icon={<Calendar />} label="Member Since" value={new Date(user.createdAt).getFullYear()} />
      </div>

      {/* DETAILS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10 pb-20 grid md:grid-cols-2 gap-6">

        <Card title="Account Info">
          <Info label="User ID" value={user._id} />
          <Info label="Email" value={user.email} />
          <Info label="Role" value={user.role} />
        </Card>

        <Card title="Activity">
          <Info label="Skills Added" value={user.skills.length} />
          <Info label="Education Records" value={user.education.length} />
          <Info label="Experience Records" value={user.experience.length} />
        </Card>

      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[450px] rounded-xl p-6 shadow-lg max-h-[80vh] overflow-auto">

            <h2 className="text-xl font-black mb-4">Edit Profile</h2>

            <input
              className="w-full border p-2 rounded mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />

            <input
              className="w-full border p-2 rounded mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <input
              className="w-full border p-2 rounded mb-3"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Role"
            />

            <textarea
              className="w-full border p-2 rounded mb-3"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="Skills (comma separated)"
            />

            <textarea
              className="w-full border p-2 rounded mb-3"
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
              placeholder="Education (comma separated)"
            />

            <textarea
              className="w-full border p-2 rounded mb-3"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
              placeholder="Experience (comma separated)"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-2 bg-[#003580] text-white rounded"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Badge({ text }: { text: string }) {
  return (
    <span className="bg-[#ffb700] text-[#003580] px-3 py-1 rounded-full text-xs font-bold">
      {text}
    </span>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="text-[#003580]">{icon}</div>
      <p className="text-slate-500 text-xs mt-2">{label}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}