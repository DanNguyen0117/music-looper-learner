import {useState} from 'react'
import Youtube, {YouTubeProps} from 'react-youtube'
import './Video.css'

export default function Video() {
    const [videoURL, setVideoURL] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [videoCode, setVideoCode] = useState('')
    const [startTime, setStartTime] = useState('0')
    const [endTime, setEndTime] = useState('')

    const handleVideoTimes = (e) => {
        const duration = e.target.getDuration()
    }
    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoURL(e.target.value)
        setErrorMessage('')
    }

    const handleYoutubeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/
        if (youtubeRegex.test(videoURL)) {
            let code = videoURL.split("v=")[1].split("&")[0];      
            setVideoCode(code)
            setErrorMessage('')
        } else {
            setErrorMessage('Invalid Youtube URL')
        }
    }

    const onPlayerReady: YouTubeProps['onReady'] = (e) => {
        // access to player in all event handlers via event.target
        e.target.pauseVideo()
        const duration = e.target.getDuration()
        setStartTime('0')
        setEndTime(duration.toString())
    }
    
    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    return(
        <div className='wrapper'>
            <h1 className='form-group title' style={{marginBottom: '20px'}}>Music Looper Learner</h1>
            <form className='form-group form' onSubmit={handleYoutubeSubmit}>
                <input 
                    className='form-control'
                    type='text'
                    style={{marginRight: '10px'}}
                    value={videoURL} 
                    placeholder='Enter YouTube URL' 
                    onChange={e => handleURLChange(e)} 
                />
                <button type='submit' className='btn btn-success btn-md'>
                    Upload
                </button>
            </form>
            {errorMessage && <div className='error-msg'>{errorMessage}</div>}
            <br></br>
            <div>
                {videoCode ? <Youtube 
                                style={{marginBottom: '10px'}} 
                                videoId={videoCode} 
                                opts={opts} 
                                onReady={onPlayerReady} 
                                onStateChange={handleVideoTimes}
                                />
                           : <div>Video will appear once URL is uploaded</div>}
            </div>
            <div className='loop-slider-container'>
                <div className='slide-track'></div>
                <input type='range' min={startTime} max={endTime} defaultValue={startTime} />
                <input type='range' min={startTime} max={endTime} defaultValue={endTime}   />
                <br></br>
                <div>{startTime} - {endTime}</div>
            </div>
        </div>
    )
}