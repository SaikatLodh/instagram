import { useSelector } from "react-redux";
import Profilegetuserdetailes from "../componenets/profile/Profilegetuserdetailes";
import Profilegetuserfeed from "../componenets/profile/Profilegetuserfeed";
import { RootState } from "../../store/store";

const Profile = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className="max-w-screen-md m-auto">
        <Profilegetuserdetailes user={user} />
        <Profilegetuserfeed user={user} loading={loading} />
      </div>
    </>
  );
};

export default Profile;
