import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="animate-spin rounded-full h-6 w-6 m:h-12 m:w-12 border-2 md:border-4 border-current border-t-transparent"></div>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Loading;
