import { useRef, useCallback } from 'react';

export const useLongPress = (onLongPress, onClick, { delay = 500 } = {}) => {
    const timerRef = useRef();
    const isLongPressActive = useRef(false);

    const start = useCallback((event) => {
        isLongPressActive.current = false;
        timerRef.current = setTimeout(() => {
            onLongPress(event);
            isLongPressActive.current = true;
        }, delay);
    }, [onLongPress, delay]);

    const stop = useCallback((event) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const handleClick = useCallback((event) => {
        if (isLongPressActive.current) {
            isLongPressActive.current = false;
            return;
        }
        onClick?.(event);
    }, [onClick]);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
        onClick: handleClick,
    };
};
