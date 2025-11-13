import { useEffect, useState, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Nav from "../components/Nav";
import Conversations from "../components/Conversations";
import Post from "../components/Post";
import axios from "axios";
import Chat from "../components/Chat";
import { MdSend, MdClose } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import Message from "../components/Chat";
import DiscoverFriends from "../components/DiscoverFriends";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ConversationProvider,
  ConversationContext,
} from "../components/ConversationContext";
import io from "socket.io-client";
import { ThemeContext } from "../contexts/ThemeContext";
import ButtonLoading from "../components/ButtonLoading";
//import { SocketProvider } from "../components/SocketContext";

export const SocketContext = createContext();

const token = localStorage.getItem("token");

const API = import.meta.env.VITE_REACT_API_URL;

console.log(API);

const socket = io(API, {
  auth: {
    token: token,
  },
});

const Home = () => {
  //state variables
  //const [token, setToken] = useState("");

  const [notification, setNotification] = useState();
  const [height, setHeight] = useState("auto");
  const { theme, handleThemeChange } = useContext(ThemeContext);
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [titles, setTitles] = useState([]);
  const { selectedConversation, setSelectedConversation } =
    useContext(ConversationContext);
  const [chatIndex, setChatIndex] = useState("");
  const [checkChat, setCheckChat] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isFriendOpen, setIsFriendOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState();
  const [discoverFriends, setDicoverFriends] = useState();
  const [friends, setFriends] = useState([]);
  const [postError, setPostError] = useState(false);
  const [friendCount, setFriendCount] = useState("");
  const [loading, setLoading] = useState({
    fetchData: false,
    post: false,
    getFriends: false,
    getConversations: false,
  });

  //open and close message
  const handleMessageOpen = () => {
    if (window.innerWidth < 762) {
      setIsMessageOpen(true);
      setIsFriendOpen(false);
      setCheckChat(false);
    } else {
      isMessageOpen ? setIsMessageOpen(false) : setIsMessageOpen(true);
      checkChat && setCheckChat(false);
    }
  };

  //open and close friend box
  const handleFriendOpen = () => {
    if (window.innerWidth < 762) {
      setIsMessageOpen(false);
      setIsFriendOpen(true);
    } else {
      isFriendOpen ? setIsFriendOpen(false) : setIsFriendOpen(true);
    }
  };

  //for opening/closing, and appending data to chat
  const openChat = (conversation, index) => {
    setSelectedConversation(conversation);
    setChatIndex(index);
    checkChat ? setCheckChat(false) : setCheckChat(true);
    isMessageOpen && setIsMessageOpen(false);
  };

  const api = axios.create({
    baseURL: API,
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
  //send post
  const sendPost = (e) => {
    setLoading((prevLoading) => ({ ...prevLoading, post: true }));
    e.preventDefault();

    const data = {
      post: post,
    };

    if (post.length == 0) {
      setLoading((prevLoading) => ({ ...prevLoading, post: false }));
      setPostError(true);
      setTimeout(() => {
        setPostError(false);
      }, 500);
    } else {
      api
        .post("/post", data)
        .then((response) => {
          setLoading((prevLoading) => ({ ...prevLoading, post: false }));
          if (response.data.status == "okay") {
            toast.success("Your post has been added");
          } else {
            toast.error("Failed to add your post");
          }
          setPost("");
        })
        .catch((error) => {
          setLoading((prevLoading) => ({ ...prevLoading, post: false }));
          console.log(error);
        });
    }
  };

  const handleInput = (e) => {
    setPost(e.target.value);
    setHeight(`${e.target.scrollHeight}px`);
  };
  //send message to friend

  const sendMessage = (friendId) => {
    const conversation = conversations.find((conversation) =>
      conversation.participants.some(
        (participant) => participant.userId == friendId
      )
    );

    //get conversation index
    //const index = conversations.indexOf(conversation);

    console.log(conversation);
    const index = conversations.indexOf(conversation);
    setSelectedConversation(conversation);
    setChatIndex(index);
    setCheckChat(true);
    setIsMessageOpen(false);

    /*api
      .get(`/message/${id}`)
      .then((response) => {
        setSelectedConversation(response.data.conversation);
        setLoading(false);
        getConversation();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });*/
  };

  //like post

  //get friends post
  function getPost() {
    setLoading((prevLoading) => ({ ...prevLoading, fetchData: true }));
    api
      .get("/post/friends")
      .then((response) => {
        setLoading((prevLoading) => ({ ...prevLoading, fetchData: false }));
        setPosts(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        setLoading((prevLoading) => ({ ...prevLoading, fetchData: false }));
        setLoading(false);
      });
  }

  //get conversations
  function getConversation() {
    api
      .get("/conversation")
      .then((response) => {
        //seting conversations
        setTitles(response.data.titles);
        setConversations(response.data.conversations);
        //for passing userId to message component
        setUserId(response.data.userId);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  //for adding friends
  const addFriend = (id) => {
    api
      .post(`/friend/${id}`, null)
      .then((response) => {
        setLoading(false);

        if (response.data.status === "ok") {
          toast.success("added");
        } else {
          toast.error("already friends");
        }
        getFriends();
        getDiscoverFriends();
        getConversation();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  //for getting discover friends
  const getDiscoverFriends = () => {
    setLoading(true);

    api
      .get("user/discover")
      .then((response) => {
        setDicoverFriends(response.data.discoverFriends);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //for getting friend
  const getFriends = () => {
    setLoading(true);

    api
      .get("/friend")
      .then((response) => {
        setFriends(response.data.friends);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        //setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(false);
    getFriends();

    getConversation();

    getDiscoverFriends();

    getPost();
    socket.on("notification", (message) => {
      //toast(message.text)
      toast(message.text);
    });

    if (isMessageOpen || isFriendOpen || checkChat) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [isMessageOpen, isFriendOpen, checkChat]);

  const hello = () => {
    toast("hello", {
      className: "bg-amber-400",
    });
  };

  return (
    <>
      <SocketContext.Provider value={socket}>
        <div
          className={`min-h-[90vh] pt-19 md:pt-22 overflow-x-hidden ${
            theme == "light" ? "bg-lightTheme-body" : "bg-darkTheme-body"
          }`}
        >
          <Nav
            //nav bar

            //open message box
            handle={handleMessageOpen}
            //open friend box
            handleT={handleFriendOpen}
            //check if messasge is open
            checkMessage={isMessageOpen}
            //check if friend is open
            checkFriend={isFriendOpen}
            method="others"
          />

          {loading.fetchData ? (
            <div className="flex justify-center items-center h-screen">
              <Loading />
            </div>
          ) : (
            <></>
          )}

          <div
            className={`md:flex flex-col text-sm w-full md:w-[50%] min-h-[91dvh] max-h-fit  mx-auto items-center ${
              theme == "light"
                ? "bg-lightTheme-background text-lightTheme-text"
                : "bg-darkTheme-background text-darkTheme-text md:border-1 md:border-darkTheme-border"
            } ${isFriendOpen || isMessageOpen ? "hidden" : "flex"}`}
          >
            <form
              //form for sending posts
              className={`flex h-20 md:h-30 w-full border-b-1 ${
                theme == "light"
                  ? "border-b-lightTheme-border"
                  : "border-b-darkTheme-border"
              }   justify-between items-center px-4`}
              onSubmit={sendPost}
            >
              <textarea
                //post input
                rows="1"
                className={`flex w-[85%] p-2 min-h-9 h-fit rounded-sm max-h-25 resize-none overflow-hidden focus:outline-none ${
                  theme == " light"
                    ? " border-lightTheme-border bg-lightTheme-body"
                    : " border-darkTheme-border bg-darkTheme-body"
                }  ${postError ? "border-red-400 wobble" : ""}`}
                style={{ height }}
                value={post}
                onChange={handleInput}
              />
              <button
                //post button
                type="submit"
                value="post"
                className={`w-15 ml-3 md:w-20 rounded-md ${
                  theme == "light"
                    ? "bg-lightTheme-text text-lightTheme-background "
                    : "bg-darkTheme-text text-darkTheme-body "
                } hover:opacity-50 text-sm cursor-pointer h-9 `}
              >
                {loading.post ? <ButtonLoading /> : "Post"}
              </button>
            </form>

            {loading.fetchData ? (
              //ensure post is not undefined to prevent erro
              <Loading />
            ) : posts?.length == 0 ? (
              <div className="my-auto">No post to view</div>
            ) : (
              <div
                className="w-full flex flex-col justify-center"
                //for each post
              >
                {posts?.map((post, index) => (
                  <div key={post._id}>
                    <Post post={post} userId={userId} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {checkChat && (
            //checking if chat is open

            <Chat
              conversation={selectedConversation}
              title={titles[chatIndex]}
              userId={userId}
              call={sendMessage}
              back={handleMessageOpen}
            />
          )}
          <div
            //conversation container
            className={`flex flex-col w-screen h-[100dvh] md:w-[22%] md:h-110 rounded-sm shadow-lg fixed ${
              theme == "light"
                ? "bg-lightTheme-background text-lightTheme-text"
                : "bg-darkTheme-background text-darkTheme-text md:border-1 border-darkTheme-border scrollbar-custom "
            } md:right-[1%] top-19 md:top-22 overflow-y-scroll transition p-7 duration-800 ${
              isMessageOpen ? "-translate-x-0 " : "translate-x-150"
            }`}
          >
            <div className="flex h-14 items-center justify-between w-[100%] border-b-1 border-b-gray-400 mb-5">
              <h1 className="mb-5  pb-5 pt-5">Messages</h1>
              <div
                onClick={() => setIsMessageOpen(false)}
                className="cursor-pointer flex justify-center items-center"
              >
                <MdClose />
              </div>
            </div>
            {loading.fetchData || titles === undefined ? (
              //check if conversations is defined before rendering to prevent errors
              <Loading />
            ) : (
              <div className="w-full">
                {conversations.map((conversation, index) => (
                  //for each conversation

                  <div
                    className="cursor-pointer w-full"
                    key={conversation._id}
                    onClick={() => openChat(conversation, index)}
                  >
                    <Conversations
                      title={titles[index]}
                      conversation={conversation}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className={`flex flex-col w-screen h-full md:w-[22%] md:h-110 rounded-sm  items-center shadow-lg fixed ${
              theme == "light"
                ? "bg-lightTheme-background text-lightTheme-text"
                : "bg-darkTheme-background text-darkTheme-text md:border-1 md:border-darkTheme-border scrollbar-custom"
            } md:left-[1%] left-[0%] top-19 md:top-22 transition duration-800 overflow-y-scroll ${
              isFriendOpen ? "translate-x-0 " : "-translate-x-150"
            }`}
          >
            <div className="flex items-center justify-between mb-5 mt-5 w-[85%] py-2 border-b-1 border-b-gray-400 ">
              <p>Friends: {friends?.length}</p>
              <div
                onClick={() => setIsFriendOpen(false)}
                className="cursor-pointer"
              >
                <MdClose />
              </div>
            </div>
            {loading.fetchData || friends == undefined ? (
              <Loading />
            ) : (
              <div className="flex w-[85%] flex-col">
                {friends.map((friend, index) => (
                  <div
                    className={`flex items-center p-3 px-5 w-[100%] justify-between text-xl ${
                      theme == "light"
                        ? "bg-lightTheme-body text-lightTheme-text"
                        : "bg-darkTheme-body text-darkTheme-text border-1 border-darkTheme-border"
                    }  h-12 mt-2 mb-1 rounded-lg cursor-pointer`}
                    key={(friend._id, index)}
                  >
                    <div className="flex items-center">
                      <div className="flex justify-center items-center h-8 w-8 rounded-[50%] mr-3">
                        <VscAccount />
                      </div>
                      <div className="text-sm">{friend.username}</div>
                    </div>
                    <button
                      className="flex w-8 h-8 rounded-2xl  text-amber-50 cursor-pointer hover:opacity-80 text-[12px] justify-center items-center"
                      onClick={() => sendMessage(friend.friendId, index)}
                    >
                      <MdSend className="text-black text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex  mb-5 mt-10 w-[85%] border-b-1 border-b-gray-400 ">
              <p>Discover</p>
            </div>
            {discoverFriends == undefined ? (
              "no friends to discover"
            ) : (
              <div className="flex w-[85%] flex-col">
                {discoverFriends.map((discoverFriend, index) => (
                  <div className="w-full" key={discoverFriend._id}>
                    <DiscoverFriends
                      friend={discoverFriend}
                      addFriend={() => addFriend(discoverFriend._id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SocketContext.Provider>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={true}
      />
    </>
  );
};

export default Home;
