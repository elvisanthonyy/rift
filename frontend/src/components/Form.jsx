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

const Form = ({ route, method }) => {
  const name = method === "login" ? "Login" : "Register";
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    setLoading(true);
    e.preventDefault();
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
            setMessage(response.data.error);
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
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen justify-center  w-full ">
      <div className=" hidden lg:block w-[50%] h-screen">
        <img className=" object-cover h-full" src={back}></img>
      </div>
      <div className="flex  w-[100%] flex-col md:w-[50%] justify-center items-center ">
        <h1 className=" m-3 text-[18px] lg:mt-25">{name.toUpperCase()}</h1>
        <form
          autoComplete="off"
          className="flex min-h-90 h-fit w-[80%] md:w-110 lg:m-auto flex-col mt-4 border-1  border-lightTheme-border rounded-[7px] p-10 justify-evenly  items-center relative text-left bg-white"
        >
          <img src={rift} className="h-6 m-5" alt="rift" />

          {message == undefined ? (
            ""
          ) : (
            <div className="text-red-700 text-xl">{message}</div>
          )}
          {method == "register" ? (
            <div className="flex h-fit w-[95%]  lg:w-[85%] p-2 m-2 justify-between text-sm items-center text-left bg-white-400">
              <label className="text-gray-800">Username</label>
              <input
                type="email"
                className="border-1 px-2 py-[3px] w-[75%] rounded-[4px]  border-gray-400 focus:outline-none"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          ) : (
            ""
          )}

          <div className="flex h-fit  w-[95%]  lg:w-[85%] p-2 m-2 justify-between text-sm items-center text-left bg-white-400">
            <label className="text-gray-800">Email</label>
            <input
              className="border-1 px-2 py-[3px] w-[75%] rounded-[4px] border-gray-400 focus:outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex h-fit  w-[95%]  lg:w-[85%] p-2 m-2 justify-between text-sm items-center text-left bg-white-400">
            <label className="text-gray-800">Password</label>
            <input
              className="border-1 px-2 py-[3px] w-[75%] rounded-[4px] border-gray-400 focus:outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            handleEvents={handleLogin}
            name={loading ? <ButtonLoading /> : name}
          />
          <Link to={`/${name === "Register" ? "login" : "register"}`}>
            <div className="flex justify-center items-center before:bg-gray-400 before:h-[1px] before:w-[40%] before:m-3  before:content-[''] after:content-[''] after:h-[1px] after:w-[40%] after:m-3 after:bg-gray-400 w-80 ">
              {name === "Register" ? "login" : "register"}
            </div>
          </Link>
        </form>
      </div>
      <ToastContainer autoClose={1000} hideProgressBar={true} />
    </div>
  );
};

export default Form;
