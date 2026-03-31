import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalDelete from "../../Components/Modal/ModalDelete";
import ModalUpdate from "../../Components/Modal/ModalUpdate";

import { useSelector, useDispatch } from "react-redux";
import {
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import ModalAdd from "../../Components/Modal/ModalAdd";
import baseUrl from "../../utils/baseurl";
import { setProducts } from "../../Redux/products/productSlice";
import Aside from "../../Components/Aside/Aside";
import { setloginStatus } from "../../Redux/login/isLogin";
import {
  buildAuthHeaders,
  clearStoredToken,
  getStoredToken,
  isUnauthorizedStatus,
} from "../../utils/auth";

const Dashboard = () => {
  const isLogin = useSelector((state) => state.login.loginStatus);
  const navigate = useNavigate();

  // get all products from store:
  const products = useSelector((state) => state.product.products);
  const [isFetchFinished, setisFetchFinished] = useState(false);
  const dispatch = useDispatch();

  const redirectToLogin = () => {
    clearStoredToken();
    dispatch(setloginStatus(false));
    navigate("/login");
  };

  // fetch products:
  const fetchProducts = async () => {
    try {
      const token = getStoredToken();
      console.log("🔍 Token from localStorage:", token ? "✅ Found" : "❌ Not found");
      if (!token) {
        console.warn("No valid token found in localStorage. Redirecting to login.");
        redirectToLogin();
        return false;
      } else {
        console.log("Using the stored token for the products request.");
      }

      let requestOptions = {
        method: "GET",
        headers: buildAuthHeaders(),
        credentials: "include", // ✅ This allows cookies to be sent
      };

      console.log("🚀 Fetching products from", `${baseUrl}/products`);
      const response = await fetch(`${baseUrl}/products`, requestOptions);
      console.log("📡 Response status:", response.status);

      if (isUnauthorizedStatus(response.status)) {
        redirectToLogin();
        return false;
      }

      if (!response.ok) {
        // The request failed with a status code outside the 200-299 range
        console.log(`Request failed with status: ${response.status}`);
        const errorText = await response.text();
        console.log("Error response:", errorText);
        return false; // or handle failure in some way
      }
      const result = await response.json();

      if (result.status) {
        console.log("✅ Product received successfully:", result.data);
        dispatch(setProducts(result.data));
      } else {
        console.error("❌ Error fetching products:", result.message);
        alert("Something went wrong! Try again");
      }
    } catch (error) {
      console.error("❌ Network Error:", error.message);
      alert("Network error, please try again!");
    } finally {
      setisFetchFinished(true);
    }
  };

  useEffect(() => {
    // check if login:
    if (!isLogin) {
      navigate("/login");
    } else if (products.length <= 0 && !isFetchFinished) {
      //asyc fetch data and save result to store
      fetchProducts();
    }
  }, [isFetchFinished, isLogin, navigate, products.length]);

  const showAdd = () => {
    document.getElementById("add_modal").showModal();
  };

  const [updateObj, setupdateObj] = useState({
    pid: "",
    index: "",
    p_name: "",
    p_price: "",
    p_stock: "",
  });

  const showUpdate = (id, i, p_name, p_price, p_stock) => {
    setupdateObj({
      pid: id,
      index: i,
      p_name: p_name,
      p_price: p_price,
      p_stock: p_stock,
    });
    document.getElementById("update_modal").showModal();
  };

  const [pid, setpid] = useState(""); //used for selecting current id that will help in delete items
  const showDelete = (id) => {
    setpid(id);
    document.getElementById("delete_modal").showModal();
  };

  const totalUnits = products.reduce(
    (acc, item) => acc + Number(item.p_stock || 0),
    0
  );
  const totalInventoryValue = products.reduce(
    (acc, item) => acc + Number(item.p_price || 0) * Number(item.p_stock || 0),
    0
  );
  const lowStockItems = products.filter((item) => Number(item.p_stock || 0) <= 5).length;

  // exec only if login:
  return (
    isLogin && (
      <div className="page-shell">
        {/* main */}
        <div className="drawer lg:drawer-open">
          <input
            id="sidebar_drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content px-4 md:px-6">
            <div className="page-stack">
              <section className="page-panel is-accent">
                <div className="page-header">
                  <div>
                    <span className="hero-chip">Inventory intelligence</span>
                    <h1 className="page-title">Product control room</h1>
                    <p className="page-subtitle">
                      Review stock health, update pricing, and keep every item in your
                      catalog looking intentional and ready to move.
                    </p>
                  </div>
                  <div className="page-header-actions">
                    <label
                      htmlFor="sidebar_drawer"
                      className="btn btn-sm drawer-button lg:hidden"
                    >
                      <Bars3BottomLeftIcon className="w-5 h-5" />
                    </label>
                    <button onClick={showAdd} className="btn btn-primary">
                      <PlusCircleIcon className="w-5 h-5" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="stat-label">Catalog Size</div>
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-note">Products currently tracked in your store.</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Units In Stock</div>
                    <div className="stat-value">{totalUnits}</div>
                    <div className="stat-note">Total sellable inventory across all items.</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Inventory Value</div>
                    <div className="stat-value">Rs.{totalInventoryValue.toFixed(0)}</div>
                    <div className="stat-note">Estimated stock value based on price x quantity.</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Low Stock</div>
                    <div className="stat-value">{lowStockItems}</div>
                    <div className="stat-note">Items with five units or fewer remaining.</div>
                  </div>
                </div>
              </section>

              <section className="page-panel">
                <div className="page-body">
                  <div className="page-toolbar">
                    <div>
                      <h2 className="section-title">Catalog overview</h2>
                      <p className="section-subtitle">
                        Search your current lineup, review pricing, and jump into quick
                        edits or removals without leaving the page.
                      </p>
                    </div>

                    <form action="" className="search-shell hidden md:flex" onSubmit={(e) => e.preventDefault()}>
                      <input type="text" placeholder="Search product name" />
                      <button type="submit" aria-label="Search products">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                      </button>
                    </form>
                  </div>

                  <form action="" className="search-shell md:hidden" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Search product name" />
                    <button type="submit" aria-label="Search products">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                {products && products.length > 0 ? (
                  <div className="page-body pt-0">
                    <div className="table-wrap max-h-[70vh]">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...products].reverse().map((elem, i) => {
                            return (
                              <tr className="hover" key={i}>
                                <th>{i + 1}</th>
                                <td>{elem.p_name}</td>
                                <td>Rs.{elem.p_price}</td>
                                <td>{elem.p_stock}</td>
                                <td className="flex flex-wrap gap-2">
                                  <button
                                    className="btn btn-primary btn-sm text-white"
                                    onClick={() => {
                                      showUpdate(
                                        elem._id,
                                        i,
                                        elem.p_name,
                                        elem.p_price,
                                        elem.p_stock
                                      );
                                    }}
                                  >
                                    Update
                                  </button>

                                  <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => {
                                      showDelete(elem._id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  isFetchFinished && (
                    <div className="page-body pt-0">
                      <div className="empty-state">
                        No items found yet.
                        <br />
                        Use the add product button to start building your inventory.
                      </div>
                    </div>
                  )
                )}
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

        {/* modal */}
        <ModalAdd
          id="add_modal"
          title="Add Product"
          fetchProducts={fetchProducts}
        />
        <ModalDelete
          id="delete_modal"
          pid={pid}
          title="Are u sure to delete?"
          fetchProducts={fetchProducts}
        />
        <ModalUpdate
          id="update_modal"
          title="Update Details"
          updateObj={updateObj}
          fetchProducts={fetchProducts}
        />
      </div>
    )
  );
};

export default Dashboard;
