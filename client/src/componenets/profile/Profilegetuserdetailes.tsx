import { Link } from "react-router-dom";
import { User } from "../../types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { logoutUser, logout } from "../../../store/auth/auth";

const Profilegetuserdetailes = ({ user }: { user: User | null }) => {
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = () => {
    dispatch(logout()).then((data) => {
      if (data.payload.success) {
        dispatch(logoutUser());
      }
    });
  };
  return (
    <>
      <div className="flex items-center sm:p-4 p-2 gap-3">
        <div className="flex justify-center w-full">
          <div className="w-full">
            <img
              src={user?.profilePicture?.url}
              alt=""
              className="object-cover rounded-full sm:w-[100px] sm:h-[100px] w-[70px] h-[70px]"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {user?.username}
          </h2>
          <Link to={"/profileedit"}>
            <div className="flex gap-2">
              <button className="w-[120px]  p-1 rounded-[10px] bg-[#DBDBDB] mt-[10px] cursor-pointer">
                Edite profile
              </button>
              <button
                className="w-[120px]  p-1 rounded-[10px] bg-[#DBDBDB] mt-[10px] cursor-pointer sm:hidden block"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          </Link>

          <div className="flex space-x-4 mt-2">
            <span className="text-muted-foreground flex gap-1">
              <h6 className="w-fit">Posts:</h6>

              {user?.posts?.length}
            </span>

            <span className="text-muted-foreground flex gap-1">
              <h6 className="w-fit">Followers:</h6>

              {user?.followers?.length}
            </span>
            <span className="text-muted-foreground flex gap-1">
              <h6> Following:</h6>

              {user?.following?.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">{user?.bio}</p>
        </div>
      </div>
    </>
  );
};

export default Profilegetuserdetailes;
