import { IoIosNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useContextApi } from "../../../context/Contextapi";

const MobileNotificationButton = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  const { setShowNotification } = useContextApi();
  return (
    <>
      <div
        className="fixed bottom-20 right-4 z-90 sm:hidden block "
        onClick={() => setShowNotification(true)}
      >
        <button className="bg-black text-white font-bold py-2 px-4 rounded-full flex gap-2 items-center">
          <IoIosNotifications />
          {notifications.length > 0 && (
            <div className="text-[#FF1643]"> {notifications.length} </div>
          )}
        </button>
      </div>
    </>
  );
};

export default MobileNotificationButton;
