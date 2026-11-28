import { Link, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth/store";

export function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Ви дійсно хочете вийти з облікового запису?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4">
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-lg font-bold">
            Booking Servis
          </Link>
          <div className="ml-auto flex items-center gap-4">
            {token ? (
              <>
                <Link to="/profile" className="text-blue-600 hover:underline">
                  {user?.firstName ?? "Профіль"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Увійти
                </Link>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
