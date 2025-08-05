import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreatePost } from "../../../hooks/react-query/query-hooks/rellsqueryhook";

type Inputs = {
  caption: string;
  contant: FileList;
};

const CreateReels = () => {
  const { mutate, isPending } = useCreatePost();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [preview, setPreview] = useState<string | null>(null);

  const watchFile = watch("contant");

  React.useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      const file = watchFile[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [watchFile]);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const formData = new FormData();
    formData.append("caption", data.caption);
    formData.append("contant", data.contant[0]);
    mutate(formData);
    if (!isPending) {
      reset();
    }
  };
  return (
    <>
      <div className="w-full max-w-sm text-center">
        <h2 className="font-bold text-lg mb-6">Create Reels</h2>
        {preview && (
          <div className="mb-4">
            <video
              src={preview}
              controls
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Caption */}
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">Caption</label>
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
            <p className="text-red-600 text-xs">{errors.caption?.message}</p>
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
              <span className="text-gray-600">Click to upload an Reels</span>
              <input
                id="file-upload"
                type="file"
                {...register("contant", {
                  required: "File is required",
                })}
                className="hidden"
                accept="video/*"
              />
            </label>
            <p className="text-red-600 text-xs">{errors.contant?.message}</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Reels"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateReels;
