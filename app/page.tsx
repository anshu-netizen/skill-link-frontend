"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // If user exists, send them to their dashboard
        if (user.role === "provider") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard/seeker");
        }
      } catch (error) {
        // If JSON is corrupted, clear it and go to login
        localStorage.clear();
        router.push("/login");
      }
    } else {
      // No user? Go to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium tracking-wide">
          Connecting to SkillLink...
        </p>
      </div>
    </div>
  );
}