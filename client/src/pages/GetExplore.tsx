import { useGetPost } from "../../hooks/react-query/query-hooks/postqueryhooks";
import img from "../../public/Loader.gif";
import Explore from "../componenets/explore/Explore";

const GetExplore = () => {
  const { data: getallposts, isLoading: isloading } = useGetPost();

  return (
    <>
      <div className="flex gap-4 flex-wrap sm:w-[80%] w-[95%] m-auto my-6">
        {isloading ? (
          <>
            {" "}
            <img src={img} alt="" />
          </>
        ) : (
          <>
            {getallposts && getallposts.pages.length > 0 && (
              <>
                {[...getallposts.pages[0]]?.reverse()?.map((item) => {
                  return (
                    <>
                      <Explore item={item} key={item._id} />
                    </>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default GetExplore;
