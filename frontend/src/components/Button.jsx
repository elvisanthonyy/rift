import React from "react";
import { Link } from "react-router-dom";

const Button = ({ name, handleEvents, destination, action }) => {
  return (
    <Link to={destination}>
      <button
        className="w-75 h-7 m-6 rounded-sm cursor-pointer text-amber-50 bg-red-500 hover:opacity-60"
        type={action}
        onClick={handleEvents}
      >
        {name}
      </button>
    </Link>
  );
};

export default Button;
