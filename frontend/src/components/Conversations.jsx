import { useEffect, useState, useContext } from "react";

import { ThemeContext } from "../contexts/ThemeContext";

const Conversations = ({ conversation, title }) => {
  const { theme } = useContext(ThemeContext);
  const option = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    <div key={conversation._id} className="w-full">
      <div
        className={`flex items-center p-3 px-5 w-full justify-between ${
          theme == "light"
            ? "bg-lightTheme-body text-lightTheme-text"
            : "bg-darkTheme-body text-darkTheme-text border-0 md:border-1 md:border-darkTheme-border"
        } h-15 mt-2 mb-1 hover:opacity-60`}
      >
        <div className="flex w-fit items-center">
          <div className="h-2 w-2 rounded-[50%] bg-green-600 mr-5"></div>
          <div className="text-sm">{title}</div>
        </div>
        <div className="text-[12px]">
          {new Date(conversation.updatedAt).toLocaleTimeString("en-Us", option)}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
