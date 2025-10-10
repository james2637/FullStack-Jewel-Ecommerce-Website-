import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const CAPTCHA_CONTAINER_ID = "captcha-container-msg91";

const MSG91_CONFIG = {
  widgetId: "356a69716d52383633373733",
  tokenAuth: "472838TwrDsMWbHHoG68e7e79aP1",
  exposeMethods: true,
  captchaRenderId: CAPTCHA_CONTAINER_ID,
  success: (data) => {
    console.log("MSG91 success", data);
  },
  failure: (error) => {
    console.log("MSG91 failure", error);
  },
};

const loadMsg91Script = () => {
  return new Promise((resolve, reject) => {
    if (window.sendOtp && window.verifyOtp && window.retryOtp) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;
    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP(MSG91_CONFIG);
        resolve();
      } else {
        reject(new Error("MSG91 script failed to load"));
      }
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const OtpAuthentication = () => {
  const { backendUrl, setToken, navigate } = useContext(ShopContext);

  // Main signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [msg91Ready, setMsg91Ready] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login with OTP state
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  // Only initialize captcha once
  useEffect(() => {
    loadMsg91Script().then(() => setMsg91Ready(true));
  }, []);

  // --- Signup Handlers ---
  const handleSendOtp = () => {
    setVerificationStatus('');
    if (!msg91Ready) {
      setVerificationStatus('OTP script not loaded. Please refresh the page.');
      return;
    }
    if (!name.trim()) {
      setVerificationStatus('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setVerificationStatus('Please enter a valid email.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setVerificationStatus('Please enter a valid 10 digit phone number.');
      return;
    }

    // Use MSG91's official captcha verification method for signup/login
    var isCaptchaVerified = window.isCaptchaVerified && window.isCaptchaVerified(CAPTCHA_CONTAINER_ID);
    console.log('Captcha is verified or not', isCaptchaVerified);
    if (!isCaptchaVerified) {
      setVerificationStatus('Please complete the captcha.');
      return;
    }

    const identifier = "91" + phoneNumber;
    setLoading(true);
    window.sendOtp(
      identifier,
      (data) => {
        setOtpSent(true);
        setVerificationStatus('OTP sent successfully!');
        setLoading(false);
      },
      (error) => {
        setVerificationStatus('Failed to send OTP. ' + (error?.message || 'Please try again.'));
        setLoading(false);
      }
    );
  };

  const handleResendOtp = () => {
    setVerificationStatus('');
    setLoading(true);
    window.retryOtp(
      null,
      (data) => {
        setVerificationStatus('OTP resent successfully!');
        setLoading(false);
      },
      (error) => {
        setVerificationStatus('Failed to resend OTP. ' + (error?.message || 'Please try again.'));
        setLoading(false);
      }
    );
  };

  const handleVerifyOtp = async () => {
    setVerificationStatus('');
    const identifier = "91" + phoneNumber;
    setLoading(true);
    window.verifyOtp(
      otp,
      async (data) => {
        console.log("MSG91 verifyOtp callback data:", data);
        // Extract token from message if present
        let msg91Token = data.token || data.accessToken || data.authToken;
        if (!msg91Token && data.type === 'success' && typeof data.message === 'string') {
          msg91Token = data.message;
        }
        if (data.type === 'success' && msg91Token) {
          setVerificationStatus('Phone number verified!');
          console.log("MSG91 token from widget:", msg91Token);
          try {
            const response = await axios.post(`${backendUrl}/api/user/register-phone`, {
              name,
              email,
              phone: identifier,
              accessToken: msg91Token,
            });
            if (response.data.success) {
              setToken(response.data.token);
              localStorage.setItem("token", response.data.token);
              toast.success("Account created and logged in!");
              navigate("/");
            } else {
              toast.error(response.data.message);
            }
          } catch (err) {
            toast.error("Failed to register user.");
          }
        } else {
          setVerificationStatus('Verification failed. Please try again.');
        }
        setLoading(false);
      },
      (error) => {
        setVerificationStatus('Invalid OTP. Please try again.');
        setLoading(false);
      }
    );
  };

  // --- Login with OTP Handlers ---
  const handleLoginSendOtp = () => {
    setLoginStatus('');
    if (!msg91Ready) {
      setLoginStatus('OTP script not loaded. Please refresh the page.');
      return;
    }
    if (!/^\d{10}$/.test(loginPhone)) {
      setLoginStatus('Please enter a valid 10 digit phone number.');
      return;
    }
    // Use MSG91's official captcha verification method for login
    var isCaptchaVerified = window.isCaptchaVerified && window.isCaptchaVerified(CAPTCHA_CONTAINER_ID);
    console.log('Captcha is verified or not', isCaptchaVerified);
    if (!isCaptchaVerified) {
      setLoginStatus('Please complete the captcha.');
      return;
    }
    const identifier = "91" + loginPhone;
    setLoginLoading(true);
    window.sendOtp(
      identifier,
      (data) => {
        setLoginOtpSent(true);
        setLoginStatus('OTP sent successfully!');
        setLoginLoading(false);
      },
      (error) => {
        setLoginStatus('Failed to send OTP. ' + (error?.message || 'Please try again.'));
        setLoginLoading(false);
      }
    );
  };

  const handleLoginResendOtp = () => {
    setLoginStatus('');
    setLoginLoading(true);
    window.retryOtp(
      null,
      (data) => {
        setLoginStatus('OTP resent successfully!');
        setLoginLoading(false);
      },
      (error) => {
        setLoginStatus('Failed to resend OTP. ' + (error?.message || 'Please try again.'));
        setLoginLoading(false);
      }
    );
  };

  const handleLoginVerifyOtp = async () => {
    setLoginStatus('');
    const identifier = "91" + loginPhone;
    setLoginLoading(true);
    window.verifyOtp(
      loginOtp,
      async (data) => {
        // Extract token from message if present
        let msg91Token = data.token || data.accessToken || data.authToken;
        if (!msg91Token && data.type === 'success' && typeof data.message === 'string') {
          msg91Token = data.message;
        }
        if (data.type === 'success' && msg91Token) {
          try {
            // Call your backend to login or fetch user and get your app's JWT token
            const response = await axios.post(`${backendUrl}/api/user/login-phone`, {
              phone: identifier,
              accessToken: msg91Token,
            });
            if (response.data.success) {
              setToken(response.data.token);
              localStorage.setItem("token", response.data.token);
              toast.success("Login successful!");
              navigate("/");
            } else {
              setLoginStatus('User not found.');
            }
          } catch (err) {
            setLoginStatus('Failed to fetch user.');
          }
        } else {
          setLoginStatus('Verification failed. Please try again.');
        }
        setLoginLoading(false);
      },
      (error) => {
        setLoginStatus('Invalid OTP. Please try again.');
        setLoginLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <h3 className="text-3xl font-semibold mb-4 prata-regular">{showLoginOtp ? "Login" : "Sign Up"}</h3>
      <div className="w-full flex flex-col gap-3 relative">
        {!showLoginOtp && !otpSent && (
          <>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-800"
              required
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-800"
              required
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/, '').slice(0, 10))}
              placeholder="Enter 10 digit phone number"
              className="w-full px-3 py-2 border border-gray-800"
              required
              maxLength={10}
            />
          </>
        )}

        {showLoginOtp && !loginOtpSent && !loginUser && (
          <>
            <input
              type="tel"
              value={loginPhone}
              onChange={e => setLoginPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
              placeholder="Enter 10 digit phone number"
              className="w-full px-3 py-2 border border-gray-800"
              required
              maxLength={10}
            />
          </>
        )}

        {/* Only one captcha container, always rendered */}
        <div id={CAPTCHA_CONTAINER_ID} style={{ margin: "10px 30px" }}></div>

        {/* Signup buttons */}
        {!showLoginOtp && !otpSent && (
          <div className="flex w-full">
            <button
              onClick={handleSendOtp}
              className="bg-black text-white font-light px-8 py-2 mt-2 flex-1"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              className="ml-2 mt-2 px-4 py-2 border border-gray-800 text-gray-800 text-sm rounded"
              onClick={() => {
                setShowLoginOtp(true);
                setLoginPhone('');
                setLoginOtp('');
                setLoginOtpSent(false);
                setLoginUser(null);
                setLoginStatus('');
                setOtp('');
                setOtpSent(false);
                setVerificationStatus('');
              }}
              style={{ height: "40px" }}
            >
              Login
            </button>
          </div>
        )}

        {/* Login buttons */}
        {showLoginOtp && !loginOtpSent && !loginUser && (
          <>
            <button
              onClick={handleLoginSendOtp}
              className="bg-black text-white font-light px-8 py-2 mt-2"
              disabled={loginLoading}
            >
              {loginLoading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              className="mt-2 px-4 py-2 border border-gray-800 text-gray-800 text-sm rounded"
              onClick={() => {
                setShowLoginOtp(false);
                setLoginPhone('');
                setLoginOtp('');
                setLoginOtpSent(false);
                setLoginUser(null);
                setLoginStatus('');
                setOtp('');
                setOtpSent(false);
                setVerificationStatus('');
              }}
            >
              Signup
            </button>
          </>
        )}

        {/* Signup OTP verification */}
        {!showLoginOtp && otpSent && (
          <>
            <p>OTP sent to +91 {phoneNumber}.</p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border border-gray-800"
              required
            />
            <div className="flex w-full gap-2">
              <button
                onClick={handleVerifyOtp}
                className="bg-black text-white font-light px-8 py-2 mt-2 flex-1"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-gray-800 text-gray-800 text-sm rounded"
                onClick={handleResendOtp}
                disabled={loading}
                style={{ height: "40px" }}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Login OTP verification */}
        {showLoginOtp && loginOtpSent && !loginUser && (
          <>
            <p>OTP sent to +91 {loginPhone}.</p>
            <input
              type="text"
              value={loginOtp}
              onChange={e => setLoginOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border border-gray-800"
              required
            />
            <div className="flex w-full gap-2">
              <button
                onClick={handleLoginVerifyOtp}
                className="bg-black text-white font-light px-8 py-2 mt-2 flex-1"
                disabled={loginLoading}
              >
                {loginLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-gray-800 text-gray-800 text-sm rounded"
                onClick={handleLoginResendOtp}
                disabled={loginLoading}
                style={{ height: "40px" }}
              >
                Resend OTP
              </button>
            </div>
          </>
        )}

        {/* Login user info */}
        {showLoginOtp && loginUser && (
          <div className="w-full flex flex-col gap-2 mt-4">
            <h4 className="text-lg font-semibold">Your Credentials</h4>
            <div className="border p-3 rounded bg-gray-50">
              <div><b>Name:</b> {loginUser.name}</div>
              <div><b>Email:</b> {loginUser.email}</div>
              <div><b>Phone:</b> {loginUser.phone}</div>
            </div>
            <button
              className="mt-3 px-4 py-2 border border-gray-800 text-gray-800 text-sm rounded"
              onClick={() => {
                setShowLoginOtp(false);
                setLoginPhone('');
                setLoginOtp('');
                setLoginOtpSent(false);
                setLoginUser(null);
                setLoginStatus('');
                setOtp('');
                setOtpSent(false);
                setVerificationStatus('');
              }}
            >
              Back to Signup
            </button>
          </div>
        )}

        {/* Status messages */}
        {!showLoginOtp && <p className="text-red-500">{verificationStatus}</p>}
        {showLoginOtp && <p className="text-red-500">{loginStatus}</p>}
      </div>
    </div>
  );
};

export default OtpAuthentication;
