import { Link } from "react-router";
import { useMe } from "@/features/auth/api";

export function ProfilePage() {
  const { data: user, isPending, isError } = useMe();

  if (isPending) return <p className="p-6">Завантаження...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Не вдалося завантажити профіль.</p>;

  return (
    <div className="max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Профіль</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="text-gray-500">Ім’я</dt>
        <dd>
          {user.firstName} {user.lastName}
        </dd>
        <dt className="text-gray-500">Email</dt>
        <dd>{user.email}</dd>
        <dt className="text-gray-500">Телефон</dt>
        <dd>{user.phoneNumber ?? "—"}</dd>
        <dt className="text-gray-500">Роль</dt>
        <dd>{user.roles.join(", ")}</dd>
      </dl>
      <p className="mt-4">
        <Link to="/" className="text-blue-600 hover:underline">
          На головну
        </Link>
      </p>
    </div>
  );
}
