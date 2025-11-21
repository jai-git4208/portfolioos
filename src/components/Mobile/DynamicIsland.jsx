/*  ——— FIXED DYNAMIC ISLAND —
     ✔ Yes/No horizontally aligned
     ✔ No redirect if already logged in
     ✔ Pausing no longer collapses island
*/

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'

const DynamicIsland = ({ showNotification, spotifyData, onSpotifyUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [player, setPlayer] = useState(null)
  const [deviceId, setDeviceId] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Ask user before starting Spotify
  const [askToPlay, setAskToPlay] = useState(true)

  // Spotify Auth Config
  const CLIENT_ID = 'fdfb1aed092d44659a2414f29bb17c82'
  const REDIRECT_URI = window.location.origin
  const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
  ].join(' ')

  // ————————————————————————————
  // Utility Functions
  // ————————————————————————————
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], '')
  }

  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  // ————————————————————————————
  // Handle YES click properly
  // ————————————————————————————
  const handlePlayYes = async () => {
    const token = localStorage.getItem('spotify_access_token')
    const expiry = localStorage.getItem('spotify_token_expiry')

    if (token && expiry && Date.now() < parseInt(expiry)) {
      // Already authenticated → don't redirect
      setAccessToken(token)
      initializePlayer(token)
      setAskToPlay(false)
    } else {
      // Not authenticated → OAuth
      authenticate()
    }
  }

  // ————————————————————————————
  // Spotify Boot Logic
  // ————————————————————————————
  useEffect(() => {
    if (!askToPlay) return // user clicked NO

    const initSpotify = async () => {
      const token = localStorage.getItem('spotify_access_token')
      const expiry = localStorage.getItem('spotify_token_expiry')

      if (token && expiry && Date.now() < parseInt(expiry)) {
        setAccessToken(token)
        initializePlayer(token)
        return
      }

      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        const codeVerifier = localStorage.getItem('code_verifier')
        await exchangeToken(code, codeVerifier)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }

    initSpotify()
  }, [askToPlay])

  // ————————————————————————————
  // Authentication Flow
  // ————————————————————————————
  const authenticate = async () => {
    const codeVerifier = generateRandomString(64)
    localStorage.setItem('code_verifier', codeVerifier)

    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    authUrl.searchParams.append('client_id', CLIENT_ID)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.append('scope', SCOPES)
    authUrl.searchParams.append('code_challenge_method', 'S256')
    authUrl.searchParams.append('code_challenge', codeChallenge)

    window.location.href = authUrl.toString()
  }

  const exchangeToken = async (code, codeVerifier) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    })

    const data = await response.json()
    if (data.access_token) {
      const expiry = Date.now() + data.expires_in * 1000
      localStorage.setItem('spotify_access_token', data.access_token)
      localStorage.setItem('spotify_token_expiry', expiry.toString())
      setAccessToken(data.access_token)
      initializePlayer(data.access_token)
    }
  }

  // ————————————————————————————
  // Spotify Web Playback SDK
  // ————————————————————————————
  const initializePlayer = (token) => {
    if (!window.Spotify) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Portfolio OS Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5
      })

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id)
        playRandomProgrammingSong(token, device_id)
      })

      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return

        const track = state.track_window.current_track
        setCurrentTrack({
          name: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0].url,
          duration: state.duration,
          position: state.position,
        })

        setIsPlaying(!state.paused)

        if (onSpotifyUpdate) {
          onSpotifyUpdate({
            track,
            isPlaying: !state.paused,
          })
        }
      })

      spotifyPlayer.connect()
      setPlayer(spotifyPlayer)
    }
  }

  const playRandomProgrammingSong = async (token, device) => {
    try {
      const playlists = ['37i9dQZF1DX5trt9i14X7j', '37i9dQZF1DX8NTLI2TtZa6']
      const id = playlists[Math.floor(Math.random() * playlists.length)]

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${id}`,
          offset: { position: Math.floor(Math.random() * 20) }
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  // ————————————————————————————
  // Player Controls
  // ————————————————————————————
  const togglePlayPause = () => player && player.togglePlay()
  const skipNext = () => player && player.nextTrack()
  const skipPrevious = () => player && player.previousTrack()

  // FIXED: Keep island visible even when paused
  const hasMusic = currentTrack !== null

  const shouldExpand = showNotification || (hasMusic && isExpanded)

  // ————————————————————————————
  // RENDER
  // ————————————————————————————
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={shouldExpand ? 'expanded' : 'collapsed'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            width: shouldExpand ? 350 : (hasMusic ? 200 : 130),
            height: shouldExpand ? (hasMusic ? 120 : 80) : 37
          }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={() => hasMusic && setIsExpanded(!isExpanded)}
          className="bg-black rounded-[28px] flex items-center justify-center overflow-hidden cursor-pointer"
        >

          {/* YES / NO PROMPT — HORIZONTAL */}
          {!showNotification && !hasMusic && askToPlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-row items-center space-x-3 px-3"
            >
              <p className="text-white text-xs">Play music?</p>

              <button
                onClick={(e) => { e.stopPropagation(); handlePlayYes(); }}
                className="text-white bg-white/20 px-3 py-1 rounded-full text-xs"
              >
                Yes
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setAskToPlay(false); }}
                className="text-white/60 px-3 py-1 rounded-full text-xs"
              >
                No
              </button>
            </motion.div>
          )}

          {/* NOTIFICATION VIEW */}
          {showNotification && !hasMusic && !askToPlay && (
            <motion.div className="flex items-center space-x-3 px-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-orange flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <p className="text-white font-semibold text-sm">App Opened</p>
                <p className="text-white/60 text-xs">Tap to view</p>
              </div>
            </motion.div>
          )}

          {/* COMPACT MUSIC VIEW */}
          {hasMusic && !shouldExpand && (
            <motion.div className="flex items-center space-x-3 px-4">
              <img src={currentTrack.image} alt="Album" className="w-8 h-8 rounded-lg" />

              <div className="flex-1 overflow-hidden">
                <motion.p
                  animate={{ x: [0, -100, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="text-white font-semibold text-xs whitespace-nowrap"
                >
                  {currentTrack.name}
                </motion.p>
              </div>

              <div className="flex items-center space-x-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-0.5 bg-white rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* EXPANDED MUSIC VIEW */}
          {hasMusic && shouldExpand && (
            <motion.div className="w-full h-full p-4 flex flex-col justify-between">
              <div className="flex items-center space-x-3">
                <img src={currentTrack.image} alt="Album" className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                  <p className="text-white font-bold text-sm line-clamp-1">{currentTrack.name}</p>
                  <p className="text-white/60 text-xs line-clamp-1">{currentTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-2">
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); skipPrevious() }}
                  className="text-white/80 hover:text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); togglePlayPause() }}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-black" />
                  ) : (
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  )}
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); skipNext() }}
                  className="text-white/80 hover:text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="mt-2">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${
                        (currentTrack.position / currentTrack.duration) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* IDLE STATE */}
          {!showNotification && !hasMusic && !askToPlay && (
            <motion.div className="w-full h-full" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default DynamicIsland
