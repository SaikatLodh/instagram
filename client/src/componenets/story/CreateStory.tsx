import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateStory } from "../../../hooks/react-query/query-hooks/storyqueryhook";
import { useEffect, useState } from "react";
type Inputs = {
  title: string;
  content: FileList;
};

const CreateStory = () => {
  const { mutate, isPending } = useCreateStory();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [preview, setPreview] = useState<string | null>(null);
  const watchFile = watch("content");

  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      const file = watchFile[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [watchFile]);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    const formdata = new FormData();
    formdata.append("title", data.title);
    formdata.append("content", data.content[0]);

    mutate(formdata);
    if (!isPending) {
      reset();
    }
  };
  return (
    <>
      <div className="w-full max-w-sm text-center">
        <h2 className="font-bold text-lg mb-6">Create Story</h2>
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Selected"
              className="w-full h-48 object-contain rounded-md"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">title</label>
            <input
              type="text"
              {...register("title", {
                required: "Caption is required",
                maxLength: {
                  value: 100,
                  message: "title cannot exceed 100 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-red-600 text-xs">{errors.title?.message}</p>
          </div>

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">
              Select Post
            </label>
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition"
            >
              <span className="text-gray-600">Click to upload an image</span>
              <input
                id="file-upload"
                type="file"
                {...register("content", {
                  required: "File is required",
                })}
                className="hidden"
                accept="image/jpeg, image/png, image/jpg"
              />
            </label>
            <p className="text-red-600 text-xs">{errors.content?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Story"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateStory;
