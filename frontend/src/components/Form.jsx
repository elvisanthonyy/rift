import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Button from "./Button";
import ButtonLoading from "./ButtonLoading";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import back from "../assets/log_image.jpg";
import rift from "../assets/rift.svg";
import { FaRegEnvelope } from "react-icons/fa";
import { BsPerson } from "react-icons/bs";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Form = ({ route, method }) => {
  const name = method === "login" ? "Login" : "Register";
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (method === "login") {
      if (password.length < 1 || email.length < 1)
        return setMessage("send all fields");
    } else {
      if (username.length < 1 || password.length < 1 || email.length < 1)
        return setMessage("send all fields");
    }

    setLoading(true);

    const data = {
      username,
      email,
      password,
    };

    axios
      .post(route, data)
      .then((response) => {
        const dataRes = response.data;

        if (method === "login") {
          if (dataRes.user) {
            localStorage.setItem("token", dataRes.user);
            toast.success(response.data.message);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            setMessage(response.data.message);
          }
        } else {
          if (response.data.status === "error") {
            setMessage(response.data.error);
          } else {
            navigate("/login");
          }
        }
        setLoading(false);
      })

      .catch((error) => {
        if (error.message === "Network Error") {
          toast.error("something went wrong");
        } else {
          setMessage(error.response.data.message);
        }
        setLoading(false);
      });
  };

  return (
    <div className="flex md:flex-row flex-col items-center h-screen justify-start w-full ">
      <div className=" hidden lg:block w-[50%] h-screen">
        <img className=" object-cover h-full" src={back}></img>
      </div>

      <div className="relative nx:justify-center top-0 flex w-full h-[100dvh] md:h-[60dvh] bg-amber md:w-full flex-col lg:w-[50%] justify-center items-center ">
        <div className="flex justify-center border-darkTheme-border items-center w-25 h-20 border-1 rounded-2xl">
          <img src={rift} className="h-6 m-5 md:h-6 md:m-5" alt="rift" />
        </div>
        <form
          autoComplete="off"
          className={`flex px-5 justify-start mt-10 nx:mt-0 ${
            name === "Register" ? "h-[50dvh]" : "h-[45dvh]"
          }  shrink-0 border-darkTheme-background nx:h-80 md:min-h-90 nx:y-10 nx:justify-center  nx:w-100 w-full border-0 md:w-110 lg:m-auto flex-col  rounded-[7px] p-3 md:p-10 md:justify-evenly  items-center relative text-left `}
        >
          {message == undefined ? (
            ""
          ) : (
            <div className="text-red-700 text-sm md:text-xl">{message}</div>
          )}
          {method == "register" ? (
            <div className="relative flex h-fit w-full  lg:w-full py-2 justify-between text-sm items-center text-left bg-white-400">
              <BsPerson className="absolute left-3 text-lg text-darkTheme-border" />
              <input
                type="text"
                className="text-[14px] md:text-[16px] border-1 h-12 px-10 py-[3px] w-[100%] rounded-xl  border-gray-400 focus:outline-0 focus:border-darkTheme-body"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setMessage("");
                }}
                required
              />
            </div>
          ) : (
            ""
          )}

          <div className="relative flex h-fit w-full lg:w-full py-2 justify-between text-sm items-center text-left bg-white-400">
            <FaRegEnvelope className="absolute left-3 text-[16px] text-darkTheme-border" />
            <input
              className="text-[14px] px-10 md:text-[16px] h-12 rounded-xl bg-white text  py-[3px] w-[100%] border-1  border-gray-400 focus:outline-0 focus:border-darkTheme-body"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              required
            />
          </div>

          <div className="relative flex h-fit  w-full  lg:w-full py-2 justify-between text-sm items-center text-left bg-white-400 ">
            <HiOutlineLockClosed className="absolute left-3 text-lg text-darkTheme-border" />

            <input
              className="text-[14px] md:text-[16px]-md h-12 border-1 px-10 py-[3px] w-[100%] rounded-xl border-gray-400 focus:outline-0 focus:border-darkTheme-body"
              placeholder="Password"
              type={`${seePassword ? "text" : "password"}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              required
            />
            <div
              onClick={() =>
                seePassword ? setSeePassword(false) : setSeePassword(true)
              }
              className="absolute right-3 h-full flex items-center cursor-pointer"
            >
              {seePassword ? (
                <FaEyeSlash className="absolute right-3 text-lg text-darkTheme-border" />
              ) : (
                <FaEye className="absolute right-3 text-lg text-darkTheme-border" />
              )}
            </div>
          </div>

          <Button
            handleEvents={handleLogin}
            name={loading ? <ButtonLoading /> : name}
          />
          <div>Don't have an account?</div>
        </form>
        <div className="flex w-full -auto items-center absolute nx:sticky nx:w-100 nx:px-4 md:px-9 md:w-110 left-0 bottom-15 px-4">
          <Link
            className="flex w-full justify-center"
            to={`/${name === "Register" ? "login" : "register"}`}
          >
            <button className="flex justify-center items-center h-12 rounded-4xl w-full border-1 cursor-pointer">
              {name === "Register" ? "Login" : "Create a new account"}
            </button>
          </Link>
        </div>
      </div>
      <ToastContainer autoClose={1000} hideProgressBar={true} />
    </div>
  );
};

export default Form;
