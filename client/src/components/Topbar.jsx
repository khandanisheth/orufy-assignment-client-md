import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const Topbar = ({ title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2"
      style={{
        background: "linear-gradient(90deg, #feecec 0%, #eaf2ff 80%)",
        borderBottom: "1px solid #dee2e6",
        height: "60px",
      }}
    >
      <h6 className="fw-semibold text-secondary m-0">{title}</h6>

      <div className="position-relative">
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <img
            src="https://i.pravatar.cc/40"
            className="rounded-circle"
            style={{ width: "32px", height: "32px" }}
          />
          <FaChevronDown size={12} />
        </div>

        {open && (
          <div
            className="position-absolute bg-white shadow-sm rounded p-2 mt-2"
            style={{ right: 0, width: "120px", zIndex: 10, fontSize: "14px" }}
          >
            <button className="dropdown-item py-1 px-2">Profile</button>

            <button
              className="dropdown-item py-1 px-2 text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
