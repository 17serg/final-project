import React from "react";
import { UserProvider } from "@/entities/user/provider/UserProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import { RouterProvider } from "./router/RouterProvider";
import { AnimatedBackground } from "@/shared/ui/AnimatedBackground/AnimatedBackground";
import { Box } from "@mui/material";

const styles = {
  appContainer: {
    minHeight: '90vh',
    position: 'relative',
    zIndex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }
};

export default function App(): React.JSX.Element {
  return (
    <UserProvider>
      <Provider store={store}>
        <AnimatedBackground />
        <Box sx={styles.appContainer}>
          <RouterProvider />
        </Box>
      </Provider>
    </UserProvider>
  );
}
