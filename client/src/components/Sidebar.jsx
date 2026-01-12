import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3"
      style={{ width: "240px", background: "#111827", height: "100vh", color: "#fff" }}
    >
      <h4 className="d-flex align-items-center mb-4 fw-bold">
        Productr <span className="ms-1" style={{ color: "#f97316" }}>✺</span>
      </h4>

      <div className="d-flex align-items-center bg-dark px-2 py-1 rounded mb-4">
        <FaSearch size={14} className="me-2 text-secondary" />
        <input
          type="text"
          className="bg-transparent border-0 text-white form-control form-control-sm p-0 shadow-none"
          placeholder="Search"
        />
      </div>

      <nav className="nav flex-column gap-1">
        <Link to="/home" className="nav-link text-white-50 p-2 rounded small">
          🏠 Home
        </Link>
        <Link to="/products" className="nav-link text-white p-2 rounded small bg-dark">
          📦 Products
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
