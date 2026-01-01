import { useEffect, useRef } from 'react'

export const useBackgroundMusic = (volume = 100) => {
    const audioRef = useRef(null)

    useEffect(() => {
        // Create audio element
        if (!audioRef.current) {
            audioRef.current = new Audio('/frieren.mp3')
            audioRef.current.loop = true
            audioRef.current.volume = volume / 100

            // Auto-play with error handling
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Background music autoplay prevented:', error)
                    // Add click listener to start music on first user interaction
                    const startMusic = () => {
                        audioRef.current?.play()
                        document.removeEventListener('click', startMusic)
                    }
                    document.addEventListener('click', startMusic)
                })
            }
        }

        return () => {
            // Cleanup on unmount
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    // Update volume when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100
        }
    }, [volume])

    return audioRef
}
