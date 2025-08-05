import { FaHeart, FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { FaPlusSquare } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, logoutUser } from "../../store/auth/auth";
import { AppDispatch, RootState } from "../../store/store";
import { useContextApi } from "../../context/Contextapi";
import { GoVideo } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { FaRegMessage } from "react-icons/fa6";
import { CiSquarePlus } from "react-icons/ci";
import { FaRegPlusSquare } from "react-icons/fa";
import { RiVideoFill } from "react-icons/ri";

const LeftSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  const { setShow, show, showNotification, setShowNotification } =
    useContextApi();
  const location = useLocation();
  const isShowinMobile =
    location.pathname !== "/chat" &&
    !location.pathname.startsWith("/updatepost") &&
    !location.pathname.startsWith("/updatereels");
  const sidebarHandler = (text: string) => {
    if (text === "Logout") {
      dispatch(logout()).then((data) => {
        if (data.payload.success) {
          dispatch(logoutUser());
          setShow(false);
          setShowNotification(false);
        }
      });
    } else if (text === "Home") {
      setShow(false);
      setShowNotification(false);
      navigate("/");
    } else if (text === "Profile") {
      setShow(false);
      setShowNotification(false);
      navigate(`/profile`);
    } else if (text === "Create") {
      setShow(false);
      setShowNotification(false);
      navigate("/createpost");
    } else if (text === "Explore") {
      setShow(false);
      setShowNotification(false);
      navigate("/explore");
    } else if (text === "Messages") {
      setShow(false);
      setShowNotification(false);
      navigate("/chat");
    } else if (text === "Notifications") {
      setShow(false);
      setShowNotification(() => !showNotification);
    } else if (text === "Search") {
      setShow(() => !show);
      setShowNotification(false);
    } else if (text === "Reels") {
      setShow(false);
      setShowNotification(false);
      navigate("/getreels");
    }
  };

  const sidebarItems = [
    {
      icon: location.pathname === "/" ? <FaHome /> : <IoHomeOutline />,
      text: "Home",
    },
    { icon: show ? <FaSearch /> : <IoIosSearch />, text: "Search" },
    {
      icon:
        location.pathname === "/explore" ? <MdExplore /> : <MdOutlineExplore />,
      text: "Explore",
    },
    {
      icon: location.pathname === "/chat" ? <FaMessage /> : <FaRegMessage />,
      text: "Messages",
    },
    {
      icon:
        notifications.length > 0 ? (
          <FaHeart className="text-[#FF1643]" />
        ) : (
          <FaHeart />
        ),
      text: "Notifications",
    },
    {
      icon:
        location.pathname === "/createpost" ? (
          <FaPlusSquare />
        ) : (
          <CiSquarePlus />
        ),
      text: "Create",
    },
    {
      icon: location.pathname === "/getreels" ? <RiVideoFill /> : <GoVideo />,
      text: "Reels",
    },
    {
      icon: (
        <img
          src={user?.profilePicture?.url}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-center object-cover"
        />
      ),
      text: "Profile",
    },
    { icon: <CiLogout />, text: "Logout" },
  ];

  return (
    <>
      {isShowinMobile && (
        <div className=" sm:hidden block">
          <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center ">
            {/* Home Icon */}
            <div className="text-black cursor-pointer">
              <Link to="/">
                {" "}
                {location.pathname === "/" ? (
                  <FaHome size={24} />
                ) : (
                  <IoHomeOutline size={24} />
                )}
              </Link>
            </div>

            <div className="text-black cursor-pointer">
              <Link to="/explore">
                {" "}
                {location.pathname === "/explore" ? (
                  <MdExplore size={24} />
                ) : (
                  <MdOutlineExplore size={24} />
                )}
              </Link>
            </div>

            {/* Search Icon */}
            <div
              className="text-black cursor-pointer"
              onClick={() => sidebarHandler("Search")}
            >
              {show ? <FaSearch size={24} /> : <IoIosSearch size={24} />}
            </div>

            {/* Add Post Icon */}
            <div className="text-black cursor-pointer">
              <Link to="/createpost">
                {" "}
                {location.pathname === "/createpost" ? (
                  <FaRegPlusSquare size={24} />
                ) : (
                  <CiSquarePlus size={24} />
                )}
              </Link>
            </div>

            {/* Reels Icon */}
            <div className="text-black cursor-pointer">
              <Link to="/getreels">
                {location.pathname === "/getreels" ? (
                  <RiVideoFill size={24} />
                ) : (
                  <GoVideo size={24} />
                )}
              </Link>
            </div>

            {/* Profile Icon */}
            <div className="text-black cursor-pointer">
              <Link to="/profile">
                <img
                  src={user?.profilePicture?.url}
                  alt=""
                  className="w-[30px] h-[30px] rounded-full object-center object-cover"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="w-[15%] flex-col gap-5 px-5 py-4 sm:flex hidden">
        {sidebarItems.map((item, index) => {
          return (
            <div key={index} onClick={() => sidebarHandler(item.text)}>
              <div className="flex flex-col gap-4 shadow-lg py-4 rounded-lg px-4 cursor-pointer">
                <div className="flex gap-2 items-center">
                  <div>{item.icon}</div>
                  <div>{item.text}</div>
                  {item.text === "Notifications" &&
                    notifications.length > 0 && (
                      <div className="text-[#FF1643]">
                        {" "}
                        {notifications.length}{" "}
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LeftSidebar;
