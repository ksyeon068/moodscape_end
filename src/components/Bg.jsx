import { useContext } from "react";
import ApiContext from "../context/ApiContext";
import "../style/bg.scss";

function Bg() {

  const { weather } = useContext(ApiContext); // ⭐ weather 가져오기
  if (!weather) return null;

  const videoMap = {
    sunny: "/Project_Video/Sunny.mp4",
    cloudy: "/Project_Video/Cloud_4.mp4",
    rainy: "/Project_Video/Rainy.mp4",
    snowy: "/Project_Video/Snow.mp4",
    stormy: "/Project_Video/Thunder.mp4",
    misty: "/Project_Video/Fog2.mp4"
  };

  const videoSrc = videoMap[weather] || "/Project_Video/Sunny.mp4";

  return (
    <div className="bg-video">
      <video autoPlay loop muted playsInline key={videoSrc}>
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

export default Bg;