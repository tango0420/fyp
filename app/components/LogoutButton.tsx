"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call custom logout endpoint to clear database sessions
      await fetch("/api/logout", {
        method: "POST",
      });

      // Then sign out from NextAuth
      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still try to sign out even if API call fails
      await signOut({ redirect: true, callbackUrl: "/login" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut size={18} />
      <span className="text-sm font-semibold uppercase tracking-widest">
        {isLoading ? "Logging out..." : ""}
      </span>
    </button>
  );
}
