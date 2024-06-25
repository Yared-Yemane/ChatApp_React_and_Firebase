import React from "react";
import UserInfo from "./components/userInfo/UserInfo";
import ChatList from "./components/chatList/ChatList";
import "./List.css";

const List = () => {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
