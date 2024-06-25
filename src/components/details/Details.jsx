import React, { useEffect, useRef } from "react";
import "./Details.css";
import arrowUp from "../../assets/arrowUp.png";
import arrowDown from "../../assets/arrowDown.png";
import avatar from "../../assets/avatar.png";
import sampleImg from "../../assets/painting-mountain-lake-with-mountain-background_188544-9126.avif";
import download from "../../assets/download.png";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { toast } from "react-toastify";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const Details = () => {
  const { user, isUserBlocked, isCurrentUserBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleLogout = () => {
    auth.signOut();
  };

  const handleBlock = async () => {
    if (!user) return;

    const userRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userRef, {
        blocked: isUserBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="details">
      <div className="user">
        <img src={user?.avatar || avatar} alt="User image" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={arrowUp} alt="Up arrow" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={arrowUp} alt="Up arrow" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src={arrowUp} alt="Up arrow" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src={arrowDown} alt="Down arrow" />
          </div>
          <div className="photos">
            <div className="photo-item">
              <div className="photo-details">
                <img src={sampleImg} alt="Sample image" />
                <span>painting-mountain</span>
              </div>
              <img src={download} className="icon" alt="Download icon" />
            </div>

            <div className="photo-item">
              <div className="photo-details">
                <img src={sampleImg} alt="Sample image" />
                <span>painting-mountain</span>
              </div>
              <img src={download} className="icon" alt="Download icon" />
            </div>

            <div className="photo-item">
              <div className="photo-details">
                <img src={sampleImg} alt="Sample image" />
                <span>painting-mountain</span>
              </div>
              <img src={download} className="icon" alt="Download icon" />
            </div>

            <div className="photo-item">
              <div className="photo-details">
                <img src={sampleImg} alt="Sample image" />
                <span>painting-mountain</span>
              </div>
              <img src={download} className="icon" alt="Download icon" />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src={arrowUp} alt="Up arrow" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isUserBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button className="log-out-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Details;
