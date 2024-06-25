import React, { useEffect, useState } from "react";
import "./ChatList.css";
import search from "../../../../assets/search.png";
import plus from "../../../../assets/plus.png";
import minus from "../../../../assets/minus.png";
import avatar from "../../../../assets/avatar.png";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useChatStore } from "../../../../lib/chatStore";
import { toast } from "react-toastify";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const [input, setInput] = useState("");
  // const { chats } = useChatStore();

  // console.log(chatId);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleClick = async (chat) => {
    // console.log(chat.chatId);

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    try {
      await updateDoc(doc(db, "userChats", currentUser.id), {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      {addMode && <AddUser />}
      <div className="search">
        <div className="search-bar">
          <img src={search} alt="Search icon" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="add">
          <img
            src={addMode ? minus : plus}
            alt="Plus icon"
            onClick={() => setAddMode((prev) => !prev)}
          />
        </div>
      </div>

      {filteredChats?.map((chat) => {
        return (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleClick(chat)}
            style={{
              backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
            }}
          >
            {chat.isSeen}
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? avatar
                  : chat.user.avatar || avatar
              }
              alt="User image"
            />
            <div className="texts">
              <span>
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
