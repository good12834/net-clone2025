// import { useState, useRef, useEffect } from 'react'
// import YouTube from 'react-youtube'

// const VideoPlayer = ({ movie, onClose, isTrailer }) => {
//   const videoRef = useRef(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(1)
//   const [isMuted, setIsMuted] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [hasError, setHasError] = useState(false)
//   const [youtubePlayer, setYoutubePlayer] = useState(null)

//   // YouTube player options - optimized for inline Netflix-style playback
//   const youtubeOpts = {
//     height: '100%',
//     width: '100%',
//     playerVars: {
//       autoplay: 1,           // Auto-play when loaded
//       controls: 1,           // Show YouTube controls
//       rel: 0,               // Don't show related videos
//       modestbranding: 1,    // Minimal YouTube branding
//       iv_load_policy: 3,    // Hide annotations
//       fs: 1,               // Allow fullscreen
//       cc_load_policy: 0,   // Hide captions
//       disablekb: 0,        // Enable keyboard controls
//       playsinline: 1,      // Play inline on mobile (iOS)
//       origin: typeof window !== 'undefined' ? window.location.origin : '',
//       enablejsapi: 1,      // Enable JavaScript API
//     },
//   }

//   useEffect(() => {
//     const video = videoRef.current
//     if (video) {
//       const updateTime = () => setCurrentTime(video.currentTime)
//       const updateDuration = () => setDuration(video.duration)
//       const handleEnded = () => setIsPlaying(false)
//       const handleLoadStart = () => setIsLoading(true)
//       const handleCanPlay = () => setIsLoading(false)
//       const handleError = (e) => {
//         console.log('Video error occurred:', e)
//         console.log('Video source URL:', video.src)
//         setIsPlaying(false)
//         setIsLoading(false)
//         setHasError(true)
//       }

//       video.addEventListener('timeupdate', updateTime)
//       video.addEventListener('loadedmetadata', updateDuration)
//       video.addEventListener('ended', handleEnded)
//       video.addEventListener('error', handleError)
//       video.addEventListener('loadstart', handleLoadStart)
//       video.addEventListener('canplay', handleCanPlay)

//       return () => {
//         // Clean up event listeners
//         video.removeEventListener('timeupdate', updateTime)
//         video.removeEventListener('loadedmetadata', updateDuration)
//         video.removeEventListener('ended', handleEnded)
//         video.removeEventListener('error', handleError)
//         video.removeEventListener('loadstart', handleLoadStart)
//         video.removeEventListener('canplay', handleCanPlay)

//         // Pause video and reset before unmounting
//         if (video && !video.paused) {
//           video.pause()
//         }
//       }
//     }
//   }, [])

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       const video = videoRef.current
//       if (video && !video.paused) {
//         video.pause()
//         console.log('Video paused on component unmount')
//       }
//     }
//   }, [])

//   const togglePlay = async () => {
//     const video = videoRef.current
//     if (!video) return

//     try {
//       if (isPlaying) {
//         video.pause()
//         setIsPlaying(false)
//       } else {
//         // Check if video is still in document before playing
//         if (document.contains(video)) {
//           await video.play()
//           setIsPlaying(true)
//         } else {
//           console.log('Video element not in document, cannot play')
//         }
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         console.log('Play request was interrupted - video element was removed')
//         setIsPlaying(false)
//       } else {
//         console.error('Video play error:', error)
//         setIsPlaying(false)
//       }
//     }
//   }

//   const handleSeek = (e) => {
//     const video = videoRef.current
//     const rect = e.target.getBoundingClientRect()
//     const percent = (e.clientX - rect.left) / rect.width
//     video.currentTime = percent * duration
//   }

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value)
//     setVolume(newVolume)
//     videoRef.current.volume = newVolume
//     setIsMuted(newVolume === 0)
//   }

//   const toggleMute = () => {
//     const video = videoRef.current
//     if (video) {
//       video.muted = !video.muted
//       setIsMuted(video.muted)
//     }
//   }

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`
//   }

//   // YouTube event handlers
//   const onYouTubeReady = (event) => {
//     console.log('YouTube player ready')
//     setYoutubePlayer(event.target)
//     setIsLoading(false)
//     setIsPlaying(true)
//   }

//   const onYouTubeStateChange = (event) => {
//     // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
//     const playerState = event.data
//     setIsPlaying(playerState === 1) // 1 = playing

//     if (playerState === 0) { // 0 = ended
//       setIsPlaying(false)
//     }
//   }

//   const onYouTubeError = (error) => {
//     console.error('YouTube player error:', error)
//     setHasError(true)
//     setIsLoading(false)
//   }

//   const extractVideoId = (url) => {
//     if (!url) return ''

//     console.log(' Extracting YouTube video ID from:', url)

//     // Handle different YouTube URL formats
//     const patterns = [
//       /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
//       /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
//       /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/
//     ]

//     for (const pattern of patterns) {
//       const match = url.match(pattern)
//       if (match && match[1]) {
//         console.log('✅ Extracted video ID:', match[1])
//         return match[1]
//       }
//     }

//     console.log('❌ Could not extract video ID from:', url)
//     return ''
//   }

//   const convertToEmbedUrl = (url) => {
//     if (!url) return ''

//     console.log(' Converting YouTube URL:', url)

//     // Handle different YouTube URL formats
//     const patterns = [
//       /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
//       /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
//       /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/
//     ]

//     for (const pattern of patterns) {
//       const match = url.match(pattern)
//       if (match && match[1]) {
//         const embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`
//         console.log('✅ Converted to embed URL:', embedUrl)
//         return embedUrl
//       }
//     }

//     // If it's already an embed URL, just add autoplay
//     if (url.includes('youtube.com/embed/')) {
//       const embedUrl = url + (url.includes('?') ? '&' : '?') + 'autoplay=1&rel=0'
//       console.log('✅ Enhanced embed URL:', embedUrl)
//       return embedUrl
//     }

//     console.log('❌ Not a YouTube URL, returning as-is:', url)
//     return url
//   }

//   return (
//     <div
//       className="video-player-overlay"
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'rgba(0,0,0,0.9)',
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//       onClick={onClose}
//     >
//       <div
//         className="video-player-container"
//         style={{
//           position: 'relative',
//           maxWidth: '90vw',
//           maxHeight: '90vh',
//           background: '#000',
//           borderRadius: '8px',
//           overflow: 'hidden'
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={() => {
//             // Pause video before closing
//             const video = videoRef.current
//             if (video && !video.paused) {
//               video.pause()
//             }
//             onClose()
//           }}
//           style={{
//             position: 'absolute',
//             top: '10px',
//             right: '10px',
//             background: 'rgba(0,0,0,0.7)',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '50%',
//             width: '40px',
//             height: '40px',
//             cursor: 'pointer',
//             zIndex: 10,
//             fontSize: '18px'
//           }}
//         >
//           ✕
//         </button>

//         {/* Loading Spinner */}
//         {isLoading && (isTrailer ? (movie.trailer_url || movie.trailer) : (movie.video_url || movie.video)) && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 5,
//               color: '#fff',
//               textAlign: 'center'
//             }}
//           >
//             <div
//               style={{
//                 width: '50px',
//                 height: '50px',
//                 border: '3px solid rgba(255,255,255,0.3)',
//                 borderTop: '3px solid #e50914',
//                 borderRadius: '50%',
//                 animation: 'spin 1s linear infinite',
//                 margin: '0 auto 10px'
//               }}
//             />
//             <p>Loading video...</p>
//           </div>
//         )}

//         {/* Error Message */}
//         {hasError && (isTrailer ? (movie.trailer_url || movie.trailer) : (movie.video_url || movie.video)) && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 5,
//               color: '#fff',
//               textAlign: 'center',
//               background: 'rgba(0,0,0,0.8)',
//               padding: '20px',
//               borderRadius: '8px'
//             }}
//           >
//             <h3>Video Error</h3>
//             <p>Unable to load video. Please try again.</p>
//             <button
//               onClick={() => {
//                 setHasError(false)
//                 setIsLoading(true)
//                 const video = videoRef.current
//                 if (video) {
//                   video.load()
//                 }
//               }}
//               style={{
//                 background: '#e50914',
//                 color: '#fff',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 marginTop: '10px'
//               }}
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Video Element */}
//         {(() => {
//           console.log(' VideoPlayer Debug:', {
//             movie: movie.title,
//             isTrailer,
//             trailer_url: movie.trailer_url,
//             trailer: movie.trailer,
//             video_url: movie.video_url,
//             video: movie.video,
//             hasYouTube: (movie.trailer_url || movie.trailer || '').includes('youtube.com')
//           });

//           const trailerUrl = movie.trailer_url || movie.trailer;
//           const hasYouTube = trailerUrl && trailerUrl.includes('youtube.com');

//           if (isTrailer && hasYouTube) {
//             /* YouTube Trailer with React YouTube Component */
//             const videoId = extractVideoId(trailerUrl);
//             console.log('🎬 YouTube Debug:', { trailerUrl, videoId, movieTitle: movie.title });

//             if (!videoId) {
//               console.error('❌ No video ID extracted from:', trailerUrl);
//               console.log('🔧 Testing with fallback YouTube video...');
//               // Test with a known working YouTube video
//               return (
//                 <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//                   <YouTube
//                     videoId="dQw4w9WgXcQ" // Rick Roll as test
//                     opts={youtubeOpts}
//                     onReady={(event) => {
//                       console.log('✅ Test YouTube player ready');
//                       onYouTubeReady(event);
//                     }}
//                     onStateChange={(event) => {
//                       console.log('📺 Test YouTube state changed:', event.data);
//                       onYouTubeStateChange(event);
//                     }}
//                     onError={(error) => {
//                       console.error('❌ Test YouTube player error:', error);
//                       onYouTubeError(error);
//                     }}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       borderRadius: '8px',
//                       pointerEvents: 'auto'
//                     }}
//                   />
//                   <div style={{
//                     position: 'absolute',
//                     top: '10px',
//                     left: '10px',
//                     color: '#fff',
//                     background: 'rgba(0,0,0,0.7)',
//                     padding: '5px 10px',
//                     borderRadius: '4px',
//                     fontSize: '12px'
//                   }}>
//                     Test Video - URL Error
//                   </div>
//                 </div>
//               );
//             }

//             return (
//               <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//                 <YouTube
//                   videoId={videoId}
//                   opts={youtubeOpts}
//                   onReady={(event) => {
//                     console.log('✅ YouTube player ready for:', movie.title);
//                     onYouTubeReady(event);
//                   }}
//                   onStateChange={(event) => {
//                     console.log('📺 YouTube state changed:', event.data, 'for:', movie.title);
//                     onYouTubeStateChange(event);
//                   }}
//                   onError={(error) => {
//                     console.error('❌ YouTube player error for:', movie.title, error);
//                     onYouTubeError(error);
//                   }}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     borderRadius: '8px',
//                     pointerEvents: 'auto'
//                   }}
//                 />
//               </div>
//             );
//           } else if (isTrailer && trailerUrl) {
//             /* Regular Video Trailer */
//             console.log(' Regular video trailer:', trailerUrl);
//             return (
//               <video
//                 ref={videoRef}
//                 style={{
//                   width: '100%',
//                   maxHeight: '80vh',
//                   display: 'block',
//                   opacity: isLoading || hasError ? 0.3 : 1,
//                   transition: 'opacity 0.3s ease'
//                 }}
//                 poster={movie.backdrop_url || movie.backdrop || movie.image || '/placeholder-movie.jpg'}
//                 onClick={togglePlay}
//                 preload="metadata"
//                 onError={(e) => {
//                   console.log(`Video error for ${movie.title}:`, e);
//                   setHasError(true);
//                 }}
//               >
//                 <source src={trailerUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             );
//           } else {
//             /* No Video Available Message */
//             console.log('❌ No video available for:', movie.title);
//             return (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   zIndex: 5,
//                   color: '#fff',
//                   textAlign: 'center',
//                   background: 'rgba(0,0,0,0.8)',
//                   padding: '40px',
//                   borderRadius: '8px',
//                   maxWidth: '400px'
//                 }}
//               >
//                 <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎬</div>
//                 <h3 style={{ marginBottom: '10px' }}>
//                   {isTrailer ? 'Trailer Not Available' : 'Video Not Available'}
//                 </h3>
//                 <p style={{ marginBottom: '20px', opacity: 0.8 }}>
//                   {isTrailer
//                     ? 'The trailer for this movie is not available at the moment.'
//                     : 'The full movie is not available for streaming.'
//                   }
//                 </p>
//                 <p style={{ fontSize: '14px', opacity: 0.6 }}>
//                   Check back later or try another movie.
//                 </p>
//               </div>
//             );
//           }
//         })()}

//         {/* Video Controls - Hidden for YouTube videos (they have their own controls) */}
//         {(isTrailer ? (movie.trailer_url || movie.trailer) : (movie.video_url || movie.video)) && !(isTrailer && (movie.trailer_url || movie.trailer) && (movie.trailer_url || movie.trailer).includes('youtube.com')) && (
//           <div
//             className="video-controls"
//             style={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               right: 0,
//               background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
//               padding: '20px',
//               opacity: 1,
//               transition: 'opacity 0.3s ease'
//             }}
//           >
//           {/* Progress Bar */}
//           <div
//             className="progress-bar"
//             style={{
//               width: '100%',
//               height: '4px',
//               background: 'rgba(255,255,255,0.3)',
//               borderRadius: '2px',
//               marginBottom: '10px',
//               cursor: 'pointer'
//             }}
//             onClick={handleSeek}
//           >
//             <div
//               className="progress-fill"
//               style={{
//                 height: '100%',
//                 background: '#e50914',
//                 borderRadius: '2px',
//                 width: `${(currentTime / duration) * 100}%`,
//                 transition: 'width 0.1s ease'
//               }}
//             />
//           </div>

//           {/* Control Buttons */}
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between'
//             }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//               {/* Play/Pause */}
//               <button
//                 onClick={togglePlay}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#fff',
//                   fontSize: '24px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {isPlaying ? '⏸' : '▶'}
//               </button>

//               {/* Time Display */}
//               <span style={{ color: '#fff', fontSize: '14px' }}>
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>

//             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//               {/* Volume Control */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <button
//                   onClick={toggleMute}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     color: '#fff',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   {isMuted ? '🔇' : '🔊'}
//                 </button>
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   value={isMuted ? 0 : volume}
//                   onChange={handleVolumeChange}
//                   style={{
//                     width: '80px',
//                     height: '4px',
//                     background: 'rgba(255,255,255,0.3)',
//                     outline: 'none',
//                     borderRadius: '2px'
//                   }}
//                 />
//               </div>

//               {/* Fullscreen (placeholder) */}
//               <button
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#fff',
//                   fontSize: '18px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 ⛶
//               </button>
//             </div>
//           </div>
//         </div>
//         )}

//         {/* Movie Info Overlay */}
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '80px',
//             left: '20px',
//             right: '20px',
//             color: '#fff'
//           }}
//         >
//           <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 'bold' }}>
//             {movie.title}
//           </h1>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
//             <span style={{ color: '#46d369', fontWeight: 'bold' }}>{movie.match}</span>
//             <span>{movie.year}</span>
//             <span style={{
//               border: '1px solid rgba(255,255,255,0.5)',
//               padding: '2px 8px',
//               borderRadius: '3px',
//               fontSize: '12px'
//             }}>
//               {movie.rating}
//             </span>
//           </div>
//           <p style={{ fontSize: '1rem', lineHeight: '1.4', maxWidth: '600px' }}>
//             {movie.description}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VideoPlayer