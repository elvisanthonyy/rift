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

import { FiMessageCircle } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

import rift from "../assets/rift.svg";
import rift_dark from "../assets/rift_dark.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConversationContext } from "./ConversationContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const API = import.meta.env.VITE_REACT_API_URL;

const Nav = ({
  handle,
  handleT,
  method,
  checkMessage,
  checkFriend,
  pageName,
}) => {
  const navigate = useNavigate();
  const { selectedConversation, setSelectedConversation } =
    useContext(ConversationContext);
  const { theme, handleThemeChange } = useContext(ThemeContext);
  const name = method === "profile" ? "Profile" : "Others";
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  const handleOpenMenu = () => {
    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
  };

  return (
    <>
      <nav
        className={`flex fixed top-0 left-0 w-full h-21 md:h-19 ${
          theme == "light"
            ? "bg-lightTheme-background text-lightTheme-text"
            : "bg-darkTheme-background text-darkTheme-text border-b-1 border-b-darkTheme-border"
        } shadow-sm items-center px-[4%] md:px-4%] justify-between z-20`}
      >
        <div className="flex items-center mx-[4px] justify-center md:justify-start md:min-w-60 w-fit">
          <div className="flex md:min-w-35 w-fit h-full justify-start items-center">
            <div className="h-9 w-9 bg-blue-500 shrink-0 md:mr-5 rounded-[50%] flex items-center justify-center text-lg">
              <Link to="/profile">
                <FaUser className="text-lg md:text-xl" />
              </Link>
            </div>

            {loading ? (
              <div className="hidden md:block">Null</div>
            ) : (
              //user names
              <div className="hidden md:flex md:min-w-18 w-fit ">
                <div className="hidden md:block mr-2">{profile.firstName}</div>
                <div className="hidden md:block mr-2">{profile.lastName}</div>
              </div>
            )}
          </div>
        </div>
        <div className="text-2xl hidden shrink-0 md:w-20  md:flex text-red-700 md:mx-4 md:mr-10">
          {theme == "light" ? (
            <img className=" h-5 md:h-5" alt="rift" src={rift} />
          ) : (
            <img className="h-4 md:h-5" alt="rift" src={rift_dark} />
          )}
        </div>
        <div
          className={`flex shrink-0 min-w-[50%]  lg:w-[60%] md:min-w-[20%] text-[20px] md:text-[21px] h-full ${
            name == "Others"
              ? "w-fit md:w-[30%] justify-between"
              : "w-fit justify-center lg:justify-between"
          }  items-center`}
        >
          <div
            onClick={() =>
              pageName === "home" ? window.location.reload() : navigate("/")
            }
            className={`flex cursor-pointer ${
              name == "Others" ? "" : "lg:mx-auto"
            }  h-full w-13 md:w-20 items-center justify-center  text-darktheme-text ${
              theme == "light"
                ? "hover:bg-lightTheme-body/25"
                : "hover:bg-darkTheme-body"
            }`}
          >
            <MdHome className="text-2xl" />
          </div>

          {name == "Others" ? (
            <>
              <div
                className={`flex shrink-0 cursor-pointer h-full w-13  md:w-20 items-center justify-center ${
                  checkFriend ? "text-white" : "text-shadow-lightTheme-border"
                }  hover:opacity-75  `}
                onClick={handleT}
              >
                <FaUser className="text-lg" />
              </div>

              <div
                className={`flex shrink-0 cursor-pointer w-13 h-full md:w-20 mt-[3px] items-center justify-center ${
                  checkMessage ? "text-white" : "ext-shadow-lightTheme-borde"
                } hover:opacity-75 `}
                onClick={handle}
              >
                <MdMessage className="text-[22px] md:text-[19px]  " />
              </div>
            </>
          ) : (
            ""
          )}

          <div
            className={` ${
              isMenuOpen
                ? "fixed bg-black/50  w-[100%] h-[100dvh] top-0 right-0"
                : "hidden"
            } m:h-full md:justify-end  shrink-0 lg:justify-end items-center md:h-full lg:flex w-60 `}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className={` 
                
                   grid z-15 grid-rows-9 place-items-center gap-y-3 items-center justify-center gap-4  py-17 md:py-0 w-[70%] md:w-[50%] top-0 right-0 h-[100dvh] lg:w-full
                  
               lg:h-full md:flex absolute lg:static ${
                 theme == "light"
                   ? "bg-lightTheme-body lg:bg-transparent"
                   : "bg-darkTheme-body lg:bg-transparent"
               } `}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`cursor-pointer shrink-0 lg:justify-end w-fit md:w-13 items-center justify-start text-[16px] flex "text-black" : "text-white"
          }`}
                onClick={handleThemeChange}
              >
                {theme == "light" ? (
                  <MdLightMode className="mr-2 text-[18px]" />
                ) : (
                  <MdDarkMode className="mr-2 text-[18px]" />
                )}
                <div className="text-[14px] ">
                  {theme == "light" ? "Light" : "Dark"}
                </div>
              </div>
              <div
                className={`flex shrink-0 text-[16px] lg:justify-end cursor-pointer  w-fit  h-full md:w-30 items-center justify-center  ${
                  theme == "light" ? "hover:opacity-85" : "hover:opacity-85"
                } `}
                onClick={logOut}
              >
                <MdLogout className="text-[18px] mr-2" />
                <div className="flex shrink-0  text-[14px] w-14 md:text-sm">
                  Log Out
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="block z-20 lg:hidden h-fit w-fit mx-2 cursor-pointer"
          onClick={handleOpenMenu}
        >
          <span
            className={`block w-[22px] h-[2px] ${
              theme === "light" ? "bg-black" : "bg-lightTheme-body"
            } rounded-lg  m-[4px] ${isMenuOpen && "-rotate-45 translate-y-1"}`}
          ></span>
          <span
            className={`block w-[22px] h-[2px] ${
              theme === "light" ? "bg-black" : "bg-lightTheme-body"
            } rounded-lg m-[4px] ${isMenuOpen && "opacity-0"}`}
          ></span>
          <span
            className={`block w-[22px] h-[2px] ${
              theme === "light" ? "bg-black" : "bg-lightTheme-body"
            } rounded-lg  m-[4px] ${isMenuOpen && "rotate-45 -translate-y-1"}`}
          ></span>
        </div>
      </nav>
    </>
  );
};

export default Nav;
