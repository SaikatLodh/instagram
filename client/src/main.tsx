import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../context/Contextapi.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={false} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <App />
            <Toaster />
          </ContextProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
