import React from "react";
import "./UserInfo.css";
import avatar from "../../../../assets/avatar.png";
import more from "../../../../assets/more.png";
import video from "../../../../assets/video.png";
import edit from "../../../../assets/edit.png";
import { useUserStore } from "../../../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || avatar} alt="User image" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src={more} alt="More incon" />
        <img src={video} alt="Video icon" />
        <img src={edit} alt=" Edit icon" />
      </div>
    </div>
  );
};

export default UserInfo;
