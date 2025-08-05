import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { forgotpassword, resetLoading } from "../../../store/auth/auth";

type Inputs = {
  email: string;
};

const Forgotsendemail = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(forgotpassword(data))
      .then((res) => {
        if (res.payload) {
          reset();
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white sm:mx-0 mx-4">
      <div className="w-full max-w-sm text-center">
        {/* Instagram Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            className="h-10 w-10"
          />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-6">Send you mail</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <p className="text-red-600 text-xs">{errors.email?.message}</p>
          </div>

          {/* Send Mail Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
            disabled={loading}
          >
            Send mail
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-3">
          <Link to="/login" className="text-blue-600 text-sm hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forgotsendemail;
