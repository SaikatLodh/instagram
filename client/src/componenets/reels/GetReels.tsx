import Reels from "./Reels";
import { useGetPost } from "../../../hooks/react-query/query-hooks/rellsqueryhook";
const GetReels = () => {
  const { data } = useGetPost();

  return (
    <>
      {data && data.length > 0 && data?.map((items) => <Reels items={items} />)}
    </>
  );
};

export default GetReels;
