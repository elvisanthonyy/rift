import { useState } from "react";
import MessageMenu from "./MessageMunu";

import axios from "axios";

const Message = ({ message, userId }) => {
  const option = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    <>
      <div
        className={`relative flex flex-none min-w-13 min-h-9 h-fit flex-wrap max-w-[60%] my-4 text-white text-[12px] text-left text-sm  ${
          message.senderId == userId
            ? "bg-red-600 ml-auto"
            : "bg-blue-600 mr-auto"
        } rounded-xl mt-3 p-1 px-3 `}
      >
        <p className="mr-20 w-[95%] min-h-9 break-words h-auto">
          {message.text}
        </p>
        <p className=" absolute bottom-1 right-3 text-[10px]">
          {new Date(message.createdAt).toLocaleTimeString("en-US", option)}
        </p>
      </div>
    </>
  );
};

export default Message;
