import React, { useState } from "react";
import logo from "../assets/logo.png";
import runner from "../assets/logncentr.png";
import "../Css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const handleLogin = async () => {
    if (!input) {
      toast.info("Please enter email")
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: input,
      });

      console.log(res.data);
      // move to OTP screen and pass email
      navigate("/otp", { state: { email: input } });
    } catch (error) {
      console.error(error);
      toast.error("OTP send failedg");
    }
  };

  return (
    <div className="container-fluid login-wrapper">
      <div className="row vh-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-left">
          <img src={logo} alt="logo" className="login-logo" />
          <div className="content-box text-center">
            <img src={runner} alt="runner" className="runner-img" />
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75">
            <h4 className="fw-bold mb-4 lgline">Login to your Productr Account</h4>

            <div className="mb-3">
              <label className="form-label">Email or Phone number</label>
              <input type="text" className="form-control" placeholder="Enter email or phone number" value={input} onChange={(e) => setInput(e.target.value)} />
            </div>

            <button className="btn auth w-100 mb-4" onClick={handleLogin}>
              Login
            </button>

            <div className="lastitem">
              <p className="text-center small">
                Don't have a Productr Account?<br></br>
                <a href="#" className="ms-1 fw-semibold text-decoration-underline">
                  Signup Here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
