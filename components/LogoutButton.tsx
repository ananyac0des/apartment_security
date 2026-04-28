"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 bg-red-600 p-2 rounded w-full"
    >
      Logout
    </button>
  );
}