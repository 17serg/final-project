import React from "react";
import RouterProvider from "./router/RouterProvider";
import { UserProvider } from "@/entities/user/provider/UserProvider";
import { Provider } from "react-redux";
import { store } from "./store";


function App(): React.JSX.Element {
  return (
    // <BookProvider>
      <UserProvider>
      <Provider store={store}>
        <RouterProvider />;
        </Provider>
      </UserProvider>
    // </BookProvider>
  );
}

export default App;
