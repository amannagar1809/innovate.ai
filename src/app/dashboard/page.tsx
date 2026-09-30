"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService, type UserPayload } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (!isActive) return;

      const accessToken = window.localStorage.getItem("access_token");
      const storedUser = authService.getStoredUser();

      if (!accessToken || !storedUser) {
        authService.clearLocalSession();
        router.replace("/");
        return;
      }

      setUser(storedUser);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await authService.logout().catch(() => undefined);
    router.replace("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-emerald-700">INNOVATE AI</p>
            <h1 className="mt-3 text-3xl font-semibold">Dashboard</h1>
            {isLoading ? (
              <p aria-live="polite" className="mt-2 text-sm text-zinc-600" role="status">
                Loading your account...
              </p>
            ) : user ? (
              <p className="mt-2 text-sm text-zinc-600">Signed in as {user.email}</p>
            ) : null}
          </div>
          {user && (
            <button
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-60"
              disabled={isSigningOut}
              onClick={handleLogout}
              type="button"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}