import LeftSidebar from "./LeftSidebar ";
import { Outlet } from "react-router-dom";
import Search from "./search/Search";
import { useContextApi } from "../../context/Contextapi";
import Showallnotification from "./notification/Showallnotification";
import MobileNotificationButton from "./notification/MobileNotificationButton";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MobilChatButton from "./chat/MobilChatButton";
export const MainLayout = () => {
  const { show, showNotification } = useContextApi();
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  return (
    <div className="flex w-full">
      <LeftSidebar />
      {show && <Search />}
      {showNotification && <Showallnotification />}
      <MobilChatButton />
      {notifications && notifications.length > 0 && (
        <MobileNotificationButton />
      )}
      <div className="w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
