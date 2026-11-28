import { Link, useRouteError } from "react-router";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Щось пішло не так</h1>
      <p className="mt-2">
        <Link to="/" className="text-blue-600 hover:underline">
          На головну
        </Link>
      </p>
    </div>
  );
}
