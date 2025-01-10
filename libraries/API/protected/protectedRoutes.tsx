import { createContext, PropsWithChildren, useContext } from "react";
import { API_URL } from "../config/config";
import { useAuth } from "@/Context/AuthContext";

interface ProtectedRoutesType {
  GetDriverLoggedIn: () => Promise<any>;
}

const ProtectedRoutesContext = createContext<ProtectedRoutesType | undefined>(
  undefined
);

export const ProtectedRoutesContextProvider = ({
  children,
}: PropsWithChildren) => {
  //the authtoken is getting from auth context provider
  const { authToken } = useAuth();

  const GetDriverLoggedIn = async () => {
    const res = await fetch(`${API_URL}/driver/delivery`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get logged in driver";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  return (
    <ProtectedRoutesContext.Provider
      value={{
        GetDriverLoggedIn,
      }}
    >
      {children}
    </ProtectedRoutesContext.Provider>
  );
};

export const useProtectedRoutesApi = (): ProtectedRoutesType => {
  const context = useContext(ProtectedRoutesContext);
  if (context === undefined) {
    throw new Error(
      "useProductsApi must be used within a ProductApiContextProvider"
    );
  }
  return context;
};
