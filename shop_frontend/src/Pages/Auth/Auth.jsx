import { useState } from "react";
import { setloginStatus } from "../../Redux/login/isLogin";
import { useDispatch } from "react-redux";
import baseurl from "../../utils/baseurl";

import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import { clearStoredToken } from "../../utils/auth";

const Auth = () => {
  const [isLoginPage, setisLoginPage] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [eyePassword, seteyePassword] = useState(false);
  const [eyeConfirmPassword, seteyeConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    /** resolver: yupResolver(schema), */
  });
  const validateEmail = (email) => {
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return "Invalid email format";
    }
  };
  const validatePassword = (password) => {
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s).{8,}$/g;
    // let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?])(?!.*\s)/g;
    if (!password.match(regex)) {
      return "invalid password format";
    }
  };

  const loginUser = async (obj) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
      credentials: "include", //!important
    };

    try {
        console.log(baseurl);
      const response = await fetch(`${baseurl}/login`, requestOptions);
      const result = await response.json();
      console.log("📡 Login response:", result);
      if (result.status && result.token) {
        console.log("🔐 Received token:", result.token ? "✅ Token found" : "❌ No token in response");
        localStorage.setItem("token", result.token);
        console.log("💾 Token stored in localStorage:", localStorage.getItem("token") ? "✅ Verified" : "❌ Failed");
        dispatch(setloginStatus(true));
        toast.success("Login success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        clearStoredToken();
        dispatch(setloginStatus(false));
        toast.error(result.message || "Invalid credentials");
        console.log("Error::Auth::loginUser::result", result.message);
      }
    } catch (error) {
      clearStoredToken();
      dispatch(setloginStatus(false));
      toast.error("Something went wrong! ty again");
      console.log("Error::Auth::loginUser", error);
    }
  };

  const registerUser = async (obj) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow",
      credentials: "include", //!important
    };

    try {
      const response = await fetch(`${baseurl}/register`, requestOptions);
      const result = await response.json();
      if (result.status) {
        toast.success("Registration success! Login to account");
        setisLoginPage(!isLoginPage);
      } else {
        toast.error(result.message || "Something went wrong! ty again");
        console.log("Error::Auth::registerUser::result", result.message);
      }
    } catch (error) {
      toast.error("Something went wrong! ty again");
      console.log("Error::Auth::registerUser", error);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    if (!isLoginPage) {
      // register btn is clicked:
      if (data.password !== data.cpassword) {
        alert("Password and comfirm password DO Not match!");
        return false;
      }
      registerUser(data);
      return false;
    }
    // else login btn clicked:
    loginUser(data);
    return false;
  };

  const authHighlights = [
    {
      title: "Beautiful inventory flow",
      detail: "Move from login to products, orders, and invoices in a single polished workspace.",
    },
    {
      title: "Fast daily operations",
      detail: "Update pricing, track stock, and create new sales without losing context.",
    },
    {
      title: "Ready for growth",
      detail: "Clean account management and a stronger data view as your catalog scales.",
    },
  ];

  return (
    <main className="auth-shell">
      <div className="auth-grid">
        <section className="auth-feature">
          <span className="hero-chip">
            {isLoginPage ? "Daily operations" : "Fresh workspace"}
          </span>
          <h1 className="auth-feature-title">
            {isLoginPage
              ? "Run your store from a dashboard that feels premium."
              : "Create a modern inventory workspace in minutes."}
          </h1>
          <p className="auth-feature-copy">
            {isLoginPage
              ? "Jump back into inventory, sales, and account activity with a cleaner command center built for speed."
              : "Start with a polished store cockpit that makes stock tracking, customer sales, and account management feel effortless."}
          </p>

          <div className="auth-feature-list">
            {authHighlights.map((item) => (
              <div className="auth-feature-item" key={item.title}>
                <KeyIcon className="w-5 h-5" />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-panel auth-card">
          <div className="auth-switch">
            <button
              type="button"
              className={`auth-switch-btn ${isLoginPage ? "is-active" : ""}`}
              onClick={() => setisLoginPage(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-switch-btn ${!isLoginPage ? "is-active" : ""}`}
              onClick={() => setisLoginPage(false)}
            >
              Register
            </button>
          </div>

          <div>
            <span className="hero-chip">
              {isLoginPage ? "Welcome back" : "Create your account"}
            </span>
            <h2 className="page-title">
              {isLoginPage ? "Sign in to StorePilot" : "Launch your store workspace"}
            </h2>
            <p className="page-subtitle">
              {isLoginPage
                ? "Use your account details to continue managing products, customers, and sales."
                : "Register once and unlock a sharper inventory and billing experience for your store."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="auth-form"
            autoComplete="off"
            noValidate
          >
            <label
              className={`input input-bordered flex items-center gap-2 rounded-lg ${
                errors.email ? "input-error" : "input-success"
              } `}
            >
              <EnvelopeIcon className="h-4 w-4 opacity-70" />
              <input
                type="text"
                name="email"
                className="grow bg-transparent "
                placeholder="Email"
                {...register("email", { validate: validateEmail })}
              />
            </label>
            <div className="label-text text-xs text-error h-8 pt-2">
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <label
              className={`input input-bordered flex items-center gap-2 rounded-lg ${
                errors.password ? "input-error" : "input-success"
              } `}
            >
              <KeyIcon className="h-4 w-4 opacity-70" />
              <input
                type={eyePassword ? "text" : "password"}
                name="password"
                className="grow bg-transparent"
                placeholder="Password"
                {...register("password", { validate: validatePassword })}
              />
              {eyePassword ? (
                <EyeIcon
                  className="h-4 w-4 opacity-70 cursor-pointer"
                  onClick={() => {
                    seteyePassword(!eyePassword);
                  }}
                />
              ) : (
                <EyeSlashIcon
                  className="h-4 w-4 opacity-70 cursor-pointer"
                  onClick={() => {
                    seteyePassword(!eyePassword);
                  }}
                />
              )}
            </label>

            <div className="label-text text-xs text-error h-8 pt-2">
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div className="label">
              <span className="label-text text-xs">
                Min 8 chars and must include Uppercase, Lowercase, Number and
                Special character.
              </span>
            </div>

            {!isLoginPage && (
              <>
                <label
                  className={`input input-bordered flex items-center gap-2 rounded-lg ${
                    errors.cpassword ? "input-error" : "input-success"
                  } `}
                >
                  <KeyIcon className="h-4 w-4 opacity-70" />
                  <input
                    type={eyeConfirmPassword ? "password" : "text"}
                    name="cpassword"
                    className="grow bg-transparent"
                    placeholder="Confirm password"
                    {...register("cpassword", { validate: validatePassword })}
                  />
                  {!eyeConfirmPassword ? (
                    <EyeIcon
                      className="h-4 w-4 opacity-70 cursor-pointer"
                      onClick={() => {
                        seteyeConfirmPassword(!eyeConfirmPassword);
                      }}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="h-4 w-4 opacity-70 cursor-pointer"
                      onClick={() => {
                        seteyeConfirmPassword(!eyeConfirmPassword);
                      }}
                    />
                  )}
                </label>
                <div className="label-text text-xs text-error h-8 pt-2">
                  {errors.cpassword && <p>{errors.cpassword.message}</p>}
                </div>
              </>
            )}

            <input
              type="submit"
              className="btn w-full btn-primary mt-4"
              value={isLoginPage ? "Enter Dashboard" : "Create Account"}
            />
          </form>

          <div className="auth-footer">
            {isLoginPage ? (
              <div>
                Need a new account?{" "}
                <span
                  className="auth-link"
                  onClick={() => {
                    setisLoginPage(false);
                  }}
                >
                  Register here
                </span>
              </div>
            ) : (
              <div>
                Already have access?{" "}
                <span
                  className="auth-link"
                  onClick={() => {
                    setisLoginPage(true);
                  }}
                >
                  Login here
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      <Toaster />
    </main>
  );
};

export default Auth;
