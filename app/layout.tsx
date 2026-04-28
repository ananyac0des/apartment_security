import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

export const metadata = {
  title: "Apartment Security System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">

          {/* SIDEBAR */}
          <div className="w-64 bg-gray-900 text-white p-5">
            <h2 className="text-xl font-bold mb-6">
              Security System
            </h2>

            <nav className="flex flex-col gap-3">
              <Link href="/" className="hover:bg-gray-700 p-2 rounded">
                Residents
              </Link>

              <Link href="/entry" className="hover:bg-gray-700 p-2 rounded">
                Entry Logs
              </Link>

              <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
                Dashboard
              </Link>

              <Link href="/visitors" className="hover:bg-gray-700 p-2 rounded">
                Visitors
              </Link>

              <Link href="/incidents" className="hover:bg-gray-700 p-2 rounded">
                Incidents
              </Link>

              {/* FIXED LOGOUT */}
              <LogoutButton />
            </nav>
          </div>

          {/* MAIN */}
          <div className="flex-1 bg-gray-100 p-6">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}