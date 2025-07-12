export default function PlaybackSpeed({ audioRef, setPlaybackSpeed, playbackSpeed }) {

    // Change speed
    const handleSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    };

    // Conditional style
    function bgStyle(speed) {
        if (playbackSpeed === speed) {
            return 'bg-cyan-400 text-black'
        } else {
            return 'text-gray-400 hover:text-white'
        }
    }

    return (
        <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Speed:</span>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button key={speed} onClick={() => handleSpeedChange(speed)} className={`px-2 py-1 rounded text-sm transition-all ${bgStyle(speed)}`}>
                    {speed}x
                </button>
            ))}
        </div>
    )
}
