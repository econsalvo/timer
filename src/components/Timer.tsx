import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Timer() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = window.setInterval(() => {
                setTime((prev) => prev + 10);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running]);

    const formatTime = useCallback((ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    }, []);

    const resetTimer = useCallback(() => {
        setRepCount((prev) => prev + 1);
        setRunning(false);
        setTime(0);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="text-4xl font-mono">{formatTime(time)}</div>
            <div className="flex space-x-2">
                <button className="px-4 py-2 text-white rounded" onClick={() => setRunning(true)} disabled={running}>
                    Play
                </button>
                <button className="px-4 py-2 text-white rounded" onClick={() => setRunning(false)} disabled={!running}>
                    Stop
                </button>
                <button className="px-4 py-2 text-white rounded" onClick={() => resetTimer()}>
                    <RotateCcw />
                </button>
            </div>
            <div className="text-4xl font-mono">{repCount}</div>
            <div className="flex space-x-2">
                <button className="flex px-4 py-2 text-white rounded" onClick={() => setRepCount(prev => prev + 1)} >
                    <Plus />
                </button>
                <button className="flex px-4 py-2 text-white rounded" onClick={() => setRepCount(prev => prev - 1)} >
                    <Minus />
                </button>
                <button className="flex px-4 py-2 text-white rounded" onClick={() => setRepCount(0)} >
                    Clear
                </button>
            </div>
        </div>
    );
}