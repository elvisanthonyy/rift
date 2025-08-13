import React from "react";
import Form from "../components/Form.jsx";
import Footer from "../components/Footer.jsx";

const API = import.meta.env.VITE_REACT_API_URL;

const Register = () => {
  return (
    <div>
      <Form method="register" route={`${API}/user/register`} />
      <Footer />
    </div>
  );
};

export default Register;
