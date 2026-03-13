import { useRef, useState, useEffect } from 'react';
import { secondsToHMS } from '../utils/secondsToHMS';

function Timeline({ duration, currentTime, startTime, endTime, onLoopStartChange, onLoopEndChange, onSeek }) {
	const trackRef = useRef(null);
	const isDragging = useRef(false);
	const didDrag = useRef(false);
	const [activeHandle, setActiveHandle] = useState(null);

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
	const loopStartPercent = duration > 0 ? (startTime / duration) * 100 : 0;
	const loopEndPercent = duration > 0 ? (endTime / duration) * 100 : 100;

	const handlePointerDown = (e, handle) => {
		e.preventDefault();
		e.stopPropagation();
		isDragging.current = true;
		didDrag.current = false;
		setActiveHandle(handle);
	};

	useEffect(() => {
		if (!activeHandle) return;

		const handlePointerMove = (e) => {
			if (!trackRef.current) return;

			didDrag.current = activeHandle;

			const rect = trackRef.current.getBoundingClientRect();
			const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
			const timestamp = percent * duration;

			if (activeHandle === 'start') {
				const clamped = Math.max(0, Math.min(endTime - 0.1, timestamp));
				onLoopStartChange(clamped);
			} else if (activeHandle === 'end') {
				const clamped = Math.max(startTime + 0.1, Math.min(duration, timestamp));
				onLoopEndChange(clamped);
			}
		};

		const handlePointerUp = () => {
			isDragging.current = false;
			setActiveHandle(null);
			console.log('handlepointerup');
		};

		const handlePointerCancel = () => {
			isDragging.current = false;
			setActiveHandle(null);
		};

		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);
		document.addEventListener('pointercancel', handlePointerCancel);

		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
			document.removeEventListener('pointercancel', handlePointerCancel);
		};
	}, [activeHandle, duration, startTime, endTime, onLoopStartChange, onLoopEndChange]);

	const handleSeek = (e) => {
		if (isDragging.current) return;
    if (didDrag.current === 'end') {
      didDrag.current = null;
      return;
    }
    didDrag.current = null;
		if (!trackRef.current) return;
		const rect = trackRef.current.getBoundingClientRect();
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const seekTime = percent * duration;
		onSeek(seekTime);
	};

	return (
		<div className="timeline-container">
			<div ref={trackRef} className="timeline-track" onClick={handleSeek}>
				<div
					className="timeline-loop-region"
					style={{
						left: `${loopStartPercent}%`,
						width: `${loopEndPercent - loopStartPercent}%`,
					}}
				/>
				<div className="timeline-progress" style={{ width: `${progress}%` }} />
				<div className="timeline-marker" style={{ left: `${progress}%` }} />
				<div
					className="timeline-playhead timeline-handle-start"
					style={{ left: `${loopStartPercent}%` }}
					onPointerDown={(e) => handlePointerDown(e, 'start')}
				/>
				<div
					className="timeline-playhead timeline-handle-end"
					style={{ left: `${loopEndPercent}%` }}
					onPointerDown={(e) => handlePointerDown(e, 'end')}
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
