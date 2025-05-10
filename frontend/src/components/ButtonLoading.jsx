import React from "react";

const ButtonLoading = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default ButtonLoading;
