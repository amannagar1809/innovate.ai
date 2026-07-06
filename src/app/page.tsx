"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { getErrorMessage } from "@/services/apiService";

export default function Home() {
  const [status, setStatus] = useState("Connecting to backend...");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.me();
        setStatus(`Connected successfully: ${response.data?.user?.email ?? "user loaded"}`);
      } catch (error) {
        setStatus(`Connection issue: ${getErrorMessage(error)}`);
      }
    };

    loadUser();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-3xl font-bold">Innovate AI</h1>
      </div>
    </main>
  );
}
