export default function secondsToHMS(seconds) {
    seconds = Number(seconds)
    const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
    const minutes = hours ? Math.floor((seconds % 3600) / 60) : Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
  
    // Format the result
    const formattedTime = (hours ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds
  
    return formattedTime
  }