"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

export default function Header() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-panel border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="font-heading text-sm font-semibold text-text/50 uppercase tracking-widest">
          Mission Control
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orbit-blue/20 flex items-center justify-center text-xs text-orbit-blue font-bold">
              {profile?.name?.charAt(0) || "A"}
            </div>
          )}
          <span className="text-sm text-text font-medium">
            {profile?.name || "Admin"}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-xs bg-card border border-border rounded-md text-text/70 hover:text-red-400 hover:border-red-400/30 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
