import React, { useState, useEffect, useRef} from 'react'
import Youtube, { YouTubeProps, YouTubePlayer } from 'react-youtube'
import Slider, { SliderProps } from 'rc-slider'
import './Video.css'
import 'rc-slider/assets/index.css'

function secondsToHMS(seconds: number) {
    const hours = seconds > 3600 ? Math.floor(seconds / 3600) : null
    const minutes = hours ? Math.floor((seconds % 3600) / 60): Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)

    // Format the result
    const formattedTime = (hours ? hours + ":" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds

    return formattedTime
}

/**
 * Sample video urls:
 * Clair De Lune - Debussy (Rousseau). https://www.youtube.com/watch?v=WNcsUNKlAKw
 * All The Things You Are - Chet Baker. https://www.youtube.com/watch?v=ngFdSR_aqdI
 * piano jazz improvisation. https://www.youtube.com/watch?v=QBzHqW4V3lA
 */
const sampleVideos = [
    "WNcsUNKlAKw",
    "ngFdSR_aqdI",
    "QBzHqW4V3lA",

]
export default function Video() {
    const [videoURL, setVideoURL] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [videoCode, setVideoCode] = useState('')
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [sliderValues, setSliderValues] = useState([0,100])
    const [sampleVideoIndex, setSampleVideoIndex] = useState(0)

    const player = useRef<YouTubePlayer>()

    const VIDEO_K = 49                      // constant used for 16*k width and 9*k height (16:9 ratio)
    
    /**
     * Loop methods
     * 
     */
    useEffect(() => {
        const interval = setInterval(() => {
            if (player.current && player.current.getCurrentTime() >= sliderValues[1]) {
                console.log("looping!")
                player.current.seekTo(sliderValues[0], true)
                player.current.playVideo()
            }
        }, 50)

        return () => {
            clearInterval(interval)
        }
    }, [sliderValues])

    /**
     * Slider methods
     * 
     */

    const handleSeekAhead = (times: number | number[]) => {
        times = Array.isArray(times) ? times : [times]
        player.current.seekTo(times[0], true)
        player.current.playVideo()
    }

    const handleSliderValues = (times: number | number[]) => {
        times = Array.isArray(times) ? times : [times]
        setSliderValues(times)
        player.current.seekTo(times[0], false)

        console.log("handleSliderValues (nostate): ", times)
    }

    const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setVideoURL(e.target.value)
        setErrorMessage('')
    }

    /**
     * Upload button handle
     * 
     */
    const handleYoutubeSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
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

    /**
     * Sample video button handle
     * 
     */
    const handleSampleVideo = () => {
        setVideoCode(sampleVideos[sampleVideoIndex])
        setSampleVideoIndex(index => index == sampleVideos.length-1 ? 0 : index + 1)
        setErrorMessage('')
    } 

    /**
     * React-Youtube player handles
     * 
     */
    const onReady: YouTubeProps['onReady'] = (e) => {
        console.log("onready")
        // access to player in all event handlers via event.target

        player.current = e.target
        // e.target.pauseVideo()
        setStartTime(0)
        setEndTime(e.target.getDuration())
        setSliderValues([0, e.target.getDuration()])
    }

    const opts: YouTubeProps['opts'] = {
        height: String(9 * VIDEO_K),
        width: String(16 * VIDEO_K),
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className='wrapper'>
            <h1 className='form-group title' style={{ marginBottom: '20px'}}>Music Looper Learner</h1>
            <form className='form-group form' onSubmit={handleYoutubeSubmit} style={{marginBottom: '12px', width: '55%'}}>
                <input
                    className='form-control'
                    type='text'
                    style={{ marginRight: '10px'}}
                    value={videoURL}
                    placeholder='Enter YouTube URL'
                    onChange={e => handleURLChange(e)}
                />
            </form>     
            <div className='button-container' style={{marginBottom: '10px'}}>
                <button type='submit' className='btn btn-success btn-md' onClick={handleYoutubeSubmit}>Upload</button>
                <button className='btn btn-primary' onClick={handleSampleVideo}>{videoCode === '' ? "Try Sample Video" : "Try Another Video"}</button>
            </div>
            {errorMessage ? <div className='error-msg'>{errorMessage}</div> : <div style={{height: '21px'}}></div>}
            <br></br>
            {videoCode ? 
            <>
                <Youtube
                    style={{ marginBottom: '10px' }}
                    videoId={videoCode}
                    opts={opts}
                    onReady={onReady}
                />
                <div className='slider-container' style={{width: `${16 * VIDEO_K - 25}px`}}>
                    <Slider 
                        range 
                        min={startTime}
                        max={endTime}
                        defaultValue={sliderValues}
                        value={sliderValues}
                        allowCross={false}
                        onChange={handleSliderValues}
                        onChangeComplete={handleSeekAhead}
                    />
                    <div style={{textAlign: "center"}}>{secondsToHMS(sliderValues[0])} - {secondsToHMS(sliderValues[1])} </div>
                </div>
            </>
                : <div>Video will appear once URL is uploaded</div>}           
        </div>
    )
}