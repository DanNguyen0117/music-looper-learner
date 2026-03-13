import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { secondsToHMSTuple, HMSToSeconds, roundToNearest05 } from '../utils/secondsToHMS';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TooltipButton from './TooltipButton';
import './LoopControls.css';

function ShiftLoopControls({
	startMinutes,
	startSeconds,
	setStartMinutes,
	setStartSeconds,
	endMinutes,
	endSeconds,
	setEndMinutes,
	setEndSeconds,
	endTime,
}) {
	const getLoopTimes = () => {
		const startTotal = HMSToSeconds(0, startMinutes, startSeconds);
		const endTotal = HMSToSeconds(0, endMinutes, endSeconds);
		const loopTime = endTotal - startTotal;
		return { startTotal, endTotal, loopTime };
	};

	const setStartTime = (totalSeconds) => {
		const { minutes, seconds } = secondsToHMSTuple(totalSeconds);
		setStartMinutes(minutes);
		setStartSeconds(seconds);
	};

	const setEndTime = (totalSeconds) => {
		const { minutes, seconds } = secondsToHMSTuple(totalSeconds);
		setEndMinutes(minutes);
		setEndSeconds(seconds);
	};

	const handleLeftShiftLoop = () => {
		const { startTotal, endTotal, loopTime } = getLoopTimes();
		const shiftedStartSec = startTotal - loopTime;
		const shiftedEndSec = endTotal - loopTime;

		if (shiftedStartSec < 0 || shiftedEndSec < 0) {
			console.log('cannot shift loop left, loop is as far left as it can be.');
			return;
		}

		setStartTime(shiftedStartSec);
		setEndTime(shiftedEndSec);
	};

	const handleRightShiftLoop = () => {
		const { startTotal, endTotal, loopTime } = getLoopTimes();
		const shiftedStartSec = startTotal + loopTime;
		const shiftedEndSec = endTotal + loopTime;

		if (shiftedStartSec > endTime || shiftedEndSec > endTime) {
			console.log('cannot shift loop right, loop is as far right as it can be.');
			return;
		}

		setStartTime(shiftedStartSec);
		setEndTime(shiftedEndSec);
	};

	const handleHalfStart = () => {
		const { startTotal, endTotal, loopTime } = getLoopTimes();

		if (loopTime <= 0.05) {
			console.log('cannot half the loop, loop is as small as it gets!');
			return;
		}

		const halfLoop = roundToNearest05(loopTime) / 2;
		let shiftedStartSec = startTotal + halfLoop;

		if (endTotal - startTotal < 0.1) {
			shiftedStartSec = endTotal - 0.05;
		}

		setStartTime(shiftedStartSec);
	};

	const handleDoubleStart = () => {
		const { startTotal, loopTime } = getLoopTimes();

		const doubleLoop = roundToNearest05(loopTime) * 2;
		const shiftedStartSec = startTotal - doubleLoop;

		if (shiftedStartSec < 0) {
			console.log('cannot double the loop start side any further');
			return;
		}

		setStartTime(shiftedStartSec);
	};

	const handleHalfEnd = () => {
		const { startTotal, endTotal, loopTime } = getLoopTimes();

		if (loopTime <= 0.05) {
			console.log('cannot half the loop, loop is as small as it gets!');
			return;
		}

		const halfLoop = roundToNearest05(loopTime) / 2;
		let shiftedEndSec = endTotal - halfLoop;

		if (endTotal - startTotal < 0.1) {
			shiftedEndSec = startTotal + 0.05;
		}

		setEndTime(shiftedEndSec);
	};

	const handleDoubleEnd = () => {
		const { startTotal, loopTime } = getLoopTimes();

		const doubleLoop = roundToNearest05(loopTime) * 2;
		const shiftedEndSec = startTotal + doubleLoop;

		if (shiftedEndSec > endTime) {
			console.log('cannot double the loop length any further');
			return;
		}

		setEndTime(shiftedEndSec);
	};

	const LoopButton = ({ onClick, icon, label, title }) => (
		<div className="ms-2">
			<TooltipButton onClick={onClick} tooltip={title}>
				<FontAwesomeIcon icon={icon} />
			</TooltipButton>
			<div className="help-text">{label}</div>
		</div>
	);

	const LoopLabelButton = ({ onClick, label, sublabel, title }) => (
		<div className="ms-2">
			<TooltipButton onClick={onClick} tooltip={title}>
				{label}
			</TooltipButton>
			<div className="help-text">{sublabel}</div>
		</div>
	);

	return (
		<>
			<Container className="mb-3 d-flex flex-wrap justify-content-center">
				<LoopLabelButton onClick={handleDoubleStart} label="2x" sublabel="Start" title="Double loop length from start" />
				<LoopLabelButton onClick={handleHalfStart} label="1/2x" sublabel="Start" title="Half loop length from start" />
				<div className='ms-4'></div>
				<LoopButton onClick={handleLeftShiftLoop} icon={faLeftLong} label="Left" title="Shift loop left" />
				<LoopButton onClick={handleRightShiftLoop} icon={faRightLong} label="Right" title="Shift loop right" />
				<div className='ms-4'></div>
				<LoopLabelButton onClick={handleHalfEnd} label="1/2x" sublabel="End" title="Half loop length from end" />
				<LoopLabelButton onClick={handleDoubleEnd} label="2x" sublabel="End" title="Double loop length from end" />
			</Container>
		</>
	);
}

export default ShiftLoopControls;
