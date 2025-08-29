import React from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-black"
      onClick={() => navigate("/home")}
    >
      <img src="/assets/onboarding.png" alt="Onboarding" className="w-full h-full object-cover" />
    </div>
  );
}