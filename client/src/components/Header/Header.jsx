import React, { useEffect, useRef } from "react";
import "./Header.css";

const Header = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.currentTime = 6.7; // Set the start time to 6.5 seconds

    const handleTimeUpdate = () => {
      if (video.currentTime >= 54.5) {
        video.pause(); // Pause the video at 54.5 seconds
        video.currentTime = 6.7; // Reset to start time
        video.play(); // Restart the video from 6.5 seconds
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className="header">
      <video className="header-video" autoPlay muted loop ref={videoRef}>
        <source src="/videoplayback.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="header-contents">
        <h2>Swad Bhari Seva, Turant Aapke Darwaze Par!</h2>
        <p>
          Craving a hearty meal? Zaikaa delivers your favorite local dishes hot
          and fresh, straight to your door. Experience the perfect blend of
          taste and convenience with our rapid delivery service. Indulge in
          deliciousness—order with Zaikaa today!
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
