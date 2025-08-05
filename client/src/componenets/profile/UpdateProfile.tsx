import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { useEditeProfile } from "../../../hooks/react-query/query-hooks/userqueryhook";
type FormData = {
  bio: string;
  gender: string;
  contant: FileList;
};

const UpdateProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = useEditeProfile();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bio: user?.bio,
      gender: user?.gender,
    },
  });

  const watchFile = watch("contant");

  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      const file = watchFile[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [watchFile]);

  const onSubmit = (data: FormData) => {
    const formdata = new FormData();
    formdata.append("bio", data.bio);
    formdata.append("gender", data.gender);
    formdata.append("contant", data.contant[0]);
    mutate(formdata);
  };

  return (
    <>
      <div className="sm:h-screen h-[86vh] flex justify-center items-center">
        <div className="w-xl mx-auto p-4 bg-card rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Edit profile
          </h1>
          <div className="flex items-center mb-4 gap-3">
            <img
              src={preview || user?.profilePicture?.url}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />

            <div>
              <p className="font-semibold text-foreground">{user?.username}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-muted-foreground mb-1">Bio</label>
            <input
              type="text"
              placeholder="bio"
              className="w-full p-2 border border-border rounded-lg mb-4"
              {...register("bio")}
            />

            <div>
              <label htmlFor="option">Choose an option:</label>
              <select
                id="option"
                {...register("gender", {
                  validate: (value) =>
                    value !== "default" || "Please select a valid option",
                })}
                className="w-full p-2 border border-border rounded-lg mb-4 mt-[10px]"
              >
                <option value="default">Select an option</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>

              {errors.gender && (
                <p className="text-[#ff0000a8] mb-[10px]">
                  {errors.gender.message}
                </p>
              )}
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
                  {...register("contant")}
                  className="hidden"
                  accept="image/jpeg, image/png, image/jpg"
                />
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#E200B0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-indigo-600 transition-all duration-300 mt-[20px] cursor-pointer"
              disabled={isPending}
            >
              {isPending ? <h6>Updating...</h6> : <h6>Submit</h6>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
