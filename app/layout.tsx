"use client";

import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import ConnectivityStatus from "../components/ConnectivityStatus";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);
    setLoaded(true);
  }, [pathname]);

  if (!loaded) {
    return (
      <html lang="en">
        <body className="bg-slate-950"></body>
      </html>
    );
  }

  let links: { href: string; label: string }[] = [];

  if (role === "admin") {
    links = [
      { href: "/", label: "Residents" },
      { href: "/visitors", label: "Visitors" },
      { href: "/incidents", label: "Incidents" },
      { href: "/maintenance", label: "Maintenance" },
      { href: "/access-cards", label: "Access Cards" },
    ];
  } else if (role === "guard") {
    links = [
      { href: "/entry", label: "Entry Logs" },
      { href: "/visitors", label: "Visitors" },
    ];
  } else if (role === "resident") {
    links = [
      { href: "/visitors", label: "Visitors" },
      { href: "/maintenance", label: "Maintenance" },
    ];
  }

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-slate-950 text-slate-100">

          {/* SIDEBAR */}
          {pathname !== "/login" && (
            <aside className="w-72 border-r border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
              <h2 className="mb-1 text-xl font-bold">Apartment Security</h2>
              <p className="mb-6 text-sm text-slate-400">
                Operations Control Panel
              </p>

              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-4">
                  <LogoutButton />
                </div>
              </nav>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-end">
              <ConnectivityStatus />
            </div>

            {children}
          </main>

        </div>
      </body>
    </html>
  );
}