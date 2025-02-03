// src/VideoPlayer.js
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';
function VideoPlayer (props) {
  const playerRef = useRef(null);
  const timestamps = [
    { label: 'Foul', time: '30' },
    { label: 'Kickoff', time: '60' },
  ];
  const videoUrl = "http://localhost:3013/video";
  // Helper function to convert "minutes:seconds" to total seconds
  const convertToSeconds = (time) => {
    const parts = time.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const handleTimestampClick = (time) => {
    const timeInSeconds = Math.floor(time / 1000);
    console.log("j", timeInSeconds);
    playerRef.current.seekTo(timeInSeconds , 'seconds'); 
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls
        />
      </div>
      <div className="info">
          <div className='titleList' >
              In this video
          </div>
          <ul className="timestamps-list">
              {props.list && props.list.map((timestamp, index) => {
                // Calculate minutes and seconds
                const minutes = Math.floor(timestamp.timeInMilliSeconds / 60000); // 1 minute = 60000 milliseconds
                const seconds = ('0' + Math.floor((timestamp.timeInMilliSeconds % 60000) / 1000)).slice(-2); // 1 second = 1000 milliseconds

                return (
                  <li key={index} className="timestamp-item" onClick={() => handleTimestampClick(timestamp.timeInMilliSeconds)}>
                    <span className="timestamp-time">{`${minutes}:${seconds}`}</span>
                    <span className="timestamp-team">Team {timestamp.team}</span>
                    <span className="timestamp-label">{timestamp.label}</span>
                  </li>
                );
              })}
        </ul>

      </div>
    </div>
  );
};

export default VideoPlayer;
