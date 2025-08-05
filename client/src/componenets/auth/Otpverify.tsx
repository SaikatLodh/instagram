import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { resetLoading, verifyotp } from "../../../store/auth/auth";

type Inputs = {
  otp: number;
};

const Otpverify = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const { loading, email } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const verifyDatta = {
      email: email as string,
      otp: Number(data.otp),
    };
    dispatch(verifyotp(verifyDatta))
      .then((res) => {
        if (res.payload) {
          reset();
          location.replace("/register");
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
        <h2 className="text-xl font-semibold mb-6">Verify your OTP</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* OTP Input */}
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              {...register("otp", {
                required: {
                  value: true,
                  message: "OTP is required",
                },
                minLength: {
                  value: 4,
                  message: "OTP must be 6 digits",
                },
                maxLength: {
                  value: 4,
                  message: "OTP must be 6 digits",
                },
              })}
            />
            <p className="text-red-600 text-xs">{errors.otp?.message}</p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otpverify;
