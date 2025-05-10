import React from "react";
import Form from "../components/Form.jsx";
import Footer from "../components/Footer.jsx";

const Register = () => {
  return (
    <div>
      <Form method="register" route="http://localhost:3000/user/register" />
      <Footer />
    </div>
  );
};

export default Register;
