import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { JSX } from "react";
import { getActiveSession } from "../helpers/getActiveSession";

interface ProtectedRouteProps {
	element: JSX.Element;
	allowedRoles: string[];
}

export default function ProtectedRoute({
	element,
	allowedRoles,
}: ProtectedRouteProps) {
	const session = useSelector(getActiveSession);
  console.log('the session',session)

	if (!session) return <Navigate to="/" />;

	const role = session.role;

	if (!role || !allowedRoles.includes(role)) {
		const loginRedirects: Record<string, string> = {
			client: "/",
			vendor: "/vendor/login",
			admin: "/admin/login",
		};
	
		const redirectPath = loginRedirects[role as keyof typeof loginRedirects] || "/unauthorized";
		return <Navigate to={redirectPath} />;
	}
	
	return element;
};
