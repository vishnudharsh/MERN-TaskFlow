import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Button from "../components/Button";
import Textbox from "../components/Textbox";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import Loading from './../components/Loading';

export default function Login() {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result.user));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side - Branding */}
        <div className="flex-1 flex flex-col items-center justify-center text-center lg:text-left">
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-primary-100 dark:border-gray-700">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Manage all your tasks in one place
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
              Professional task management system for modern teams
            </p>

            {/* Animated Circle */}
            <div className="hidden lg:block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-auto">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-full lg:w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100 dark:border-gray-800"
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to continue to TaskFlow
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <Textbox
                placeholder="you@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-lg"
                register={register("email", { required: "Email is required!" })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder="Enter your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-lg"
                register={register("password", { required: "Password is required!" })}
                error={errors.password ? errors.password.message : ""}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  label="Sign In"
                  className="w-full h-12 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                />
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help? Contact your administrator
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}