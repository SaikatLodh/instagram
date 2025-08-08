import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./componenets/auth/Login";
import Register from "./componenets/auth/Register";
import Sendotp from "./componenets/auth/Sendotp";
import Otpverify from "./componenets/auth/Otpverify";
import Forgotsendemail from "./componenets/auth/Forgotsendemail";
import Forgotresetpassword from "./componenets/auth/Forgotresetpassword";
import Createpost from "./componenets/post/Createpost";
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
import NotFound from "./componenets/NotFound";
import { MainLayout } from "./componenets/MainLayout ";
import Home from "./pages/Home ";

function GuestOnly({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth, navigate]);
  return !isAuth ? <>{children}</> : null;
}

function App() {
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  // Check login and get profile
  useEffect(() => {
    dispatch(checkuserlogin());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) {
      dispatch(getprofile());
    }
  }, [isAuth, dispatch]);

  // Socket.io connection
  useEffect(() => {
    if (user && isAuth) {
      const socketio = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId: user?._id },
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
            (oldData: MessageType[] = []) => [...oldData, newMessage]
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
    <BrowserRouter>
      <Routes>
        {/* Authenticated routes */}
        <Route
          path="/"
          element={
            <Checkauth isAuth={isAuth}>
              <MainLayout />
            </Checkauth>
          }
        >
          <Route index element={<Home />} />
          <Route path="createpost" element={<Createpost />} />
          <Route path="getreels" element={<GetReels />} />
          <Route path="explore" element={<GetExplore />} />
          <Route path="chat" element={<Chatpage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profileedit" element={<Profileedit />} />
          <Route path="otheraccount/:id" element={<SingelUser />} />
          <Route path="updatepost/:id" element={<Updatepost />} />
          <Route path="updatereels/:id" element={<Updatepost />} />
        </Route>

        {/* Guest only routes */}
        <Route
          path="/login"
          element={
            <GuestOnly isAuth={isAuth}>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly isAuth={isAuth}>
              <Register />
            </GuestOnly>
          }
        />
        <Route
          path="/sendotp"
          element={
            <GuestOnly isAuth={isAuth}>
              <Sendotp />
            </GuestOnly>
          }
        />
        <Route
          path="/verifyotp"
          element={
            <GuestOnly isAuth={isAuth}>
              <Otpverify />
            </GuestOnly>
          }
        />
        <Route
          path="/forgotemail"
          element={
            <GuestOnly isAuth={isAuth}>
              <Forgotsendemail />
            </GuestOnly>
          }
        />
        <Route
          path="/forgotresetpassword/:token"
          element={
            <GuestOnly isAuth={isAuth}>
              <Forgotresetpassword />
            </GuestOnly>
          }
        />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
