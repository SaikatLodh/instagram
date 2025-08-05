import Post from "./Post ";
import img from "../../../public/Loader.gif";
import { useGetPost } from "../../../hooks/react-query/query-hooks/postqueryhooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import Wrapper from "../story/Wrapper";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useState } from "react";
const Feed = () => {
  const ITEMS_PER_LOAD = 4;
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_LOAD);

  const { data: getallposts, isLoading: isloading } = useGetPost();
  const { user } = useSelector((state: RootState) => state.auth);
  const allPosts = getallposts?.pages?.[0] || [];
  const currentDisplayedPosts = allPosts.slice(0, displayedItemsCount);
  const hasMoreLocal = displayedItemsCount < allPosts.length;

  const loadMoreItems = useCallback(() => {
    if (hasMoreLocal) {
      setDisplayedItemsCount((prevCount) =>
        Math.min(prevCount + ITEMS_PER_LOAD, allPosts.length)
      );
    }
  }, [hasMoreLocal, allPosts.length]);

  useEffect(() => {
    if (inView && hasMoreLocal && !isloading) {
      loadMoreItems();
    }
  }, [inView, hasMoreLocal, isloading, loadMoreItems]);
  return (
    <>
      <Wrapper />
      <div className="flex flex-col feed">
        {isloading ? (
          <>
            <img src={img} alt="" />
          </>
        ) : (
          <>
            {currentDisplayedPosts?.map((items) => {
              const isoString = items.createdAt;
              const date = new Date(isoString);
              const readableDate = date.toLocaleString();

              return (
                <Post
                  key={items._id}
                  items={items}
                  readableDate={readableDate}
                  user={user}
                />
              );
            })}
          </>
        )}

        {hasMoreLocal && (
          <div ref={ref} className="flex justify-center">
            <img
              src={img}
              alt=""
              className="sm:w-[300px] sm:h-[100px] w-[150px] h-[150px] object-cover"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
