"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 w-full rounded-md border border-rose-400/30 bg-rose-500/20 p-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30"
    >
      Logout
    </button>
  );
}