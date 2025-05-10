import React from "react";

const MessageMunu = ({ message, userId, onClose }) => {
  return (
    <div className="w-full h-full top-0 left-0 z-10" onClick={onClose}>
      <div
        className={`flex justify-center items-center w-fit h-9 bg-blue-500 p-5 ${
          message.senderId == userId ? "ml-auto" : "mr-auto"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        delete
      </div>
    </div>
  );
};

export default MessageMunu;
