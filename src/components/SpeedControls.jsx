import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from 'react';


function SpeedControls({ playerRef }) {
	const [activeButtonId, setActiveButtonId] = useState(4);

	const buttons = [
		{ id: 1, label: '0.25' },
		{ id: 2, label: '0.5' },
		{ id: 3, label: '0.75' },
		{ id: 4, label: '1' },
		{ id: 5, label: '1.25' },
		{ id: 6, label: '1.5' },
		{ id: 7, label: '1.75' },
		{ id: 8, label: '2' },
	];

	const handleClick = ({ id, label }) => {
		setActiveButtonId(id);
		playerRef.current?.setPlaybackRate(Number(label));
	};

	return (
		<>
			<div className="mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
				Playback Speed
			</div>
			<ButtonGroup>
				{buttons.map((button) => (
					<Button key={button.id} variant={activeButtonId === button.id ? 'dark' : 'secondary'} onClick={() => handleClick(button)}>
						{button.label}
					</Button>
				))}
			</ButtonGroup>

		</>
	);
}

export default SpeedControls;
