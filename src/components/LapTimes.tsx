import { useEffect, useRef } from "react";

interface LapTimesProps {
    laps: number[];
    formatTime: (ms: number) => string;
}

export default function LapTimes(props: LapTimesProps) {
    const { laps, formatTime } = props;
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [laps]);

    return (
        <div ref={containerRef} className="border-gray-500/70 border-2 rounded-md p-4 min-h-5 max-h-48 overflow-y-auto overflow-x-hidden">
            {laps.length > 0 ? (
                laps.map((lap, index) => (
                    <div key={index} className="flex px-3 py-1 text-white border-b border-white/20 last:border-none">
                        {`${index + 1}) ${formatTime(lap)}`}
                    </div>
                ))
            ) : (
                <div className="text-gray-400 italic">No laps yet</div>
            )}
        </div>
    );
}


