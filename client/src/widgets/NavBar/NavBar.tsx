import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useUser } from "@/entities/user/hooks/useUser";
import { UserApi } from "@/entities/user/api/UserApi";
import { setAccessToken } from "@/shared/lib/axiosInstance";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import ProfileForm from '@/features/ProfileForm/ProfileForm';

const getColorForUser = (email: string): string => {
  const colors = [
    "#FF6B6B", // красный
    "#4ECDC4", // бирюзовый
    "#45B7D1", // голубой
    "#96CEB4", // мятный
    "#FFEEAD", // кремовый
    "#D4A5A5", // розовый
    "#9B59B6", // фиолетовый
    "#3498DB", // синий
    "#E67E22", // оранжевый
    "#2ECC71", // зеленый
  ];
  
  // Создаем числовое значение на основе email
  const hash = email.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Используем это значение для выбора цвета
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const styles = {
  navLink: {
    color: "black",
    textDecoration: "none",
    flex: 1,
    textAlign: "center" as const,
    fontSize: "1rem",
    fontWeight: 500,
    display: "block",
    width: "100%",
    border: "2px solid rgb(42, 41, 223)",
    borderRadius: "16px",
    padding: "8px 16px",
    transition: "all 0.3s ease",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgb(42, 41, 223)",
      color: "white",
    },
    "&.active": {
      backgroundColor: "rgb(42, 41, 223)",
    color: "white",
    },
  },
  box: {
    width: "100vw",
    margin: 0,
    padding: 0,
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
  },
  appBar: {
    width: "100%",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  navContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    gap: "20px",
  },
  siteTitle: {
    color: "black",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.5rem",
    flex: 1,
    textAlign: "center" as const,
  },
  logoutButton: {
    fontSize: "1rem",
    fontWeight: 500,
    flex: 1,
    textTransform: "none",
    border: "2px solid rgb(42, 41, 223)",
    borderRadius: "16px",
    padding: "8px 16px",
    transition: "all 0.3s ease",
    color: "black",
    "&:hover": {
      backgroundColor: "rgb(42, 41, 223)",
      color: "white",
    },
  },
  typography: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  menuItem: {
    fontSize: "1rem",
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "rgba(42, 41, 223, 0.1)",
    },
  },
  menu: {
    "& .MuiPaper-root": {
      width: "100%",
      marginTop: "4px",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  },
};

export default function NavBar(): React.JSX.Element {
  const { user, setUser } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isProfileFormOpen, setIsProfileFormOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const profileOpen = Boolean(profileAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>): void => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = (): void => {
    setProfileAnchorEl(null);
  };

  const handleProfileNavigate = (): void => {
    handleProfileClose();
    navigate(CLIENT_ROUTES.PROFILE);
  };

  const handleLogout = async (): Promise<void> => {
    handleProfileClose();
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
    <Box sx={{ flexGrow: 1, ...styles.box }}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Box sx={styles.navContainer}>
            <Typography variant="h6" component="div" sx={styles.typography}>
              <NavLink to="/" style={styles.siteTitle}>
                MotionLab
            </NavLink>
            </Typography>
            <Typography variant="body1" sx={styles.typography}>
              <Button 
                component={NavLink} 
                to={CLIENT_ROUTES.MAIN} 
                sx={styles.navLink}
                className={location.pathname === CLIENT_ROUTES.MAIN ? "active" : ""}
              >
                О проекте
              </Button>
            </Typography>
            <Typography variant="body1" sx={styles.typography}>
              <Button 
                component={NavLink} 
                to={CLIENT_ROUTES.BOOKS} 
                sx={styles.navLink}
                className={location.pathname === CLIENT_ROUTES.BOOKS ? "active" : ""}
              >
                Возможности
              </Button>
            </Typography>
            <Typography variant="body1" sx={styles.typography}>
              <Button
                onClick={handleClick}
                sx={{
                  ...styles.navLink,
                  backgroundColor: location.pathname.startsWith("/exercises") ? "rgb(42, 41, 223)" : "transparent",
                  color: location.pathname.startsWith("/exercises") ? "white" : "black",
                }}
              >
                Каталог упражнений
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transitionDuration={0}
                PaperProps={{
                  sx: {
                    width: anchorEl ? anchorEl.getBoundingClientRect().width : "auto",
                    maxHeight: 300,
                    marginTop: "4px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "2px solid rgb(42, 41, 223)",
                    backgroundColor: "white",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для шеи
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для спины
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для рук
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для ног
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для пресса
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Упражнения для плеч
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{
                  ...styles.menuItem,
                  "&:hover": {
                    backgroundColor: "rgb(42, 41, 223)",
                    color: "white",
                  },
                }}>
                  Общие упражнения
                </MenuItem>
              </Menu>
            </Typography>
            <Typography variant="body1" sx={styles.typography}>
              {user ? (
                <>
                  <Button 
                    onClick={handleProfileClick}
                    sx={styles.navLink}
                    className={location.pathname === CLIENT_ROUTES.PROFILE ? "active" : ""}
                  >
                    Профиль
                  </Button>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={profileOpen}
                    onClose={handleProfileClose}
                    transitionDuration={0}
                    PaperProps={{
                      sx: {
                        width: profileAnchorEl ? profileAnchorEl.getBoundingClientRect().width : "auto",
                        maxHeight: 300,
                        marginTop: "4px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "2px solid rgb(42, 41, 223)",
                        backgroundColor: "white",
                      },
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem 
                      onClick={handleProfileNavigate} 
                      sx={{
                        ...styles.menuItem,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "rgb(42, 41, 223)",
                          color: "white",
                        },
                      }}
                    >
                      Перейти в профиль
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: getColorForUser(user.email),
                          border: "2px solid black",
                        }}
                      >
                        {user.name?.[0] || "U"}
                      </Avatar>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setIsProfileFormOpen(true)} 
                      sx={{
                        ...styles.menuItem,
                        "&:hover": {
                          backgroundColor: "rgb(42, 41, 223)",
                          color: "white",
                        },
                      }}
                    >
                      Настройка профиля
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout} 
                      sx={{
                        ...styles.menuItem,
                        "&:hover": {
                          backgroundColor: "rgb(42, 41, 223)",
                          color: "white",
                        },
                      }}
                    >
                      Выйти
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  component={NavLink} 
                  to={CLIENT_ROUTES.LOGIN} 
                  sx={styles.navLink}
                  className={location.pathname === CLIENT_ROUTES.LOGIN ? "active" : ""}
                >
                  Войти
                </Button>
            )}
          </Typography>
          {user && (
        <ProfileForm
          open={isProfileFormOpen}
          onClose={() => setIsProfileFormOpen(false)}
          userId={user.id}
        />
      )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
