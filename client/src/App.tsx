import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { MainLayout } from "./componenets/MainLayout ";
import Login from "./componenets/auth/Login";
import Register from "./componenets/auth/Register";
import Sendotp from "./componenets/auth/Sendotp";
import Otpverify from "./componenets/auth/Otpverify";
import Forgotsendemail from "./componenets/auth/Forgotsendemail";
import Forgotresetpassword from "./componenets/auth/Forgotresetpassword";
import Createpost from "./componenets/post/Createpost";
import Home from "./pages/Home ";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import Checkauth from "./middleware/Checkauth";
import Updatepost from "./componenets/post/Updatepost";
import Profile from "./pages/Profile";
import Profileedit from "./pages/Profileedit";
import { useEffect } from "react";
import { checkuserlogin, getprofile } from "../store/auth/auth";
import SingelUser from "./pages/SingelUser";
import GetReels from "./componenets/reels/GetReels";
import GetExplore from "./pages/GetExplore";
import Chatpage from "./pages/Chatpage";
import { io } from "socket.io-client";
import { setSocket } from "../store/websocket/socketSlice";
import { setOnlineUsers } from "../store/websocket/onlineSlice";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MessageType } from "./types";
import { message } from "../hooks/react-query/query-keys/querykeys";
import { addNotification } from "../store/websocket/notificationSlice";

function App() {
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const GuestOnly = ({
    isAuth,
    children,
  }: {
    isAuth: boolean;
    children: React.ReactNode;
  }) => {
    const navigate = useNavigate();
    useEffect(() => {
      if (isAuth) navigate("/");
    }, [isAuth, navigate]);
    return !isAuth ? <>{children}</> : null;
  };
  useEffect(() => {
    if (isAuth) {
      dispatch(getprofile());
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    dispatch(checkuserlogin());
  }, [dispatch]);
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <Checkauth isAuth={isAuth}>
          <MainLayout />
        </Checkauth>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/createpost",
          element: <Createpost />,
        },
        {
          path: "/getreels",
          element: <GetReels />,
        },
        {
          path: "/explore",
          element: <GetExplore />,
        },

        {
          path: "/chat",
          element: <Chatpage />,
        },

        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profileedit",
          element: <Profileedit />,
        },

        {
          path: "/otheraccount/:id",
          element: <SingelUser />,
        },
        {
          path: "/updatepost/:id",
          element: <Updatepost />,
        },
        {
          path: "/updatereels/:id",
          element: <Updatepost />,
        },
      ],
    },

    {
      path: "/login",
      element: (
        <GuestOnly isAuth={isAuth}>
          <Login />
        </GuestOnly>
      ),
    },
    {
      path: "/register",
      element: (
        <GuestOnly isAuth={isAuth}>
          <Register />
        </GuestOnly>
      ),
    },
    {
      path: "/sendotp",
      element: (
        <GuestOnly isAuth={isAuth}>
          {" "}
          <Sendotp />
        </GuestOnly>
      ),
    },
    {
      path: "/verifyotp",
      element: (
        <GuestOnly isAuth={isAuth}>
          {" "}
          <Otpverify />
        </GuestOnly>
      ),
    },
    {
      path: "/forgotemail",
      element: (
        <GuestOnly isAuth={isAuth}>
          {" "}
          <Forgotsendemail />
        </GuestOnly>
      ),
    },
    {
      path: "/forgotresetpassword/:token",
      element: (
        <GuestOnly isAuth={isAuth}>
          {" "}
          <Forgotresetpassword />
        </GuestOnly>
      ),
    },
  ]);

  useEffect(() => {
    if (user && isAuth) {
      const socketio = io(import.meta.env.VITE_SOCKET_URL, {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      socketio.on("connect", () => {
        dispatch(setSocket(socketio.connected));
        socketio.on("getOnlineUsers", (users: string[]) => {
          dispatch(setOnlineUsers(users));
        });
        socketio.on("newMessage", (newMessage) => {
          queryClient.setQueryData(
            [message, newMessage.senderId],
            (oldData: MessageType[] = []) => {
              return [...oldData, newMessage];
            }
          );
        });
        socketio.on("notification", (notification) => {
          console.log("notification:", notification);
          dispatch(addNotification(notification));
        });
      });

      socketio.on("disconnect", () => {
        dispatch(setSocket(socketio.connected));
      });

      socketio.on("connect_error", (err) => {
        toast.error(`Connection error: ${err.message}`);
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    }
  }, [user, isAuth, dispatch, queryClient]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
