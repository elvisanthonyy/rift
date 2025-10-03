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
        className={`flex fixed top-0 left-0 w-full h-17 md:h-19 ${
          theme == "light"
            ? "bg-lightTheme-background text-lightTheme-text"
            : "bg-darkTheme-background text-darkTheme-text border-b-1 border-b-darkTheme-border"
        } shadow-sm items-center px-[4%] md:px-[5%] justify-between z-20`}
      >
        <div className="flex items-center mx-[4px] justify-center md:min-w-80 w-fit">
          <div className="flex md:min-w-35 w-fit h-full justify-start items-center">
            <div className="h-10 w-10 md:mr-2 rounded-[50%] flex items-center justify-center text-lg">
              <Link to="/profile">
                <VscAccount className="text-md md:text-4xl" />
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
        <div className="text-2xl text-red-700 md:mx-4 md:mr-10">
          {theme == "light" ? (
            <img className=" h-4 md:h-6" alt="rift" src={rift} />
          ) : (
            <img className="h-3 md:h-4" alt="rift" src={rift_dark} />
          )}
        </div>
        <div
          className={`flex text-[20px] md:text-[21px] h-full ${
            name == "Others" ? "w-[45%] md:w-[380px]" : "w-fit"
          } justify-between items-center`}
        >
          {name == "Others" ? (
            <>
              <div
                className={`flex cursor-pointer h-full w-20 items-center justify-center ${
                  checkFriend ? "text-red-500 " : ""
                }  hover:opacity-75  `}
                onClick={handleT}
              >
                <MdOutlinePermIdentity />
              </div>

              <div
                className={`flex cursor-pointer  h-full w-20 mt-[3px] items-center justify-center ${
                  checkMessage ? "text-red-500" : ""
                } hover:opacity-75 `}
                onClick={handle}
              >
                <MdMessage className="text-[18px] md:text-[19px]  " />
              </div>
            </>
          ) : (
            ""
          )}

          <Link to="/" className="h-full">
            <div
              className={`flex cursor-pointer h-full w-15 items-center justify-center  text-darktheme-text ${
                theme == "light"
                  ? "hover:bg-lightTheme-body/25"
                  : "hover:bg-darkTheme-body"
              }`}
            >
              <MdHome />
            </div>
          </Link>

          <div
            className={` ${
              isMenuOpen
                ? "fixed bg-black/50 w-[100%] h-[100dvh] top-0 right-0"
                : "hidden"
            } m:h-full md:flex md:justify-between items-center md:none absolute `}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className={` 
                
                   grid grid-rows-9 place-items-center gap-y-3 items-center justify-center gap-4  py-17 w-[60%] h-[100dvh] md:h-full md:w-20  top-0 right-0
                   "hidden"
               m:h-full md:flex md:justify-between md:static absolute ${
                 theme == "light"
                   ? "bg-lightTheme-body md:bg-none"
                   : "bg-darkTheme-body md:bg-none"
               } `}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-13 items-center justify-between text-[16px] flex bg-amber-200? "text-black" : "text-white"
          }`}
                onClick={handleThemeChange}
              >
                {theme == "light" ? <MdLightMode /> : <MdDarkMode />}
                <div className="text-[12px]">
                  {theme == "light" ? "Light" : "Dark"}
                </div>
              </div>
              <div
                className={`text-[16px] flex cursor-pointer h-full w-40 items-center justify-center ${
                  theme == "light"
                    ? "hover:bg-lightTheme-body/25"
                    : "hover:bg-darkTheme-body"
                } `}
                onClick={logOut}
              >
                <MdLogout />
                <div className="text-[10px] md:text-sm ml-3 text-red-500">
                  Log Out
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="block md:hidden h-fit w-fit mx-2 cursor-pointer"
          onClick={handleOpenMenu}
        >
          <span
            className={`block w-[18px] h-[1px] rounded-lg bg-white m-[4px] ${
              isMenuOpen && "-rotate-45 translate-y-1"
            }`}
          ></span>
          <span
            className={`block w-[18px] h-[1px] rounded-lg bg-white m-[4px] ${
              isMenuOpen && "opacity-0"
            }`}
          ></span>
          <span
            className={`block w-[18px] h-[1px] rounded-lg bg-white m-[4px] ${
              isMenuOpen && "rotate-45 -translate-y-1"
            }`}
          ></span>
        </div>
      </nav>
    </>
  );
};

export default Nav;
