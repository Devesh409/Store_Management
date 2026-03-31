import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bars3BottomLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Aside from '../../Components/Aside/Aside';
import baseUrl from '../../utils/baseurl';
import ModalInvoice from '../../Components/Modal/ModalInvoice';
import toast, { Toaster } from 'react-hot-toast';
import { setSale } from '../../Redux/sales/saleSlice';
import { setloginStatus } from '../../Redux/login/isLogin';
import {
  buildAuthHeaders,
  clearStoredToken,
  getStoredToken,
  isUnauthorizedStatus,
} from '../../utils/auth';

const ViewSales = () => {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.login.loginStatus);
  const salesList = useSelector((state) => state.sale.sales);
  const dispatch = useDispatch();
  const redirectToLogin = () => {
    clearStoredToken();
    dispatch(setloginStatus(false));
    navigate("/login");
  }
  const [printInvoiceData, setPrintInvoiceData] = useState({
    "custmrDetails": {
      cust_id: "",
      cust_order_id: "",
      cust_name: "",
      cust_email: "",
      cust_contact: "",
      "cartItems": []
    }
  })

  const getSales = async () => {
    const token = getStoredToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    let requestOptions = {
      method: 'GET',
      headers: buildAuthHeaders(),
      redirect: 'follow',
      credentials: 'include' //!important
    };

    try {
      const response = await fetch(`${baseUrl}/getsales`, requestOptions);
      if (isUnauthorizedStatus(response.status)) {
        redirectToLogin();
        return;
      }

      const result = await response.json()

      if (result.status) {
        dispatch(setSale(result.data));
      } else {
        console.log('Error::new sales::result', result.message);
      }
    } catch (error) {
      console.log('Error::new sales::', error);
    }
  }


  const handleDelete = async(id) => {
    if (window.confirm("Are u sure to delete?")) {
      const token = getStoredToken();
      if (!token) {
        redirectToLogin();
        return;
      }

      let requestOptions = {
        method: 'POST',
        body: JSON.stringify({ salesId: id }),
        headers: buildAuthHeaders(),
        redirect: 'follow',
        credentials: 'include' //!important
      };
      try {
        const response = await fetch(`${baseUrl}/deletesales`, requestOptions);
        if (isUnauthorizedStatus(response.status)) {
          redirectToLogin();
          return;
        }

        const result = await response.json();

        if (result.status) {
          toast.success("Delete Success");
          // to refresh sales list
          getSales();
        } else {
          toast.error("Something went wrong! try again");
          console.log('Error::new sales::result', result.message);
        }
      } catch (error) {
        console.log('Error::new sales::', error)
      }
    }
  }

  useEffect(() => {
    // check if login:
    if (!isLogin) {
      // not login, take to login page:
      navigate("/login")
    } else {
      // get sales
      if (salesList.length <= 0) {
        getSales()
      }
    }
  }, [isLogin, navigate, salesList.length])

  const uniqueCustomers = new Set(salesList.map((sale) => sale.cust_email)).size;
  const totalItemsSold = salesList.reduce((acc, sale) => {
    const saleQty = sale.cartItems?.reduce((qty, item) => qty + Number(item.c_quantity || 0), 0) || 0;
    return acc + saleQty;
  }, 0);

  return (
    <div className='page-shell'>

      {/* main */}
      <div className="drawer lg:drawer-open">
        <input id="sidebar_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content px-4 md:px-6">
          <div className="page-stack">
            <section className="page-panel">
              <div className="page-header">
                <div>
                  <span className="hero-chip">Sales archive</span>
                  <h1 className="page-title">Recent customer orders</h1>
                  <p className="page-subtitle">
                    Review placed orders, revisit customer details, and print invoices from one clean archive.
                  </p>
                </div>
                <div className="page-header-actions">
                  <label htmlFor="sidebar_drawer" className="btn btn-sm drawer-button lg:hidden">
                    <Bars3BottomLeftIcon className='w-5 h-5' />
                  </label>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{salesList.length}</div>
                  <div className="stat-note">Sales records currently available in your system.</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Unique Customers</div>
                  <div className="stat-value">{uniqueCustomers}</div>
                  <div className="stat-note">Distinct customer emails appearing in recent orders.</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Units Sold</div>
                  <div className="stat-value">{totalItemsSold}</div>
                  <div className="stat-note">Total product quantity moved through recorded sales.</div>
                </div>
              </div>
            </section>

            <section className="page-panel">
              <div className="page-body">
                <div className="page-toolbar">
                  <div>
                    <h2 className="section-title">Sales list</h2>
                    <p className="section-subtitle">
                      Search by customer, reopen invoice details, and tidy old entries when needed.
                    </p>
                  </div>

                  <form action="" className='search-shell hidden md:flex' onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Search customer or order" />
                    <button type="submit" aria-label="Search sales">
                      <MagnifyingGlassIcon className='w-5 h-5' />
                    </button>
                  </form>
                </div>

                <form action="" className='search-shell md:hidden' onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Search customer or order" />
                  <button type="submit" aria-label="Search sales">
                    <MagnifyingGlassIcon className='w-5 h-5' />
                  </button>
                </form>
              </div>

              {salesList.length <= 0 ? (
                <div className="page-body pt-0">
                  <div className='empty-state'>
                    No sales have been recorded yet.
                    <br />
                    Create a new sale to start building your customer order history.
                  </div>
                </div>
              ) : (
                <div className='page-body pt-0'>
                  <div className='table-wrap'>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Cust Name</th>
                          <th>Cust contact</th>
                          <th>Cust email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...salesList].reverse().map((elem, inx) => {
                          return (
                            <tr className="hover" key={inx}>
                              <th>{inx + 1}</th>
                              <td>{elem.cust_name}</td>
                              <td>{elem.cust_contact}</td>
                              <td>{elem.cust_email} </td>
                              <td className='flex flex-wrap gap-2'>
                                <button
                                  onClick={() => {
                                    setPrintInvoiceData({
                                      "custmrDetails": {
                                        cust_id: elem._id,
                                        cust_order_id: (salesList.length - inx),
                                        cust_name: elem.cust_name,
                                        cust_email: elem.cust_email,
                                        cust_contact: elem.cust_contact,
                                        "cartItems": elem.cartItems
                                      }
                                    })
                                    document.getElementById("invoice_modal").showModal();
                                  }}
                                  className='btn btn-sm btn-primary'
                                >
                                  Print invoice
                                </button>
                                <button
                                  onClick={() => { handleDelete(elem._id) }}
                                  className='btn btn-sm btn-error'
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="drawer-side md:h-[80vh] h-full">
          <label htmlFor="sidebar_drawer" aria-label="close sidebar" className="drawer-overlay"></label>

          <Aside />

        </div>
      </div>
      {/* main end */}

      <ModalInvoice id="invoice_modal" title="Download Invoice" InvoiceDetails={printInvoiceData} />
      <Toaster />
    </div>
  )
}

export default ViewSales
