import { useParams } from "react-router-dom";
import { useSingelUser } from "../../hooks/react-query/query-hooks/userqueryhook";
import SingelProfilegetuserdetailes from "../componenets/profile/SingelProfilegetuserdetailes";
import SingelProfilegetuserfeed from "../componenets/profile/SingelProfilegetuserfeed";

const SingelUser = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSingelUser(id as string);
  return (
    <>
      <div className="max-w-screen-md m-auto">
        <SingelProfilegetuserdetailes user={data} />
        <SingelProfilegetuserfeed user={data} loading={isLoading} />
      </div>
    </>
  );
};

export default SingelUser;
