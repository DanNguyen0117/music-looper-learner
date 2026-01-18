export function secondsToHMS(seconds) {
	seconds = Number(seconds);
	const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null;
	const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	// Format the result
	const formattedTime =
		(hours ? hours + ':' : '') + (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

	return formattedTime;
}

export function HMSToSeconds(hour, min, sec) {
	return Number(hour) * 3600 + Number(min) * 60 + Number(sec);
}

export function secondsToHMSTuple(seconds) {
	seconds = Number(seconds);
	const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null;
	const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;		// TODO change to floor?

	return {
		hours: hours,
		minutes: minutes,
		seconds: remainingSeconds,
	};
}

export function roundToNearest05(n) {
	return Math.round(n / 0.05) * 0.05;
}
