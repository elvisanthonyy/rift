import React from "react";
import Form from "../components/Form.jsx";
import Footer from "../components/Footer.jsx";

const Login = () => {
  return (
    <div>
      <Form method="login" route="http://localhost:3000/user/login" />
      <Footer />
    </div>
  );
};

export default Login;
