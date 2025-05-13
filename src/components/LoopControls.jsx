import { useState, useEffect } from 'react';
import { Col, Container, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { secondsToHMS, secondsToHMSTuple, HMSToSeconds } from '../utils/secondsToHMS';

export default function LoopControls({ startTime, setStartTime, currentTime, playerRef, toggleLoop, setToggleLoop }) {
	const [startMinutes, setStartMinutes] = new useState(0);
	const [startSeconds, setStartSeconds] = new useState(0);
	const [endMinutes, setEndMinutes] = new useState(0);
	const [endSeconds, setEndSeconds] = new useState(0);
	const [isLoopedOnce, setIsLoopedOnce] = new useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
			const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
			if (toggleLoop && playerRef.current && startLoopTime <= endLoopTime && playerRef.current.getCurrentTime() >= endLoopTime) {
				console.log('looping');
				playerRef.current.seekTo(startLoopTime, true);
				playerRef.current.playVideo();
			}

			if (isLoopedOnce && playerRef.current.getCurrentTime() >= endLoopTime) {
				console.log('it is pausing');
				playerRef.current.pauseVideo();
				setIsLoopedOnce(false);
			}
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [startMinutes, startSeconds, endMinutes, endSeconds, toggleLoop, isLoopedOnce]);

	const handleStartSetTime = () => {
		const t = secondsToHMSTuple(currentTime);

		if (!isNaN(t.hours)) {
			console.log('we have hours');
		}

		setStartMinutes(t.minutes);
		setStartSeconds(t.seconds);
	};

	const handleEndSetTime = () => {
		const t = secondsToHMSTuple(currentTime);

		if (!isNaN(t.hours)) {
			console.log('we have hours');
		}

		setEndMinutes(t.minutes);
		setEndSeconds(t.seconds);
	};

	const handleStartMinutes = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setStartMinutes(e.target.value);
			// TODO ARBITRARY experimental
			setEndMinutes(e.target.value);
		}
	};
	const handleStartSeconds = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setStartSeconds(e.target.value);
			// TODO ARBITRARY experimental
			// if (startMinutes >= endMinutes) {
			// 	setEndSeconds(e.target.value);
			// }
		}
	};

	const handleEndMinutes = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setEndMinutes(e.target.value);
		}
	};
	const handleEndSeconds = (e) => {
		if (!isNaN(e.target.value) && String(e.target.value).length <= 2 && e.target.value < 60) {
			setEndSeconds(e.target.value);
		}
	};

	const handleToggleLoop = () => {
        const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
        const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
        if (playerRef.current && startLoopTime <= endLoopTime) {
		    setToggleLoop((prev) => !prev);
            playerRef.current.seekTo(startLoopTime, true);
            playerRef.current.playVideo();
        }
	};

	const handleIsLoopedOnce = () => {
        if (isLoopedOnce) {
            setIsLoopedOnce(prev => !prev)
        } else {
            const startLoopTime = HMSToSeconds(0, startMinutes, startSeconds);
            const endLoopTime = HMSToSeconds(0, endMinutes, endSeconds);
            console.log(startLoopTime, endLoopTime)
            if (playerRef.current && startLoopTime <= endLoopTime) {
                setIsLoopedOnce(true);
                playerRef.current.seekTo(startLoopTime, true);
                playerRef.current.playVideo();
            }
        }
	};

	return (
		<>
			<Row className="mb-4">
				<Col>
					<div>
						<div className="mb-2">Loop Start</div>
						<div className="mb-3 d-flex align-items-center justify-content-center gap-1">
							<div>
								<Form.Control
									type="text"
									value={startMinutes}
									onChange={handleStartMinutes}
									style={{ width: '45px', textAlign: 'right' }}
								/>
								<div className="help-text">min</div>
							</div>
							<div className="mb-4">:</div>
							<div>
								<Form.Control
									type="text"
									value={startSeconds}
									onChange={handleStartSeconds}
									style={{ width: '45px', textAlign: 'right' }}
								/>
								<div className="help-text">sec</div>
							</div>
						</div>

						<Button variant="success" onClick={handleStartSetTime}>
							{secondsToHMS(currentTime)}
						</Button>
						<div className="help-text">Set Time</div>
					</div>
				</Col>
				<Col>
					<div className="d-flex flex-column">
						<Button
							className="mt-3 mb-3"
							variant={toggleLoop ? 'danger' : 'primary'}
							onClick={handleToggleLoop}
							disabled={isLoopedOnce}
						>
							{toggleLoop ? 'Stop Loop' : 'Start Loop'}
						</Button>
						<Button
							className="mb-3"
							variant={'success'}
							onClick={handleIsLoopedOnce}
							disabled={toggleLoop}
						>
							{isLoopedOnce ? 'Stop Loop' : 'Loop Once'}
						</Button>
					</div>
				</Col>
				<Col>
					<div>
						<div className="mb-2">Loop End</div>
						<div className="mb-3 d-flex align-items-center justify-content-center gap-1">
							<div>
								<Form.Control type="text" value={endMinutes} onChange={handleEndMinutes} style={{ width: '45px', textAlign: 'right' }} />
								<div className="help-text">min</div>
							</div>
							<div className="mb-4">:</div>
							<div>
								<Form.Control type="text" value={endSeconds} onChange={handleEndSeconds} style={{ width: '45px', textAlign: 'right' }} />
								<div className="help-text">sec</div>
							</div>
						</div>

						<Button variant="success" onClick={handleEndSetTime}>
							{secondsToHMS(currentTime)}
						</Button>
						<div className="help-text">Set Time</div>
					</div>
				</Col>
			</Row>
		</>
	);
}
