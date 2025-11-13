import { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConversationContext } from "../components/ConversationContext";
import api from "../libs/api";
import axios from "axios";
import MobileChat from "../components/MobileChat";

const API = import.meta.env.VITE_REACT_API_URL;

const Message = () => {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const { selectedConversation, setSelectedConversation } =
    useContext(ConversationContext);

  const { id } = useParams();

  useEffect(() => {
    api
      .get(`/conversation/mobile/${id}`)
      .then((res) => {
        setConversation(res.data.conversation);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get(`/conversation/${id}`)
      .then((response) => {
        setLoading(false);

        setMessages(response.data.messages);
        //setRecieverMessages(response.data.receiverMessages);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    <>
      <MobileChat
        conversation={conversation}
        messages={messages}
        userId={user?._id}
      />
    </>
  );
};

export default Message;
