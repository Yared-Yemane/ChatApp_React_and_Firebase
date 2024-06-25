import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import avatar from "../../assets/avatar.png";
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";
import emoji from "../../assets/emoji.png";
import EmojiPicker from "emoji-picker-react";
import messageImg from "../../assets/painting-mountain-lake-with-mountain-background_188544-9126.avif";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { toast } from "react-toastify";
import upload from "../../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const { chatId, user, isUserBlocked, isCurrentUserBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    let imgUrl = null;

    try {
      if (image.file) {
        imgUrl = await upload(image.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,

          createdAt: new Date(),
          ...(text && { text }),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          // console.log(userChatsData.chats[0]);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await setDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setImage({
      file: null,
      url: "",
    });
    setText("");
  };
  // console.log(chat.messages[0]);

  const handleImgInput = async (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || avatar} alt="User image" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit.</p>
          </div>
        </div>
        <div className="icons">
          <img src={phone} alt="Phone icon" />
          <img src={video} alt=" Video icon" />
          <img src={info} alt=" Info icon" />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => {
          return (
            message.text && (
              <div
                className={
                  message.senderId === currentUser.id
                    ? "message own"
                    : "message"
                }
                key={message.createdAt}
              >
                <div className="texts">
                  {message.img && <img src={message.img} alt="Message image" />}
                  <p>{message.text}</p>
                  <span>1 min ago</span>
                </div>
              </div>
            )
          );
        })}

        {image.url && (
          <div className="message own">
            {/* {message?.img && <img src={message.img} alt="Message image" />} */}
            <div className="texts">
              <img src={image.url} alt="Image chat" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="image">
            <img src={img} alt="Image icon" />
          </label>
          <input
            type="file"
            id="image"
            hidden={true}
            onChange={handleImgInput}
            disabled={isUserBlocked || isCurrentUserBlocked}
          />
          <img src={camera} alt="Camera icon" />
          <img src={mic} alt="Mic icon" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isUserBlocked || isCurrentUserBlocked
              ? "You can not send a message."
              : "Type a  message..."
          }
          disabled={isUserBlocked || isCurrentUserBlocked}
        />
        <div className="emoji">
          <img
            src={emoji}
            onClick={() => setOpen((prev) => !prev)}
            alt="Emoji"
          />

          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSendMessage}
          disabled={isUserBlocked || isCurrentUserBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
