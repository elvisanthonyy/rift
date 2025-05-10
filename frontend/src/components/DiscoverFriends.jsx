import { useContext } from "react";
import { VscAccount } from "react-icons/vsc";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../contexts/ThemeContext";

const DiscoverFriends = ({ friend, addFriend }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div
        className={`flex items-center p-3 px-5 w-full justify-between ${
          theme == "light"
            ? "bg-lightTheme-body text-lightTheme-text"
            : "bg-darkTheme-body text-darkTheme-text border-1 border-darkTheme-border"
        }  h-12 mt-2 mb-1 rounded-lg cursor-pointer`}
        key={friend._id}
      >
        <div className="flex items-center">
          <div className="flex justify-center items-center text-[16px] h-8 w-8 rounded-[50%] mr-3">
            <VscAccount />
          </div>
          <div className="text-sm">{friend.username}</div>
        </div>
        <button className="flex w-8 h-8 rounded-2xl  text-amber-50 cursor-pointer hover:opacity-80 text-[12px] justify-center items-center">
          <MdSend className="text-black text-xl" onClick={addFriend} />
        </button>
      </div>
    </>
  );
};

export default DiscoverFriends;
