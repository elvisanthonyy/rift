import { useState, useEffect, useContext, createContext, useRef } from "react";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import { MdArrowBackIos } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { SocketContext } from "../pages/Home";
import { ThemeContext } from "../contexts/ThemeContext";
import Loading from "./Loading";
import { MdDelete, MdEdit, MdArrowBack } from "react-icons/md";
import api from "../libs/api";
//import { SocketContext } from "./SocketContext";

const MobileChat = ({
  conversation,
  userId,
  messages,
  otherUser,
  getMessages,
}) => {
  const navigate = useNavigate();

  const chatRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState();
  const [height, setHeight] = useState("");
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  //const [recieverMessages, setRecieverMessages] = useState([]);

  const sendMessage = async (id, e) => {
    e.preventDefault();
    //setLoading(true);

    const data = {
      text: text,
    };

    if (text.length == 0) {
      alert("input empty");
      return;
    } else {
      api
        .post(`/message/${id}`, data)
        .then((response) => {
          setHeight("");
          setLoading(false);
          setText("");
          getMessages();
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    //setHeight(`${e.target.scrollHeight}px`);
  };

  const deleteMessage = () => {
    if (selectedMessage !== null) {
      api
        .delete(`/message/${selectedMessage._id}`)
        .then((response) => {
          setSelectedMessage(null);
          getMessages();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleMouseDown = (e, message) => {
    if (e.button === 0) {
      const timer = setTimeout(() => {
        setSelectedMessage(message);
        setTimer(timer);
      }, 500);
    }
  };

  const handleRemoveSelection = (e, message) => {
    if (selectedMessage !== null && selectedMessage?._id == message?._id) {
      setSelectedMessage(null);
    }
  };

  const handleMouseUp = () => {
    clearTimeout(timer);
  };

  useEffect(() => {
    if (socket) {
      socket.on("notification", () => {
        //toast(message.text)
      });
    }
  }, []);

  return (
    <>
      <div className=" ">
        <div
          className={`flex flex-col w-[100%] h-[100dvh] items-center shadow-lg right-[1%] ${
            theme == "light"
              ? "bg-lightTheme-background text-lightTheme-text"
              : "bg-darkTheme-background text-darkTheme-text md:border-1 md:border-darkTheme-border scrollbar-custom"
          } top-17 left-0 `}
        >
          {selectedMessage == null ? (
            <div className="flex h-20 justify-between w-full px-5 border-b-1 border-gray-300 py-4">
              <div className="flex justify-center items-center">
                <div
                  onClick={() => navigate(-1)}
                  className="cursor-pointer mr-3"
                >
                  <MdArrowBackIos />
                </div>
                <div className="h-9 w-9 bg-blue-500 shrink-0 md:mr-2 rounded-[50%] flex items-center justify-center text-lg">
                  <FaUser className="text-lg md:text-2xl" />
                </div>
              </div>

              <div className="flex items-center justify-evenly w-[30%]">
                <div className="w-2 h-2 rounded-[50%] bg-green-500 mr-4"></div>
                <div>{otherUser[0]?.name}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full h-15 px-7 m-4 mt-4 border-b-1 border-gray-300 py-4">
              <MdArrowBack
                className="text-xl cursor-pointer"
                onClick={() => setSelectedMessage(null)}
              />
              <MdDelete
                onClick={deleteMessage}
                className="text-xl cursor-pointer"
              />
            </div>
          )}

          <div
            className={`flex w-full   flex-col-reverse m-5 overflow-y-scroll h-[73%] md:h-70 px-5 py-4 ${
              theme == "light" ? "" : "scrollbar-custom"
            }`}
          >
            {loading ? (
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
                <Loading />
              </div>
            ) : messages?.length == 0 ? (
              ""
            ) : (
              <div className="">
                {messages?.map((message, index) => (
                  <div className="w-full h-11 my-3 relative" key={message?._id}>
                    <div
                      className={` cursor-pointer absolute w-full h-full ${
                        selectedMessage !== null &&
                        selectedMessage._id == message._id
                          ? "bg-green-500/50 z-10"
                          : ""
                      }`}
                      onClick={(e) => handleRemoveSelection(e, message)}
                    ></div>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, message)}
                      onMouseUp={handleMouseUp}
                    >
                      <Message message={message} userId={userId} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            //for sending messages
            onSubmit={(e) => sendMessage(conversation?._id, e)}
            className="flex justify-between items-center absolute bottom-10 w-[90%]"
          >
            <textarea
              className={`w-[87%] border-gray-500  mr-3 rounded-3xl resize-none p-2 pl-5 pt-2 max-h-24 h-11 text-sm overflow-hidden text-gray-900 bg-gray-200 focus:outline-none `}
              value={text}
              style={{ height }}
              onChange={handleInput}
            />
            <button
              type="submit"
              className="w-11 h-11 text-sm bg-red-500 flex justify-center items-center cursor-pointer rounded-[50%] "
            >
              <MdSend />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MobileChat;
