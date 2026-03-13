import { useRef } from 'react';
import { secondsToHMS } from '../utils/secondsToHMS';

function Timeline({ currentTime, duration, startTime, endTime, playerRef }) {
  const trackRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const loopStartPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const loopEndPercent = duration > 0 ? (endTime / duration) * 100 : 100;

  const handleSeek = (e) => {
    if (!trackRef.current || !playerRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = percent * duration;
    playerRef.current.seekTo(seekTime, true);
  };

  return (
    <div className="timeline-container">
      <div
        className="timeline-track"
        ref={trackRef}
        onClick={handleSeek}
      >
        <div
          className="timeline-loop-region"
          style={{
            left: `${loopStartPercent}%`,
            width: `${loopEndPercent - loopStartPercent}%`,
          }}
        />
        <div
          className="timeline-progress"
          style={{ width: `${progress}%` }}
        />
        <div
          className="timeline-marker"
          style={{ left: `${progress}%` }}
        />
      </div>
      <div className="timeline-time-display">
        <span>{secondsToHMS(currentTime)}</span>
        <span>{secondsToHMS(duration)}</span>
      </div>
    </div>
  );
}

export default Timeline;
