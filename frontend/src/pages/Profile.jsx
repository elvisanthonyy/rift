import { useState, useEffect, useContext } from "react";
import Button from "../components/Button.jsx";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import UserPost from "../components/UserPost.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../contexts/ThemeContext";
import ButtonLoading from "../components/ButtonLoading";

const API = import.meta.env.REACT_API;

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [posts, setPosts] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState({
    fetchData: false,
    editProfile: false,
  });

  const option = {
    day: "2-digit",
    month: "long",
    year: "numeric",
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

  const editProfile = (e) => {
    setLoading((prevLoading) => ({ ...prevLoading, editProfile: true }));
    e.preventDefault();
    const data = {
      firstName,
      lastName,
      location,
      dateOfBirth,
    };

    api
      .put(`/profile/${id}`, data)
      .then((response) => {
        setLoading((prevLoading) => ({ ...prevLoading, editProfile: false }));
        if (response.data.status == "error") {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        }
      })
      .catch((error) => {
        setLoading((prevLoading) => ({ ...prevLoading, editProfile: false }));
        console.log(error);
      });
  };

  const getUserPosts = () => {
    setLoading((prevLoading) => ({ ...prevLoading, fetchData: true }));
    api
      .get("/post")
      .then((response) => {
        setPosts(response.data.posts);
        setLoading((prevLoading) => ({ ...prevLoading, fetchData: false }));
      })
      .catch((error) => {
        setLoading((prevLoading) => ({ ...prevLoading, fetchData: false }));
        console.log(error);
      });
  };

  const getProfile = () => {
    api
      .get("/user/profile")
      .then((response) => {
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setLocation(response.data.location);
        setUserId(response.data.userId);
        setId(response.data._id);
        setDateOfBirth(
          new Date(response.data.dateOfBirth).toISOString().split("T")[0]
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserPosts();
    getProfile();
  }, []);

  return (
    <>
      <div
        className={` min-h-screen ${
          theme == "light" ? "bg-lightTheme-body" : "bg-darkTheme-body"
        }`}
      >
        <Nav method="profile" />
        {loading.fetchData ? (
          <div
            className={`flex justify-center items-center h-screen ${
              theme == "light" ? "bg-lightTheme-body" : "bg-darkTheme-body"
            }`}
          >
            <Loading />
          </div>
        ) : (
          <div className="flex relative ">
            <form
              className={`flex justify-start text-sm pt-10 align-center flex-col w-[30%] h-[85%] p-10 rounded-sm top-22 left-[1%] mx-auto ${
                theme == "light"
                  ? "bg-lightTheme-background text-lightTheme-text"
                  : "bg-darkTheme-background text-darkTheme-text border-1 border-darkTheme-border"
              } fixed`}
              onSubmit={editProfile}
            >
              <h1 className=" w-[100%] pb-4 border-b-1 boder-gray-400 mx-auto mb-12 flex justify-center">
                EDIT PROFILE
              </h1>
              <label>first Name</label>
              <input
                className="border-b-1 border-b-gray-600 py-2 my-3 focus:outline-none "
                type="text"
                value={firstName !== undefined ? firstName : ""}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>Last Name</label>
              <input
                className=" border-b-1 border-b-gray-600 py-2 my-3 focus:outline-none "
                type="text"
                value={lastName !== undefined ? lastName : ""}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Location</label>
              <input
                className="border-b-1 border-b-gray-600 py-2 my-3 focus:outline-none "
                type="text"
                value={location !== undefined ? location : ""}
                onChange={(e) => setLocation(e.target.value)}
              />
              <label>Date of Birth</label>

              <input
                className="border-b-1 border-b-gray-600 py-2 my-3 focus:outline-none "
                type="date"
                //pattern="\d{2}/\d{1,2}/\{4}"
                value={dateOfBirth !== undefined ? dateOfBirth : ""}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              <button
                className=" text-white bg-red-600 h-10 mt-5 rounded-lg hover:opacity-70 hover:shadow-lg cursor-pointer "
                type="submit"
              >
                {" "}
                {loading.editProfile || userId == undefined ? (
                  <ButtonLoading />
                ) : (
                  "Edit"
                )}{" "}
              </button>
            </form>
            <div
              className={`w-[67%]  h-fit min-h-[85dvh] flex flex-col items-center ml-auto mt-22 mr-[1%] p-10 ${
                theme == "light"
                  ? "bg-lightTheme-background text-lightTheme-text"
                  : "bg-darkTheme-background text-darkTheme-text border-1 border-darkTheme-border"
              }`}
              //for displaying users post only
            >
              <h1 className="text-md mx-auto w-fit bd-gray-800">YOUR POSTS</h1>
              {loading.fetchData ? (
                //ensure post is not undefined to prevent erro
                <Loading />
              ) : posts.length == 0 ? (
                <div className="mt-auto mb-auto">No post yet</div>
              ) : (
                <div
                  className=""
                  //for each post
                >
                  {posts.map((post, index) => (
                    <div key={post._id}>
                      <UserPost
                        post={post}
                        getPost={getUserPosts}
                        userId={userId}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
        />
      </div>
    </>
  );
};

export default Profile;
