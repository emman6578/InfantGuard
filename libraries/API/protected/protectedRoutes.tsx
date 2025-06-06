import { createContext, PropsWithChildren, useContext } from "react";
import { API_URL } from "../config/config";
import { useAuth } from "@/Context/AuthContext";

interface ProtectedRoutesType {
  GetInfantList: () => Promise<any>;
  GetTotalPercentageProgressVaccine: () => Promise<any>;
  OneInfant: (id: string) => Promise<any>;
  VaccineSchedule: (id: string) => Promise<any>;
  VaccineScheduleAll: () => Promise<any>;
  VaccineProgress: (id: string) => Promise<any>;
  CreateVaccineSchedule: (id: string) => Promise<any>;
  CreateVaccineProgress: (id: string) => Promise<any>;
  CreateChildInfo: (
    fullname: string,
    month: number,
    day: number,
    year: number,
    place_of_birth: string,
    height: number,
    gender: string,
    weight: number,
    mothers_name: string,
    fathers_name: string,
    health_center: string,
    family_no: number
  ) => Promise<any>;
  UploadChildProfileImage: (id: string, imageUri: string) => Promise<any>;
  storeNotification: (
    title: string,
    body: string,
    data: string
  ) => Promise<any>;
  getNotification: () => Promise<any>;
  updatePushTokenUser: (expoPushToken: string) => Promise<any>;
  ParentInfo: () => Promise<any>;
  GetFilesFromServer: () => Promise<any>;
  UploadParentProfileImage: (id: string, imageUri: string) => Promise<any>;
  updateInfant: (data: any, id: string) => Promise<any>;
  updateParent: (data: any, id: string) => Promise<any>;
  createMsg: (text: string) => Promise<any>;
  readMsg: (conversationId: string) => Promise<any>;
  loadConversation: () => Promise<any>;
}

const ProtectedRoutesContext = createContext<ProtectedRoutesType | undefined>(
  undefined
);

export const ProtectedRoutesContextProvider = ({
  children,
}: PropsWithChildren) => {
  //the authtoken is getting from auth context provider
  const { authToken } = useAuth();

  const GetInfantList = async () => {
    const res = await fetch(`${API_URL}/parent/info`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get infant details";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const OneInfant = async (id: string) => {
    const res = await fetch(`${API_URL}/parent/infant-info/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get one infant details";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const VaccineSchedule = async (id: string) => {
    const res = await fetch(`${API_URL}/parent/schedule/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get infant vaccine schedule";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const VaccineScheduleAll = async () => {
    const res = await fetch(`${API_URL}/parent/schedule`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get infant vaccine all schedule";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const VaccineProgress = async (id: string) => {
    const res = await fetch(`${API_URL}/parent/vaccine-names/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get infant vaccine progress";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const CreateVaccineSchedule = async (id: string) => {
    const data = {
      infant_id: id,
    };

    try {
      const res = await fetch(`${API_URL}/parent/vaccine`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to create vaccine schedule";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      // console.error("Error Creating Vaccine Schedule:", error);
      throw error;
    }
  };

  const CreateVaccineProgress = async (id: string) => {
    const data = {
      infant_id: id,
    };

    try {
      const res = await fetch(`${API_URL}/parent/progress`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Check if response is not OK (status code not in range 200-299)
        let errorMessage = "Failed to create vaccine progress";
        const responseBody = await res.json(); // Attempt to parse response body as JSON

        // Check if response body has an error message from the backend
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }

        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      console.error("Error Creating Vaccine Progress:", error);
      throw error;
    }
  };

  const GetTotalPercentageProgressVaccine = async () => {
    const res = await fetch(`${API_URL}/parent/percentage`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get infant vaccine percentage";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  // Updated CreateChildInfo function (without address fields)
  const CreateChildInfo = async (
    fullname: string,
    month: number,
    day: number,
    year: number,
    place_of_birth: string,
    height: number,
    gender: string,
    weight: number,
    mothers_name: string,
    fathers_name: string,
    health_center: string,
    family_no: number
  ) => {
    const data = {
      fullname,
      birthday: {
        month,
        day,
        year,
      },
      place_of_birth,
      height,
      gender,
      weight,
      mothers_name,
      fathers_name,
      health_center,
      family_no,
    };

    try {
      const res = await fetch(`${API_URL}/parent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let errorMessage = "Failed to create infant";
        const responseBody = await res.json();
        if (responseBody && responseBody.message) {
          errorMessage = responseBody.message;
        }
        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error) {
      console.error("Error Creating Infant details:", error);
      throw error;
    }
  };

  const UploadChildProfileImage = async (id: string, imageUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: imageUri?.split("/").pop(),
      type: "image/jpeg",
    } as any);

    try {
      const res = await fetch(`${API_URL}/parent/upload-img/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const responseBody = await res.json();
        throw new Error(responseBody?.message);
      }

      return await res.json();
    } catch (error) {
      console.error("Error Creating Infant details:", error);
      throw error;
    }
  };

  const storeNotification = async (
    title: string,
    body: string,
    data: string
  ) => {
    const details = {
      title,
      body,
      data,
    };
    const res = await fetch(`${API_URL}/notification/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to update vaccine progress";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const getNotification = async () => {
    const res = await fetch(`${API_URL}/notification/get`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to update vaccine progress";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const updatePushTokenUser = async (expoPushToken: string) => {
    const details = {
      expoPushToken,
    };
    const res = await fetch(`${API_URL}/parent/pushToken`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to update vaccine progress";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const ParentInfo = async () => {
    const res = await fetch(`${API_URL}/parent/parent-info`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get parent details";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const GetFilesFromServer = async () => {
    const res = await fetch(`${API_URL}/admin/file`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Check if response is not OK (status code not in range 200-299)
      let errorMessage = "Failed to get files from server";
      const responseBody = await res.json(); // Attempt to parse response body as JSON

      // Check if response body has an error message from the backend
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const UploadParentProfileImage = async (id: string, imageUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: imageUri?.split("/").pop(),
      type: "image/jpeg",
    } as any);

    try {
      const res = await fetch(`${API_URL}/parent/upload-img-parent/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const responseBody = await res.json();
        throw new Error(responseBody?.message);
      }

      return await res.json();
    } catch (error) {
      console.error("Error Creating Infant details:", error);
      throw error;
    }
  };

  const updateInfant = async (data: any, id: string) => {
    const res = await fetch(`${API_URL}/parent/infant-update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = "Failed to update parent";
      const responseBody = await res.json();
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const updateParent = async (data: any, id: string) => {
    const res = await fetch(`${API_URL}/parent/parent-update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = "Failed to update parent";
      const responseBody = await res.json();
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const createMsg = async (text: string) => {
    const data = {
      text,
    };

    const res = await fetch(`${API_URL}/msg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = "Failed to send text";
      const responseBody = await res.json();
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const readMsg = async (conversationId: string) => {
    const res = await fetch(`${API_URL}/msg/${conversationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      let errorMessage = "Failed to read message";
      const responseBody = await res.json();
      if (responseBody && responseBody.message) {
        errorMessage = responseBody.message;
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  };

  const loadConversation = async () => {
    const res = await fetch(`${API_URL}/msg`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      let errorMessage = "Failed to read message";
      const responseBody = await res.json();
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
        GetInfantList,
        GetTotalPercentageProgressVaccine,
        OneInfant,
        VaccineSchedule,
        VaccineScheduleAll,
        VaccineProgress,
        CreateVaccineSchedule,
        CreateVaccineProgress,
        CreateChildInfo,
        UploadChildProfileImage,
        storeNotification,
        getNotification,
        updatePushTokenUser,
        ParentInfo,
        GetFilesFromServer,
        UploadParentProfileImage,
        updateParent,
        updateInfant,
        createMsg,
        readMsg,
        loadConversation,
      }}
    >
      {children}
    </ProtectedRoutesContext.Provider>
  );
};

export const useProtectedRoutesApi = (): ProtectedRoutesType => {
  const context = useContext(ProtectedRoutesContext);
  if (context === undefined) {
    throw new Error("Getting error from ProtectedRoutes API");
  }
  return context;
};
