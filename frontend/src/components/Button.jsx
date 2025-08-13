import React from "react";
import { Link } from "react-router-dom";

const Button = ({ name, handleEvents, destination, action }) => {
  return (
    <button
      className="flex justify-center items-center w-[90%] h-7 m-6 rounded-sm cursor-pointer text-amber-50 bg-red-500 hover:opacity-60"
      type={action}
      onClick={handleEvents}
    >
      {name}
    </button>
  );
};

export default Button;
