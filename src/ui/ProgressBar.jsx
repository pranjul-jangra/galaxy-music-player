export default function ProgressBar({ progressRef, audioRef, currentTime, duration, setCurrentTime, setIsDragging }) {

    // Format time
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    // Change current time
    const handleProgressChange = (e) => {
        const value = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };


    return (
        <div className="mb-4">
            <input
                type="range"
                ref={progressRef}
                value={currentTime}
                max={duration}
                onChange={handleProgressChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    )
}
