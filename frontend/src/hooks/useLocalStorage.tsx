import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Retrieve the stored value or use the initial value
    const getStoredValue = () => {
        try {
            const item = window.localStorage.getItem(key);
            // If item is not null, parse it, otherwise return the initial value
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”: ", error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    useEffect(() => {
        try {
            // Store the value in localStorage
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error setting localStorage key “" + key + "”: ", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}