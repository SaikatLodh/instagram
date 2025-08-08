import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useContextApi } from "../../../context/Contextapi";

const Showallnotification = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  const { setShowNotification } = useContextApi();
  return (
    <>
      <div
        className="overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] h-[100%] overflow-y-auto  w-full bg-black opacity-50"
        onClick={() => setShowNotification(false)}
      ></div>
      <div className="sm:w-full w-[90%] max-w-md mx-auto  bg-white rounded-xl shadow-lg overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] sm:h-[500px] h-[400px] overflow-y-auto">
        <div className="mt-5 flex items-center justify-between flex-col gap-3 mx-3 h-full w-full">
          {notifications && notifications.length > 0 ? (
            notifications.map((item) => {
              return (
                <>
                  <div className="px-4 py-2 bg-black text-white w-full max-w-md mx-auto rounded-lg flex justify-between items-center">
                    {/* Profile + Text */}
                    <div className="flex items-center space-x-3 ">
                      <img
                        src={item.userDetails.profilePicture.url}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="text-sm flex sm:gap-3 gap-1 sm:flex-nowrap flex-wrap">
                        <span className="font-semibold">
                          {item.userDetails.username}
                        </span>
                        <span> liked your photo. </span>
                      </div>
                    </div>

                    <img
                      src={item.post.contant.url}
                      alt="post"
                      className="w-10 h-10 rounded object-cover"
                    />
                  </div>
                </>
              );
            })
          ) : (
            <>
              <div className="flex items-center justify-center h-full">
                <h5 className="text-center text-gray-500 mt-5 text-lg"></h5> No
                notifications available.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Showallnotification;
