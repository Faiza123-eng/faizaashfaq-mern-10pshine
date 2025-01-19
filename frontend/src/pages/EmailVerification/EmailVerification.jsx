import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    console.log("Verification Status:", verified); 
    setVerificationStatus(verified);
  
    if (verified === "true") {
      setTimeout(() => navigate("/dashboard"), 3000); 
    }
  }, [location, navigate]);
  

  return (
    <div className="email-verification-container">
      <div className="email-verification-card">
        {verificationStatus === "true" ? (
          <>
            <h1 className="email-verification-title">Email Verified!</h1>
            <p className="email-verification-text">
              Your email has been successfully verified. Redirecting to the dashboard...
            </p>
          </>
        ) : verificationStatus === "false" ? (
          <>
            <h1 className="email-verification-title">Verification Failed</h1>
            <p className="email-verification-text">
              The verification link is invalid or expired. Please try signing up again.
            </p>
          </>
        ) : (
          <>
            <h1 className="email-verification-title">Check Your Email</h1>
            <p className="email-verification-text">
              A verification link has been sent to your email. Please verify your account to continue.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
