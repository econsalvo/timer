import { Minus, Pause, Play, Plus, Repeat, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import LapTimes from './LapTimes';

export default function Timer() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const [laps, setLaps] = useState<number[]>([]);
    const [repIntervalInput, setRepIntervalInput] = useState<string>("0");
    const lastRepTimeRef = useRef<number>(undefined);


    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const repIntervalSeconds = parseFloat(repIntervalInput);
        const repIntervalMs = repIntervalSeconds * 1000;

        if (running) {
            // Initialize lastRepTimeRef if not set
            if (lastRepTimeRef.current === undefined) {
                lastRepTimeRef.current = time;
            }

            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 10;

                    if (!isNaN(repIntervalSeconds) && repIntervalMs > 0 && lastRepTimeRef.current !== undefined && newTime - lastRepTimeRef.current >= repIntervalMs) {
                        setRepCount((prev) => prev + 1);
                        lastRepTimeRef.current = newTime;
                    }

                    return newTime;
                });
            }, 10);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, repIntervalInput, time]);

    const formatTime = useCallback((ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    }, []);

    const resetTimer = useCallback(() => {
        if (running && time > 0) {
            setRepCount((prev) => prev + 1);
            setLaps((prev) => [...prev, time]);
        }
        setRunning(false);
        setTime(0);
        lastRepTimeRef.current = undefined;
    }, [running, time]);

    const clearAll = useCallback(() => {
        setRunning(false);
        setTime(0);
        setRepCount(0);
        setLaps([]);
        lastRepTimeRef.current = undefined;
    }, []);

    const decrementRepCount = useCallback(() => {
        setRepCount((prev) => Math.max(prev - 1, 0));
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex flex-col items-center space-y-4">
                <div className="text-4xl font-mono">{formatTime(time)}</div>
                <div className="flex space-x-2">
                    <button className="default-btn" onClick={() => setRunning(true)} disabled={running}>
                        <Play />
                    </button>
                    <button className="default-btn" onClick={() => setRunning(false)} disabled={!running}>
                        <Pause />
                    </button>
                    <button className="default-btn" onClick={() => resetTimer()}>
                        <RotateCcw />
                    </button>
                </div>
                <div className="text-4xl font-mono">{repCount}</div>
                <div className="flex space-x-2">
                    <button className="default-btn" onClick={() => setRepCount(prev => prev + 1)} >
                        <Plus />
                    </button>
                    <button className="default-btn" onClick={decrementRepCount} >
                        <Minus />
                    </button>
                    <button className="default-btn" onClick={clearAll} >
                        Clear
                    </button>
                </div>
                <div className="flex items-center space-x-2 gap-6">
                    <input
                        type="number"
                        disabled={running}
                        min="1"
                        value={repIntervalInput}
                        onChange={(e) => setRepIntervalInput(e.target.value)}
                        className="input-addon"
                    />
                    <span className="input-addon">sec</span>
                    <label className="text-white">
                        <Repeat
                            className="text-white hover:text-[#535bf2] cursor-pointer transition-colors duration-200"
                            onClick={() => setRepIntervalInput("")}
                        />
                    </label>
                </div>
            </div>
            <LapTimes laps={laps} formatTime={formatTime} />
        </div>
    );
}