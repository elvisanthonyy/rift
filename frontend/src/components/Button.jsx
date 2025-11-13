import React from "react";
import { Link } from "react-router-dom";

const Button = ({ name, handleEvents, destination, action }) => {
  return (
    <button
      className="flex justify-center text-[14px] md:text-md items-center w-full h-11 m-4 md:m-6 rounded-xl cursor-pointer text-amber-50 bg-red-500 hover:opacity-60"
      type={action}
      onClick={handleEvents}
    >
      {name}
    </button>
  );
};

export default Button;
