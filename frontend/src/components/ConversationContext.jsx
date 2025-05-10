import { createContext, useState } from "react";

const ConversationContext = createContext();

const ConversationProvider = ({ children }) => {
  const [selectedConversation, setSelectedConversation] = useState([]);

  return (
    <ConversationContext.Provider
      value={{ selectedConversation, setSelectedConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationContext, ConversationProvider };
