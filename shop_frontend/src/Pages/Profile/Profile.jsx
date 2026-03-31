import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aside from "../../Components/Aside/Aside";
import { useDispatch, useSelector } from "react-redux";
import { Bars3BottomLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import baseUrl from "../../utils/baseurl";
import { setloginStatus } from "../../Redux/login/isLogin";
import {
  buildAuthHeaders,
  clearStoredToken,
  getStoredToken,
  isUnauthorizedStatus,
} from "../../utils/auth";

const Profile = () => {
  const isLogin = useSelector((state) => state.login.loginStatus);
  const [user, setUser] = useState({
    email: "",
    products: [],
    sales: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToLogin = () => {
    clearStoredToken();
    dispatch(setloginStatus(false));
    navigate("/login");
  };

  const getUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        redirectToLogin();
        return;
      }
      let requestOptions = {
        method: "GET",
        headers: buildAuthHeaders(),
        credentials: "include", // ✅ This ensures cookies are sent
      };

      console.log(requestOptions);

      const response = await fetch(`${baseUrl}/getUser`, requestOptions);
      if (isUnauthorizedStatus(response.status)) {
        redirectToLogin();
        return;
      }

      const result = await response.json();

      console.log("🔹 getUser Response:", result); // Debugging

      if (result.status) {
        setUser(result.data);
      } else {
        console.error("❌ Error in getUser:", result.message);
        alert("Something went wrong! Try again");
      }
    } catch (error) {
      console.error("❌ Network Error:", error.message);
      alert("Network error, please try again!");
    }
  };

  useEffect(() => {
    // check if login:
    if (!isLogin) {
      // not login, take to login page:
      navigate("/login");
    } else {
      // get user details:
      getUser();
    }
  }, [isLogin, navigate]);
  return (
    <div className="page-shell">
      {/* main */}
      <div className="drawer lg:drawer-open">
        <input id="sidebar_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content px-4 md:px-6">
          <div className="page-stack">
            <section className="page-panel is-accent">
              <div className="page-header">
                <div>
                  <span className="hero-chip">Account spotlight</span>
                  <h1 className="page-title">Your store profile</h1>
                  <p className="page-subtitle">
                    Keep a quick eye on your workspace identity, product volume,
                    and sales activity from one polished summary.
                  </p>
                </div>
                <div className="page-header-actions">
                  <label htmlFor="sidebar_drawer" className="btn btn-sm drawer-button lg:hidden">
                    <Bars3BottomLeftIcon className="w-5 h-5" />
                  </label>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Account Email</div>
                  <div className="stat-value text-2xl md:text-3xl break-all">{user.email || "Not available"}</div>
                  <div className="stat-note">Primary login for this store workspace.</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Products</div>
                  <div className="stat-value">{user.products.length}</div>
                  <div className="stat-note">Items currently linked to your account.</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Sales</div>
                  <div className="stat-value">{user.sales.length}</div>
                  <div className="stat-note">Orders recorded inside the system.</div>
                </div>
              </div>
            </section>

            <section className="page-panel">
              <div className="page-body profile-shell">
                <div>
                  <h2 className="section-title">Profile details</h2>
                  <p className="section-subtitle">
                    A compact view of the account behind your inventory and billing operations.
                  </p>
                </div>

                <div className="profile-identity">
                  <div className="profile-avatar">
                    <UserCircleIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="section-title">Store owner account</h3>
                    <p className="profile-email">{user.email}</p>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-tile">
                    <span>Active Catalog</span>
                    <strong>{user.products.length}</strong>
                  </div>
                  <div className="metric-tile">
                    <span>Orders Logged</span>
                    <strong>{user.sales.length}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="drawer-side md:h-[80vh] h-full">
          <label
            htmlFor="sidebar_drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <Aside />
        </div>
      </div>
      {/* main end */}
    </div>
  );
};

export default Profile;
