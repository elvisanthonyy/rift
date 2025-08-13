import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { VscAccount } from "react-icons/vsc";
import {
  MdHome,
  MdMessage,
  MdOutlineGroup,
  MdOutlinePermIdentity,
  MdSend,
  MdLogout,
} from "react-icons/md";

import rift from "../assets/rift.svg";
import rift_dark from "../assets/rift_dark.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConversationContext } from "./ConversationContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const API = import.meta.env.VITE_REACT_API_URL;

const Nav = ({ handle, handleT, method, checkMessage, checkFriend }) => {
  const navigate = useNavigate();
  const { selectedConversation, setSelectedConversation } =
    useContext(ConversationContext);
  const { theme, handleThemeChange } = useContext(ThemeContext);
  const name = method === "profile" ? "Profile" : "Others";
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`${API}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    toast.success("You've logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };
  return (
    <>
      <nav
        className={`flex fixed top-0 left-0 w-full h-15 md:h-19 ${
          theme == "light"
            ? "bg-lightTheme-background text-lightTheme-text"
            : "bg-darkTheme-background text-darkTheme-text border-b-1 border-b-darkTheme-border"
        } shadow-sm items-center px-[2%] md:px-[5%] justify-between z-20`}
      >
        <div className="flex items-center  md:min-w-80 w-fit">
          <div className="text-2xl text-red-700 mx-4 mr-10">
            {theme == "light" ? (
              <img className="h-4 md:h-6" alt="rift" src={rift} />
            ) : (
              <img className="h-3 md:h-4" alt="rift" src={rift_dark} />
            )}
          </div>
          <div className="flex md:min-w-35 w-fit h-full justify-start items-center">
            <div className="h-10 w-10 mr-2 rounded-[50%] flex items-center text-lg">
              <Link to="/profile">
                <VscAccount className="text-md md:text-2xl" />
              </Link>
            </div>

            {loading ? (
              <div className="hidden md:block">Null</div>
            ) : (
              //user names
              <div className="flex  md:min-w-18 w-fit ">
                <div className="hidden md:block mr-2">{profile.firstName}</div>
                <div className="hidden md:block mr-2">{profile.lastName}</div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex text-[18px] md:text-[21px] h-full ${
            name == "Others" ? "w-[45%] md:w-[380px]" : "w-fit"
          } justify-between items-center`}
        >
          {name == "Others" ? (
            <>
              <div
                className={`flex  cursor-pointer h-full w-20 items-center justify-center ${
                  checkFriend ? "text-red-500 " : ""
                }  hover:opacity-75  `}
                onClick={handleT}
              >
                <MdOutlinePermIdentity />
              </div>

              <div
                className={`flex cursor-pointer h-full w-20 items-center justify-center ${
                  checkMessage ? "text-red-500" : ""
                } hover:opacity-75 `}
                onClick={handle}
              >
                <MdMessage className="text-[14px] md:text-[19px]  " />
              </div>
            </>
          ) : (
            ""
          )}

          <Link to="/" className="h-full">
            <div
              className={`flex cursor-pointer h-full w-10 items-center justify-center  text-darktheme-text ${
                theme == "light"
                  ? "hover:bg-lightTheme-body/25"
                  : "hover:bg-darkTheme-body"
              }`}
            >
              <MdHome />
            </div>
          </Link>

          <div className="hidden h-full md:flex justify-between items-center">
            <div
              className={`flex bg-amber-200? "text-black" : "text-white"
          }`}
              onClick={handleThemeChange}
            >
              {theme == "light" ? <MdLightMode /> : <MdDarkMode />}
            </div>
            <div
              className={`flex cursor-pointer h-full w-40 items-center justify-center ${
                theme == "light"
                  ? "hover:bg-lightTheme-body/25"
                  : "hover:bg-darkTheme-body"
              } `}
              onClick={logOut}
            >
              <MdLogout />
              <div className="text-sm ml-3 text-red-500">Log Out</div>
            </div>
          </div>
          <div className="block h-fit w-fit mx-4">
            <span className="block w-[18px] h-[1px] rounded-lg bg-white m-[4px]"></span>
            <span className="block w-[18px] h-[1px] rounded-lg bg-white m-[4px]"></span>
            <span className="block w-[18px] h-[1px] rounded-lg bg-white m-[4px]"></span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
