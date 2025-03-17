import React from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    // Simulate successful signup logic
    const signupSuccess = true; // Replace with actual signup logic

    if (signupSuccess) {
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      console.error("Signup failed");
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
