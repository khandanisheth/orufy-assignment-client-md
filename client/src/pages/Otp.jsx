import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import runner from "../assets/logncentr.png";
import "../Css/login.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // OTP input handler
  const handleChange = (value, index) => {
    setError(false);

    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Timer start on load
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Submit OTP
  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) return setError(true);

    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: code,
      });
      localStorage.setItem("auth", "true");
      navigate("/home");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });

      // Reset everything
      setOtp(["", "", "", "", "", ""]);
      setError(false);

      // Restart timer
      setTimer(20);
      setCanResend(false);
    } catch (err) {
      console.log(err);
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

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className="form-box w-75">
            <h4 className="fw-bold mb-4 lgline">Login to your Productr Account</h4>

            <label className="form-label">Enter OTP</label>

            <div className="d-flex gap-2 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="form-control text-center"
                  style={{
                    width: "40px",
                    fontWeight: "bold",
                    border: error ? "2px solid red" : "1px solid #ccc",
                  }}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>

            {error && (
              <p className="text-danger small mt-1">Please enter a valid OTP</p>
            )}

            <button className="btn auth w-100 mb-3" onClick={handleSubmit}>
              Enter your OTP
            </button>

            <p className="text-center small">
              Didn’t receive OTP?{" "}
              {canResend ? (
                <a href="#" onClick={handleResend}>
                  Resend
                </a>
              ) : (
                <span className="text-muted">Resend in {timer}s</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
