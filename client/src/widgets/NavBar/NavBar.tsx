import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { NavLink } from "react-router";
import { useUser } from "@/entities/user/hooks/useUser";
import { UserApi } from "@/entities/user/api/UserApi";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import UserCard from "@/entities/user/ui/UserCard";

const styles = {
  navLink: {
    color: "white",
    marginRight: "20px",
    textDecoration: "none",
  },
};

export default function NavBar(): React.JSX.Element {
  const { user, setUser } = useUser();

  const logoutHandler = async (): Promise<void> => {
    try {
      const response = await UserApi.logout();
      if (response.status === 200) {
        setUser(null);
        setAccessToken("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to="/" style={styles.navLink}>
              {user ? `Welcome, ${user.name}` : "Guest"}
            </NavLink>
            <NavLink to={CLIENT_ROUTES.MAIN} style={styles.navLink}>
              Main
            </NavLink>
            {user && (<>
            <NavLink to={CLIENT_ROUTES.BOOKS} style={styles.navLink}>
              Books
            </NavLink>
            <NavLink to={CLIENT_ROUTES.ADDBOOK} style={styles.navLink}>
              AddBook
            </NavLink>
            </>)}
            {!user && (
              <>
                <NavLink to={CLIENT_ROUTES.SIGN_UP} style={styles.navLink}>
                  SignUp
                </NavLink>
                <NavLink to={CLIENT_ROUTES.LOGIN} style={styles.navLink}>
                  Login
                </NavLink>
              </>
            )}
          </Typography>
          <UserCard />
          {user && (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
