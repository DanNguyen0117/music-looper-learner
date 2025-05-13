export function secondsToHMS(seconds) {
	seconds = Number(seconds);
	const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null;
	const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);

	// Format the result
	const formattedTime =
		(hours ? hours + ':' : '') + (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

	return formattedTime;
}

export function HMSToSeconds(hour, min, sec) {
	return hour * 3600 + min * 60 + sec;
}

export function secondsToHMSTuple(seconds) {
	seconds = Number(seconds);
	const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null;
	const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);

	return {
		hours: hours,
		minutes: minutes,
		seconds: remainingSeconds,
	};
}
