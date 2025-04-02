import React from "react";
import { Navigate, Outlet } from "react-router";

type PrivateRouterProps = {
  children?: React.ReactElement;
  isAllowed: boolean;
  redirect?: string;
};

export default function ProtecteRouter({
  children,
  isAllowed,
  redirect = "/",
}: PrivateRouterProps): React.JSX.Element {
  if (!isAllowed) return <Navigate to={redirect} />;
  return children || <Outlet />;
}
