import React, {useState} from 'react'
import YouTube, {YouTubeProps} from 'react-youtube'
import Video from './Video'

import './App.css'

function App() {

  return(
    <div className='container'>
      <Video />
    </div>
  )
  // const [youtubeVideo, setYoutubeVideo] = useState('')
  // const [youtubeURL, setYoutubeURL] = useState('')
  // const [errorInvalidURLMsg, setErrorInvalidURLMsg] = useState('')

  // const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setYoutubeVideo(e.target.value)
  // }

  // const handleYoutubeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/
  //   if (youtubeRegex.test(youtubeVideo)) {
  //     setYoutubeURL(youtubeVideo)
  //     setErrorInvalidURLMsg('')
  //   } else {
  //     setErrorInvalidURLMsg('Invalid Youtube URL')
  //   }
  // }
  // return (
  //   <div className='wrapper'>
  //     <form className='form-group form' onSubmit={handleYoutubeSubmit}>
  //       <input
  //         type='text'
  //         className='form-control'
  //         placeholder='Enter Youtube URL'
  //         onChange={handleYoutubeChange}
  //         required
  //       />
  //       <button type='submit' className='btn btn-success btn-md'>
  //         Upload
  //       </button>
  //     </form>
  //     {errorInvalidURLMsg && <div className='error-msg'>{errorInvalidURLMsg}</div>}
  //     <br></br>
  //     <div className='youtube-box'>
  //       <ReactPlayer url={youtubeURL} className='video' controls/>
  //     </div>
  //   </div>
  // )
}

export default App
