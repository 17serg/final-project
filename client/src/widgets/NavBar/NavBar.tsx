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
import { IUserProfile } from '@/entities/user/model';
import { getUserColor } from '@/shared/utils/userColor';
import { AuthModal } from '@/shared/ui/AuthModal/AuthModal';
import { useTheme } from '@mui/material/styles';
import { fonts } from '@/shared/styles/fonts';

const styles = {
  navLink: {
    ...fonts.delaGothicOne,
    color: "white",
    marginTop: "12px",
    textDecoration: "none",
    flex: 1,
    textAlign: "center" as const,
    fontSize: "1.3rem",
    fontWeight: 600,
    display: "block",
    width: "100%",
    border: "2px solid white",
    borderRadius: "16px",
    padding: "8px 16px",
    transition: "all 0.3s ease",
    textTransform: "none",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "rgba(0, 0, 0, 0.9)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      border: "2px solid rgba(0, 0, 0, 0.2)",
    },
    "&.active": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "rgba(0, 0, 0, 0.9)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      border: "2px solid rgba(0, 0, 0, 0.2)",
    },
  },
  box: {
    width: "100%",
    margin: 0,
    padding: 0,
    position: "relative",
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
    ...fonts.delaGothicOne,
    marginTop: "12px",
    color: "white",
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
    border: "2px solid white",
    borderRadius: "16px",
    padding: "8px 16px",
    transition: "all 0.3s ease",
    color: "white",
    backgroundColor: "transparent",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "rgba(0, 0, 0, 0.9)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      border: "2px solid rgba(0, 0, 0, 0.2)",
    },
  },
  typography: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  menuItem: {
    ...fonts.delaGothicOne,
    fontSize: "1rem",
    padding: "8px 16px",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "rgba(0, 0, 0, 0.9)",
    },
  },
  menu: {
    "& .MuiPaper-root": {
      width: "100%",
      marginTop: "4px",
      borderRadius: "16px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      backgroundColor: "transparent",
      border: "2px solid white",
    },
  },
  avatar: {
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
      transform: "scale(1.05)",
    },
  },
  profileForm: {
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    borderRadius: "16px",
  },
};

export default function NavBar(): React.JSX.Element {
  const { user, setUser } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isProfileFormOpen, setIsProfileFormOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<IUserProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  const theme = useTheme();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  React.useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const response = await UserApi.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (user) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

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

  const handleCatalogExNavigate = (): void => {
    handleProfileClose();
    navigate(CLIENT_ROUTES.CATALOGEXERCISE);
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

  const getAvatarUrl = (): string => {
    if (profile?.avatar) {
      const baseUrl = import.meta.env.VITE_API.replace('/api', '');
      return `${baseUrl}${profile.avatar}`;
    }
    return "";
  };

  // Добавляем обработчик события для обновления профиля
  React.useEffect(() => {
    const handleProfileUpdate = async (): Promise<void> => {
      if (user) {
        try {
          const response = await UserApi.getProfile();
          if (response.data) {
            setProfile(response.data);
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    };

    // Добавляем слушатель события
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavigate = (route: string): void => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    navigate(route);
  };

  return (
    <>
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
                  to={user?.trener ? CLIENT_ROUTES.ALLCLIENTS : CLIENT_ROUTES.ALLTRENER} 
                  sx={styles.navLink}
                  className={location.pathname === (user?.trener ? CLIENT_ROUTES.ALLCLIENTS : CLIENT_ROUTES.ALLTRENER) ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(user?.trener ? CLIENT_ROUTES.ALLCLIENTS : CLIENT_ROUTES.ALLTRENER);
                  }}
                >
                  {user?.trener ? "Список клиентов" : "Список тренеров"} 
                </Button>
              </Typography>
              <Typography variant="body1" sx={styles.typography}>
                <Button
                  component={NavLink} 
                  to={CLIENT_ROUTES.CATALOGEXERCISE}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(CLIENT_ROUTES.CATALOGEXERCISE);
                  }}
                  sx={{
                    ...styles.navLink,
                    backgroundColor: location.pathname.startsWith("/exercises") ? "rgb(42, 41, 223)" : "transparent",
                    color: location.pathname.startsWith("/exercises") ? "white" : "white",
                  }}
                >
                  Каталог упражнений
                </Button>
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
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                          color: "white",
                          // border: "2px solid white",
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(128, 128, 128, 0.7) 70%)',
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
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            color: "rgba(0, 0, 0, 0.9)",
                          },
                        }}
                      >
                        Перейти в профиль
                        <Avatar 
                          src={getAvatarUrl()}
                          sx={{ 
                            width: 42, 
                            height: 42,
                            bgcolor: user ? getUserColor(user.email) : '#BAE1FF',
                            border: "2px solid rgba(161, 161, 161, 0.93)",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {user?.name?.[0] || "U"}
                        </Avatar>
                      </MenuItem>
                      <MenuItem 
                        onClick={() => setIsProfileFormOpen(true)} 
                        sx={{
                          ...styles.menuItem,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            color: "rgba(0, 0, 0, 0.9)",
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
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            color: "rgba(0, 0, 0, 0.9)",
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
            </Box>
        </Toolbar>
      </AppBar>
        {isProfileFormOpen && (
          <ProfileForm 
            open={isProfileFormOpen} 
            onClose={() => setIsProfileFormOpen(false)} 
            userId={user?.id || 0}
          />
        )}
    </Box>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
