import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-current border-t-transparent"></div>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loading;
