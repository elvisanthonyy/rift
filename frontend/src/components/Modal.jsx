import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const Modal = ({ handleNo, handleYes }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className="h-full w-full flex justify-center items-center fixed top-0 left-0 bg-black/50 z-40"
      onClick={handleNo}
    >
      <div
        className={`${
          theme == "light"
            ? "bg-lightTheme-background text-lightTheme-text"
            : "bg-darkTheme-background text-darkTheme-text border-darkTheme-border"
        } h-80 w-110 rounded-xl flex flex-col justify-center items-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>Are you sure you want to delete</div>
        <div>
          <button
            onClick={handleYes}
            className="w-20 h-8 bg-red-500 m-4 cursor-pointer hover:opacity-50"
          >
            Yes
          </button>
          <button
            onClick={handleNo}
            className="w-20 h-8 bg-red-500 m-4 cursor-pointer hover:opacity-50"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
