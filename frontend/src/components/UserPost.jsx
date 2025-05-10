import { useContext, useState } from "react";
import { MdFavorite } from "react-icons/md";
import { MdThumbUp } from "react-icons/md";
import { MdDelete, MdEdit } from "react-icons/md";
import Modal from "./Modal";
import EditModal from "./EditModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../contexts/ThemeContext";

const UserPost = ({ post, getPost, userId }) => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState("");

  const option = {
    hour: "2-digit",
    minute: "2-digit",
  };
  //handle liking
  const sendLike = (id) => {
    //handle ssetting like when click
    liked ? setLiked(false) : setLiked(true);

    //handle settinh count when liked
    liked ? setLikeCount(likeCount - 1) : setLikeCount(likeCount + 1);
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:3000/post/${post._id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  //for editing modal
  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  //for closing editmodal
  const closeEditModal = () => {
    setShowEditModal(false);
  };
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:3000/post/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowModal(false);
        toast.success(response.data.message);
        setTimeout(() => {
          //refresh and get post after deleting
          getPost();
        }, 4000);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useState(() => {
    setLikeCount(post.likes.length);

    if (post.likes.map((like) => like).includes(userId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  return (
    <div
      className={`flex flex-col text-sm lg:w-[700px] min-h-80 h-fit border-1 m-10 rounded-lg relative items-center justify-center border-gray-400 md:w-[600px] ${
        theme == "light"
          ? " text-lightTheme-text border-lightTheme-border"
          : " text-darkTheme-text border-1 border-darkTheme-border"
      }`}
    >
      <div className=" mr-auto ml-6 mt-5">You</div>
      <div className="flex justify-center items-center absolute top-6 right-6">
        <button
          className={`flex justify-center items-center w-8 h-8 rounded-md ${
            theme == "light"
              ? "border-lightTheme-text text-lightTheme-text"
              : "border-darkTheme-text text-darkTheme-text"
          } border-1 hover:opacity-70 cursor-pointer mr-4`}
          onClick={handleShowEditModal}
        >
          <MdEdit className=" " />
        </button>
        <button
          className="flex justify-center items-center w-8 h-8 rounded-md border-red-700 border-1 text-white hover:opacity-70 cursor-pointer"
          onClick={handleShowModal}
        >
          <MdDelete className="text-red-500 text-1xl" />
        </button>
      </div>
      <div className="flex w-[400px] min-h-60 h-fit p-10 items-center text-wrap text-center m-10  justify-center px-10 break-words">
        {post.post}
      </div>
      <div className="flex h-17 w-full justify-between items-center px-5">
        <div className="flex items-center">
          <button
            onClick={sendLike}
            className="w-15 h-7 rounded-2xl text-2xl text-white flex justify-center items-center"
          >
            <MdThumbUp
              className={`${liked ? "text-red-500" : "text-gray-500"}`}
            />
          </button>
          <div>{likeCount}</div>
        </div>
        <div className="text-sm ">
          {new Date(post.createdAt).toLocaleTimeString("en-US", option)}
        </div>
      </div>
      {showModal && (
        <Modal handleNo={closeModal} handleYes={() => handleDelete(post._id)} />
      )}
      {showEditModal && <EditModal onClose={closeEditModal} post={post} />}
      <ToastContainer />
    </div>
  );
};

export default UserPost;
