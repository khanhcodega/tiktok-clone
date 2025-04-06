import React from 'react';

function VideoControls({ playing, setPlaying, videoRef }) {
  const [volume, setVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(false);

  const togglePlayPause = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
    videoRef.current.muted = !muted;
  };

  return (
    <div className="video-controls">
      <button onClick={togglePlayPause}>
        {/* {playing ? <FaPause /> : <FaPlay />} */}
      </button>
      <div className="volume-control">
        <button onClick={toggleMute}>
          {/* {muted ? <FaVolumeMute /> : <FaVolumeUp />} */}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}

export default VideoControls;