import { useState, useEffect } from 'react';

export interface WindowSize {
    windowWidth: number;
    windowHeight: number;
}

export function useWindowSize(): WindowSize {
    const [size, setSize] = useState<WindowSize>({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return size;
}
