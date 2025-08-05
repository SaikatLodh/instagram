import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../api/axiosinstance/axiosinstance";
import toast from "react-hot-toast";
import { MessageFolloers, User } from "../../src/types";
import { endPoints } from "../../api/endpoints/endpoints";

interface AuthState {
  isAuth: boolean;
  user: null | User;
  loading: boolean;
  email: string | null;
  selectedUser?: MessageFolloers | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  loading: false,
  email: null,
  selectedUser: null,
};

export const otpsend = createAsyncThunk(
  "auth/otpsend",
  async (data: { email: string }) => {
    try {
      const response = await axiosInstance.post(endPoints.auth.otpsend, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const verifyotp = createAsyncThunk(
  "auth/verifyotp",
  async (data: { email: string; otp: number }) => {
    try {
      const response = await axiosInstance.post(
        endPoints.auth.verifyotp,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const registeruser = createAsyncThunk(
  "auth/register",
  async (data: { email: string; password: string; username: string }) => {
    try {
      const response = await axiosInstance.post(endPoints.auth.register, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: {
    email: string;
    password: string;
  }): Promise<User | undefined> => {
    try {
      const response = await axiosInstance.post(endPoints.auth.login, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.message) {
        localStorage.setItem("token", response.data.data.token);
        toast.success(response.data.message);
      }
      return response.data.data.user as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const forgotpassword = createAsyncThunk(
  "auth/forgotpassword",
  async (data: { email: string }) => {
    try {
      const response = await axiosInstance.post(
        endPoints.auth.forgotsendemail,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const resetpassword = createAsyncThunk(
  "auth/resetpassword",
  async ({
    data,
    token,
  }: {
    data: { password: string; confirmPassword: string };
    token: string | undefined;
  }) => {
    try {
      const response = await axiosInstance.post(
        `${endPoints.auth.forgotresetpassword}/${token}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await axiosInstance.get(endPoints.auth.logout);
    if (response.data.message) {
      localStorage.removeItem("token");
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.message) {
        toast.error(error.response.data.message);
      }
    }
  }
});

export const getprofile = createAsyncThunk(
  "auth/getprofile",
  async (): Promise<User | undefined> => {
    try {
      const response = await axiosInstance.get(`${endPoints.user.getuser}`);
      return response.data.data as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      }
    }
  }
);

export const checkuserlogin = createAsyncThunk(
  "auth/checkuserlogin",
  async (): Promise<
    | {
        statuscode: number;
        message: string;
        success: boolean;
      }
    | undefined
  > => {
    try {
      const response = await axiosInstance.get(endPoints.auth.checkuserlogin);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          console.log(error.response.data.message);
        }
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetLoading: (state) => {
      state.loading = false;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuth = false;
    },
    setSelectedUser: (state, action: PayloadAction<MessageFolloers | null>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(otpsend.pending, (state) => {
        state.loading = true;
      })
      .addCase(otpsend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(otpsend.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyotp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyotp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyotp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registeruser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registeruser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registeruser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<User | undefined>) => {
          state.loading = false;

          if (action.payload) {
            state.isAuth = true;
            state.user = action.payload;
          }
        }
      )
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(forgotpassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotpassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotpassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(resetpassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetpassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetpassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getprofile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getprofile.fulfilled,
        (state, action: PayloadAction<User | undefined>) => {
          state.loading = false;
          if (action.payload) {
            state.user = action.payload;
          }
        }
      )
      .addCase(getprofile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(checkuserlogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkuserlogin.fulfilled, (state, action) => {
        if (!action.payload?.success) {
          state.isAuth = false;
          state.loading = false;
          state.user = null;
          localStorage.removeItem("token");
        } else {
          state.loading = false;
        }
      })
      .addCase(checkuserlogin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetLoading, setEmail, logoutUser, setSelectedUser } =
  authSlice.actions;
export default authSlice.reducer;
