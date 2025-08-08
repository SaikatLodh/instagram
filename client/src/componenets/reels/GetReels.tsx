import Reels from "./Reels";
import { useGetPost } from "../../../hooks/react-query/query-hooks/rellsqueryhook";
import img from "../../../public/Loader.gif";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
const GetReels = () => {
  const ITEMS_PER_LOAD = 4;
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_LOAD);
  const { data, isLoading } = useGetPost();
  const allPosts = data?.pages?.[0] || [];
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
    if (inView && hasMoreLocal && !isLoading) {
      loadMoreItems();
    }
  }, [inView, hasMoreLocal, isLoading, loadMoreItems]);
  return (
    <>
      {isLoading ? (
        <>
          <div className="flex justify-center">
            <img src={img} alt="" />
          </div>
        </>
      ) : currentDisplayedPosts && currentDisplayedPosts.length > 0 ? (
        currentDisplayedPosts?.map((items) => <Reels items={items} />)
      ) : (
        <>
          <div className="flex justify-center items-center w-full h-full">
            <h1 className="text-2xl text-gray-500">No Reels Found</h1>
          </div>
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
    </>
  );
};

export default GetReels;
