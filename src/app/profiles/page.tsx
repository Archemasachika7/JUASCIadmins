"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/AdminLayout";
import { SkeletonRow } from "@/components/Skeleton";
import type { Profile } from "@/lib/types";

const PLANS = ["free", "monthly", "annual"];
const ROLES = ["member", "admin"];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      console.error("Failed to fetch profiles:", fetchError);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updatePlan = async (userId: string, plan: string) => {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", userId);

    if (updateError) {
      setError(`Failed to update plan: ${updateError.message}`);
      console.error("Plan update error:", updateError);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, plan } : p))
      );
    }
  };

  const updateRole = async (userId: string, role: string) => {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (updateError) {
      setError(`Failed to update role: ${updateError.message}`);
      console.error("Role update error:", updateError);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role } : p))
      );
    }
  };

  const deleteProfileImage = async (userId: string, imageUrl: string | null) => {
    if (!imageUrl) return;

    const filePath = imageUrl.split("/profiles/")[1];
    if (filePath) {
      await supabase.storage.from("profiles").remove([filePath]);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_image: null })
      .eq("id", userId);

    if (updateError) {
      setError(`Failed to delete profile image: ${updateError.message}`);
      console.error("Delete profile image error:", updateError);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, profile_image: null } : p))
      );
    }
  };

  const deleteAccount = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this account? This cannot be undone.")) return;

    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (deleteError) {
      setError(`Failed to delete account: ${deleteError.message}`);
      console.error("Delete account error:", deleteError);
    } else {
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-text">Profiles</h1>
        <p className="text-text/50 text-sm mt-1">Manage member accounts and plans</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400 text-sm">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="bg-panel border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Image</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Name</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Department</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Year</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Plan</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Role</th>
                <th className="text-left p-4 text-text/50 font-mono-tech text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="p-0">
                        <SkeletonRow />
                      </td>
                    </tr>
                  ))
                : profiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                      <td className="p-4">
                        {profile.profile_image ? (
                          <img
                            src={profile.profile_image}
                            alt={profile.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-xs text-text/50">
                            {profile.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-text font-medium">{profile.name || "—"}</td>
                      <td className="p-4 text-text/70">{profile.department || "—"}</td>
                      <td className="p-4 text-text/70 font-mono-tech">{profile.year || "—"}</td>
                      <td className="p-4">
                        <select
                          value={profile.plan || "free"}
                          onChange={(e) => updatePlan(profile.id, e.target.value)}
                          className="bg-card border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-orbit-blue"
                        >
                          {PLANS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={profile.role || "member"}
                          onChange={(e) => updateRole(profile.id, e.target.value)}
                          className="bg-card border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-orbit-blue"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteProfileImage(profile.id, profile.profile_image)}
                            disabled={!profile.profile_image}
                            className="px-2 py-1 text-xs bg-card border border-border rounded text-text/50 hover:text-yellow-400 hover:border-yellow-400/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete profile image"
                          >
                            🗑️ Image
                          </button>
                          <button
                            onClick={() => deleteAccount(profile.id)}
                            className="px-2 py-1 text-xs bg-card border border-border rounded text-text/50 hover:text-red-400 hover:border-red-400/30 transition-colors"
                            title="Delete account"
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
