import { useEffect, useState } from 'react'

export const useKonamiCode = (callback) => {
    const [keys, setKeys] = useState([])
    const konamiCode = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'b',
        'a',
    ]

    useEffect(() => {
        const handleKeyDown = (e) => {
            setKeys((prev) => {
                const newKeys = [...prev, e.key]
                if (newKeys.length > konamiCode.length) {
                    newKeys.shift()
                }
                return newKeys
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (keys.join('') === konamiCode.join('')) {
            callback()
            setKeys([])
        }
    }, [keys, callback])
}
