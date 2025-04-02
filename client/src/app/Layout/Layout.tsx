import { UserApi } from "@/entities/user/api/UserApi";
import { useUser } from "@/entities/user/hooks/useUser";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import Footer from "@/widgets/Footer.tsx/Footer";
import NavBar from "@/widgets/NavBar/NavBar";
import { Container } from "@mui/material";
import React, { useEffect } from "react";

import { Outlet } from "react-router";

export default function Layout(): React.JSX.Element {
  const { setUser } = useUser();

  useEffect(() => {
    UserApi.refreshTokens().then((response) => {
      if (response.status === 200) {
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
      }
    });
  }, [setUser]);
  return (
    <>
      <Container>
        <NavBar />
        <Outlet />
        <Footer />
      </Container>
    </>
  );
}
