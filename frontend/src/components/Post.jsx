import { useState, useEffect, useContext } from "react";
import { MdFavorite } from "react-icons/md";
import { MdThumbUp } from "react-icons/md";
import axios from "axios";
import { ThemeContext } from "../contexts/ThemeContext";

const API = import.meta.env.VITE_REACT_API_URL;

const Post = ({ post, like, userId }) => {
  const { theme } = useContext(ThemeContext);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
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
      .post(`${API}/post/${post._id}`, null, {
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
      className={`flex relative  flex-shrink-0 flex-col w-full min-h-90 h-fit md:min-h-80  md:border-1 ml-auto mr-auto text-md nx:rounded-2xl mb-10 mt-5 items-center justify-between ${
        theme == "light"
          ? " text-lightTheme-text border-0 border-lightTheme-border bg-lightTheme-body"
          : " text-darkTheme-text border-0 border-darkTheme-border bg-darkTheme-body"
      } `}
    >
      <div
        className={`px-6 h-13 flex  ${
          theme === "light"
            ? "border-lightTheme-border"
            : "border-darkTheme-border"
        } items-center w-full mr-auto border-b-1`}
      >
        {`Author - ${post.author.authorName}`}
      </div>
      <div
        className={`flex w-[400px] border-0 min-h-50 h-fit p-10 items-center text-wrap text-center md:m-10  justify-center px-10 break-words`}
      >
        {post.post}
      </div>
      <div
        className={`flex h-13  ${
          theme === "light"
            ? "border-lightTheme-border"
            : "border-darkTheme-border"
        } w-full justify-between border-t-1 items-center px-5`}
      >
        <div className="flex items-center justify-center">
          <button
            onClick={sendLike}
            className="w-10 h-7 rounded-2xl text-xl text-white flex justify-center items-center mr-1"
          >
            <MdFavorite
              className={`${liked ? "text-red-500" : "text-gray-500"}`}
            />
          </button>
          <p>{likeCount}</p>
        </div>
        <div className="text-[10px]">
          {new Date(post.createdAt).toLocaleTimeString("en-Us", option)}
        </div>
      </div>
    </div>
  );
};

export default Post;
