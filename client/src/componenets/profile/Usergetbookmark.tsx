import { User } from "../../types";
import img from "../../../public/Loader.gif";
import { FaComment } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

const Usergetbookmark = ({
  user,
  loading,
}: {
  user: User | null;
  loading: boolean;
}) => {
  return (
    <>
      <div className="flex flex-wrap justify-between mt-[50px] gap-3">
        {loading ? (
          <>
            <img src={img} alt="" />
          </>
        ) : (
          <>
            {user?.bookmarks && user?.bookmarks.length > 0 && (
              <>
                {[...user.bookmarks]?.reverse()?.map((item, index) => {
                  return (
                    <div
                      className="sm:w-[49%] w-[48% relative cursor-pointer"
                      key={index}
                    >
                      <img
                        src={item.contant?.url}
                        alt=""
                        className="sm:h-[300px] h-[120px] object-cover w-full"
                      />

                      <div className="absolute left-0 top-0 bg-[#0000007a] w-full h-full opacity-0 hover:opacity-[1] transition-all duration-300">
                        <div className="flex items-center justify-center gap-3 w-full h-full">
                          <div className="flex justify-center text-white gap-2 text-[22px]">
                            <div className="w-fit">
                              <FaComment />
                              {item?.comments &&
                                item?.comments.length > 0 &&
                                item?.comments.length}
                            </div>

                            <div className="w-fit">
                              <AiFillLike />
                              {item.likes.length > 0 && item.likes.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Usergetbookmark;
