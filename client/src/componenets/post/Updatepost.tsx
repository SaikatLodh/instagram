import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUpdatePost } from "../../../hooks/react-query/query-hooks/postqueryhooks";
import { Link, useLocation, useParams } from "react-router-dom";
import { useUpdateReels } from "../../../hooks/react-query/query-hooks/rellsqueryhook";
import { MdArrowBack } from "react-icons/md";
type Inputs = {
  caption: string | null;
  contant: FileList;
};

const Updatepost = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caption = queryParams.get("caption");
  const contant = queryParams.get("contant");
  const { mutate, isPending } = useUpdatePost();
  const { mutate: updateReels, isPending: reelsPending } = useUpdateReels();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      caption,
    },
  });
  const [preview, setPreview] = useState<string | null>(null);

  // Watch the file input to generate a preview
  const watchFile = watch("contant");

  // Generate preview when a file is selected
  React.useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      const file = watchFile[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [watchFile]);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const updatedata = new FormData();
    updatedata.append("caption", data?.caption as string);
    updatedata.append("contant", data.contant[0]);
    mutate({ updatedata, id });
    if (!isPending) {
      reset();
    }
  };

  const onSubmitTwo: SubmitHandler<Inputs> = (data: Inputs) => {
    const updatedata = new FormData();
    updatedata.append("caption", data?.caption as string);
    updatedata.append("contant", data.contant[0]);
    updateReels({ updatedata, id });
    if (!reelsPending) {
      reset();
    }
  };

  return (
    <>
      <Link to={`/profile`} className="sm:hidden block">
        <div className="fixed w-[30px] h-[30px] bg-[#000000] z-50 rounded-full flex justify-center items-center m-3 ">
          <MdArrowBack color="white" />
        </div>
      </Link>

      <div className="min-h-screen flex items-center justify-center bg-white sm:w-full w-[90%] m-auto">
        <div className="w-full max-w-sm text-center">
          <h2 className="font-bold text-lg mb-6">
            Update{" "}
            {location.pathname.includes("/updatereels") ? "Reels" : "Post"}
          </h2>

          {preview ? (
            <>
              <div className="mb-4">
                {location.pathname.includes("/updatereels") ? (
                  <video
                    src={preview}
                    controls
                    className="w-full h-48 object-contain rounded-md"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Selected"
                    className="w-full h-48 object-contain rounded-md"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                {location.pathname.includes("/updatereels") ? (
                  <video
                    src={contant as string}
                    controls
                    className="w-full h-48 object-contain rounded-md"
                  />
                ) : (
                  <img
                    src={contant as string}
                    alt="Selected"
                    className="w-full h-48 object-contain rounded-md"
                  />
                )}
              </div>
            </>
          )}
          {/* Form */}
          {location.pathname.includes("/updatereels") ? (
            <form onSubmit={handleSubmit(onSubmitTwo)}>
              {/* Caption */}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  {...register("caption", {
                    required: "Caption is required",
                    maxLength: {
                      value: 100,
                      message: "Caption cannot exceed 100 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-red-600 text-xs">
                  {errors.caption?.message}
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium mb-1">
                  Select Post
                </label>
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition"
                >
                  <span className="text-gray-600">
                    Click to upload an Reels
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    {...register("contant")}
                    className="hidden"
                    accept=" video/*"
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
                disabled={reelsPending}
              >
                {reelsPending ? "Updating..." : "Create Post"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Caption */}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  {...register("caption", {
                    required: "Caption is required",
                    maxLength: {
                      value: 100,
                      message: "Caption cannot exceed 100 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-red-600 text-xs">
                  {errors.caption?.message}
                </p>
              </div>

              {/* File Upload */}
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium mb-1">
                  Select Post
                </label>
                <label
                  htmlFor="file-upload"
                  className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition"
                >
                  <span className="text-gray-600">
                    Click to upload an image
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    {...register("contant")}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Create Post"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Updatepost;
