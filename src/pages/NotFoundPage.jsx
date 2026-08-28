import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return <div className="page-shell grid min-h-[70dvh] place-items-center text-center"><div><p className="text-7xl font-semibold text-primary">404</p><h1 className="mt-4 text-2xl font-semibold">Page not found</h1><p className="mt-2 text-base-content/60">This path does not belong to the reading experience.</p><Link to="/" className="btn btn-primary mt-6">Return home</Link></div></div>;
}

