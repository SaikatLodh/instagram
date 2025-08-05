import React, { useContext, createContext, useState } from "react";

// Define the context type
interface ContextApiType {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value of `null`
const ContextApi = createContext<ContextApiType | null>(null);

// Context Provider Component
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  return (
    <ContextApi.Provider
      value={{
        email,
        setEmail,
        show,
        setShow,
        showNotification,
        setShowNotification,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

// Custom hook to use the context
export const useContextApi = (): ContextApiType => {
  const context = useContext(ContextApi);
  if (!context) {
    throw new Error("useContextApi must be used within a ContextProvider");
  }
  return context;
};
