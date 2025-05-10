import { useState, useEffect, useContext } from "react";
import { MdFavorite } from "react-icons/md";
import { MdThumbUp } from "react-icons/md";
import axios from "axios";
import { ThemeContext } from "../contexts/ThemeContext";

const Post = ({ post, like, userId }) => {
  const { theme } = useContext(ThemeContext);
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
      className={`flex flex-shrink-0 flex-col w-[90%] min-h-80 h-fit border-1 ml-auto mr-auto text-md rounded-lg m-10 items-center justify-center ${
        theme == "light"
          ? " text-lightTheme-text border-lightTheme-border"
          : " text-darkTheme-text border-1 border-darkTheme-border"
      } `}
    >
      <div className="relative mr-auto left-6 mt-5">
        {post.author.authorName}
      </div>
      <div className="flex w-[400px] min-h-60 h-fit p-10 items-center text-wrap text-center m-10  justify-center px-10 break-words">
        {post.post}
      </div>
      <div className="flex h-17 w-full justify-between items-center px-5">
        <div className="flex items-center justify-center">
          <button
            onClick={sendLike}
            className="w-15 h-7 rounded-2xl text-xl text-white flex justify-center items-center mr-1"
          >
            <MdThumbUp
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
