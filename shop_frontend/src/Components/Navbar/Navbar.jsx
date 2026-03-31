import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BuildingStorefrontIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'

const pageMeta = {
    "/": {
        chip: "Inventory hub",
        title: "Manage stock with confidence",
    },
    "/login": {
        chip: "Welcome",
        title: "Secure access for your store team",
    },
    "/newSales": {
        chip: "Sales studio",
        title: "Build polished orders in minutes",
    },
    "/viewSales": {
        chip: "Sales archive",
        title: "Track invoices and customer activity",
    },
    "/profile": {
        chip: "Account center",
        title: "Monitor your store identity and activity",
    },
};

const Navbar = () => {
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("isDarkMode") === "true"
    );

    const toggleDarkMode = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        document.documentElement.setAttribute("data-theme", nextMode ? "dark" : "cupcake");
        localStorage.setItem("isDarkMode", String(nextMode));
    };

    const currentPage = pageMeta[location.pathname] ?? pageMeta["/"];

    return (
        <header className="navbar-shell">
            <div className="navbar-card">
                <Link to="/" className="brand-lockup">
                    <div className="brand-mark">
                        <BuildingStorefrontIcon className='w-7 h-7' />
                    </div>
                    <div>
                        <div className="brand-title">StorePilot</div>
                        <div className="brand-subtitle">
                            Inventory, sales, and customer flow in one elegant workspace
                        </div>
                    </div>
                </Link>

                <div className='navbar-route'>
                    <div className="route-copy">
                        <span className="hero-chip">{currentPage.chip}</span>
                        <div className="route-label">{currentPage.title}</div>
                    </div>

                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={toggleDarkMode}
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
