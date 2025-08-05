import { useForm } from "react-hook-form";
import { usePostComment } from "../../../hooks/react-query/query-hooks/commentqueryhooks";
import { usePostReelsComment } from "../../../hooks/react-query/query-hooks/reelscommenthooks";
import { useLocation } from "react-router-dom";
const Comment = ({ id }: { id: string }) => {
  const location = useLocation();
  const { register, watch, handleSubmit, reset } = useForm<{
    text: string;
  }>();
  const commentValue = watch("text", "");
  const { mutate, isPending } = usePostComment();
  const { mutate: reelsMutate, isPending: reelsPending } =
    usePostReelsComment();
  const onSubmit = (data: { text: string }) => {
    const value = {
      text: data.text,
    };
    mutate({ id, value });
    if (!isPending) {
      reset();
    }
  };

  const onSubmitTwo = (data: { text: string }) => {
    const value = {
      text: data.text,
    };
    reelsMutate({ id, value });
    if (!isPending) {
      reset();
    }
  };

  return (
    <>
      {location.pathname === "/" || location.pathname === "/explore" ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <input
                type="text"
                placeholder="Add a comment..."
                className="ml-3 flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                {...register("text")}
              />
              {commentValue.length > 0 && (
                <button
                  className="text-blue-500 font-semibold text-sm cursor-pointer"
                  type="submit"
                  disabled={isPending}
                >
                  Post
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmitTwo)}>
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <input
                type="text"
                placeholder="Add a comment..."
                className="ml-3 flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                {...register("text")}
              />
              {commentValue.length > 0 && (
                <button
                  className="text-blue-500 font-semibold text-sm cursor-pointer"
                  type="submit"
                  disabled={reelsPending}
                >
                  Post
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Comment;
