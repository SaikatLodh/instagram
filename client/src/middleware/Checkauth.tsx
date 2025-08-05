import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Checkauth = ({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: React.ReactNode;
}) => {
  const location = useLocation();

  if (
    isAuth &&
    (location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/sendotp" ||
      location.pathname === "/verifyotp" ||
      location.pathname === "/forgotemail" ||
      location.pathname.startsWith("/forgotresetpassword"))
  ) {
    return <Navigate to="/" />;
  }

  if (
    !isAuth &&
    (location.pathname === "/" ||
      location.pathname === "/createpost" ||
      location.pathname === "/explore" ||
      location.pathname === "/chat" ||
      location.pathname === "/notification" ||
      location.pathname === "/profile" ||
      location.pathname === "/profileedit" ||
      location.pathname === "/getreels" ||
      location.pathname.startsWith("/otheraccount") ||
      location.pathname.startsWith("/updatepost") ||
      location.pathname.startsWith("/updatereels"))
  ) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default Checkauth;
