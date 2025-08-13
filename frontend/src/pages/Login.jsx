import React from "react";
import Form from "../components/Form.jsx";
import Footer from "../components/Footer.jsx";

const API = import.meta.env.VITE_REACT_API_URL;

const Login = () => {
  return (
    <div>
      <Form method="login" route={`${API}/user/login`} />
      <Footer />
    </div>
  );
};

export default Login;
