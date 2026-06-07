"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session) {
      router.replace("/");
    } else {
      const role = session.user.role; // Ensure 'role' is part of the session object
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "STAFF") {
        router.replace("/staff/dashboard");
      } else {
        router.replace("/");
      }
    }

    const handleSessionExpiration = () => {
      if (status === "unauthenticated") {
        router.push("/");
      }
    };

    const interval = setInterval(handleSessionExpiration, 3 * 60 * 60);

    return () => clearInterval(interval);
  }, [session, status, router]);

  return <div>Redirecting...</div>;
};

export default Dashboard;
