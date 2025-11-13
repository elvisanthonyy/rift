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
  const [otherUser, setOtherUser] = useState([]);
  const { selectedConversation, setSelectedConversation } =
    useContext(ConversationContext);

  const { id } = useParams();

  const getMessages = () => {
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
  };
  useEffect(() => {
    api
      .get(`/conversation/mobile/${id}`)
      .then((res) => {
        setConversation(res.data.conversation);
        setUser(res.data.user);
        //get other user to use for title
        setOtherUser(
          res.data.conversation.participants.filter(
            (part) => part.userId !== res.data.user._id
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });

    getMessages();
  }, []);

  return (
    <>
      <MobileChat
        conversation={conversation}
        messages={messages}
        userId={user?._id}
        otherUser={otherUser}
        getMessages={getMessages}
      />
    </>
  );
};

export default Message;
