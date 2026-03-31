import { ArchiveBoxIcon, ArrowLeftEndOnRectangleIcon, ChartBarIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import baseUrl from '../../utils/baseurl';
import { clearStoredToken } from '../../utils/auth';

const Aside = () => {
    const location = useLocation();
    const productLinks = [
        { to: "/", icon: ArchiveBoxIcon, label: "My Products" },
    ];
    const salesLinks = [
        { to: "/newSales", icon: PlusCircleIcon, label: "New Sales" },
        { to: "/viewSales", icon: ChartBarIcon, label: "View Sales" },
    ];
    const accountLinks = [
        { to: "/profile", icon: UserCircleIcon, label: "Profile" },
    ];

    const showAdd = () => {
        document.getElementById('add_modal').showModal();
    }

    const logoutUser = async () => {
        if (window.confirm("Are you sure to logout?")) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
                credentials: 'include' //!important
            };
            const response = await fetch(`${baseUrl}/logout`, requestOptions);
            const result = await response.json();
            if (result.status) {
                clearStoredToken();
                console.log("Logout Success");
                window.location.reload();
            } else {
                alert("Something went wrong! try again");
            }
        }

    }

    const renderLink = ({ to, icon: Icon, label }) => (
        <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `aside-link ${isActive ? "is-active" : ""}`}
        >
            <Icon />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <aside className="aside-panel">
            <div className="aside-intro">
                <div className="aside-kicker">Workspace</div>
                <div className="aside-title">Retail cockpit</div>
                <p className="aside-copy">
                    Stay on top of products, invoices, and customer activity without leaving the flow.
                </p>
            </div>

            <div className="aside-section">
                <div className="aside-section-label">Products</div>
                <div className="aside-links">
                    {location.pathname === "/" && (
                        <button className="aside-link is-active" onClick={showAdd}>
                            <PlusCircleIcon />
                            <span>Add Product</span>
                        </button>
                    )}
                    {productLinks.map(renderLink)}
                </div>
            </div>

            <div className="aside-section">
                <div className="aside-section-label">Sales</div>
                <div className="aside-links">
                    {salesLinks.map(renderLink)}
                </div>
            </div>

            <div className="aside-section">
                <div className="aside-section-label">Account</div>
                <div className="aside-links">
                    {accountLinks.map(renderLink)}
                    <button className="aside-link is-danger" onClick={logoutUser}>
                        <ArrowLeftEndOnRectangleIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Aside
