import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../contexts/ThemeContext";

const API = import.meta.env.VITE_REACT_API_URL;

const EditModal = ({ post, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [success, setSuccess] = useState("");
  const [postEdit, setPostEdit] = useState([]);
  const [loading, setLoading] = useState(false);

  //send request for editing post

  const editPost = async () => {
    const token = localStorage.getItem("token");
    const data = {
      post: postEdit,
    };

    setLoading(true);
    axios
      .put(`${API}/post/${post._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setSuccess();
        //close modal after editing

        //toast after editing
        if (response.data.status !== "okay") {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    setPostEdit(post.post);
  }, []);

  return (
    <div
      className="h-full w-full flex justify-center items-center fixed top-0 left-0 bg-black/75 z-40"
      onClick={onClose}
    >
      <div
        className={` ${
          theme == "light"
            ? "bg-lightTheme-background text-lightTheme-text"
            : "bg-darkTheme-background text-darkTheme-text"
        } w-screen h-[80dvh] absolute -bottom-3 md:h-120 md:w-180 rounded-4xl md:rounded-xl flex flex-col justify-center items-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          value={postEdit !== null ? postEdit : ""}
          onChange={(e) => setPostEdit(e.target.value)}
          className="p-4 focus:outline-none h-[70%] md:h-70 w-[85%] md:w-140 border-lightTheme-border border-1 rounded-lg m-10"
        />

        <div className="flex w-[85%] md:w-[45%] justify-between items-center">
          <button
            className="w-30 md:w-20 h-8 border-1 border-red-500 text-red-500 m-1 cursor-pointer hover:opacity-50 rounded-xl"
            onClick={editPost}
          >
            Save
          </button>
          <button
            className="w-30 md:w-20 h-8 bg-red-500 m-1 cursor-pointer hover:opacity-50 rounded-xl"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditModal;
