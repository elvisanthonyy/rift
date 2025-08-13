import { useState, useEffect, useContext, createContext, useRef } from "react";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { VscAccount } from "react-icons/vsc";
import MessageMenu from "./MessageMunu";
import Message from "./Message";
import { MdArrowBackIos } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { SocketContext } from "../pages/Home";
import { ThemeContext } from "../contexts/ThemeContext";
import Loading from "./Loading";
import { MdDelete, MdEdit, MdArrowBack } from "react-icons/md";
//import { SocketContext } from "./SocketContext";

const Chat = ({ conversation, title, userId, call, back }) => {
  const chatRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState();
  const [height, setHeight] = useState("");
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  //const [recieverMessages, setRecieverMessages] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:3000",
  });

  api.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

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
          getMessage();
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    setHeight(`${e.target.scrollHeight}px`);
  };

  const deleteMessage = () => {
    if (selectedMessage !== null) {
      api
        .delete(`/message/${selectedMessage._id}`)
        .then((response) => {
          setSelectedMessage(null);
          getMessage();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getMessage = () => {
    //setLoading(true);
    api
      .get(`/conversation/${conversation._id}`)
      .then((response) => {
        setLoading(false);

        setMessages(response.data.messages);
        //setRecieverMessages(response.data.receiverMessages);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
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
    if (selectedMessage !== null && selectedMessage._id == message._id) {
      setSelectedMessage(null);
    }
  };

  const handleMouseUp = () => {
    clearTimeout(timer);
  };

  useEffect(() => {
    getMessage();
    if (socket) {
      socket.on("notification", () => {
        //toast(message.text)
        getMessage();
      });
    }
  }, []);
  return (
    <>
      <div className=" ">
        <div
          className={`flex bg-amber-400 flex-col w-90 h-120 rounded-sm fixed items-center shadow-lg right-[1%] ${
            theme == "light"
              ? "bg-lightTheme-background text-lightTheme-text"
              : "bg-darkTheme-background text-darkTheme-text border-1 border-darkTheme-border scrollbar-custom"
          }  top-22`}
        >
          {selectedMessage == null ? (
            <div className="flex justify-between w-[90%] m-4 mt-4 border-b-1 border-gray-300 px-2 py-4">
              <div className="flex justify-center items-center">
                <div onClick={back} className="cursor-pointer">
                  <MdArrowBackIos />
                </div>
                <div>
                  <VscAccount className="text-2xl" />
                </div>
              </div>

              <div className="flex items-center justify-evenly w-[30%]">
                <div className="w-2 h-2 rounded-[50%] bg-green-500 mr-4"></div>
                <div>{title}</div>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-between w-[90%] m-4 mt-4 border-b-1 border-gray-300 py-4 px-1"
              onClick={deleteMessage}
            >
              <MdArrowBack
                className="text-xl cursor-pointer"
                onClick={() => setSelectedMessage(null)}
              />
              <MdDelete className="text-xl cursor-pointer" />
            </div>
          )}

          <div
            className={`flex w-full flex-col-reverse m-5 overflow-y-scroll h-70 px-5 py-4 ${
              theme == "light" ? "" : "scrollbar-custom"
            }`}
          >
            {loading ? (
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
                <Loading />
              </div>
            ) : messages.length == 0 ? (
              ""
            ) : (
              <div className="">
                {messages.map((message, index) => (
                  <div className="w-full h-9 m-2 relative" key={message._id}>
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
            onSubmit={(e) => sendMessage(conversation._id, e)}
            className="flex justify-between items-center absolute bottom-10 w-[90%]"
          >
            <textarea
              className={`w-[87%] border-gray-500 rounded-3xl resize-none p-2 pl-5 pt-2 max-h-24 h-8 text-sm overflow-hidden text-gray-900 bg-gray-200 focus:outline-none `}
              type="text"
              value={text}
              style={{ height }}
              onChange={handleInput}
            />
            <button
              type="submit"
              className="w-8 h-8 text-sm bg-red-500 flex justify-center items-center cursor-pointer rounded-[50%] "
            >
              <MdSend />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
