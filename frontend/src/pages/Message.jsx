import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Button from "../components/Button";
import axios from "axios";

const API = import.meta.env.VITE_REACT_API_URL;

const Message = () => {
  const token = localStorage.getItem("token");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const data = {
    text: text,
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${API}/${id}`, data, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" />
      </form>
    </>
  );
};

export default Message;
