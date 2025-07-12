import { Pause, Shuffle, SkipBack, Play, SkipForward, Repeat, VolumeX, Volume2 } from 'lucide-react'


export default function Controls({ audioRef, isShuffled, setIsShuffled, playPrevious, isPlaying, pauseAudio, playAudio, playNext, repeatMode, setRepeatMode, toggleMute, isMuted, volume, setIsMuted, setVolume }) {
    // Change volume
    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
        setIsMuted(value === 0);
    };

    // Conditional styles
    const bgStyle = isShuffled ? 'text-cyan-400 bg-cyan-400/20' : 'text-gray-400 hover:text-white';
    const repeatBtnStyle = repeatMode !== 'none' ? 'text-cyan-400 bg-cyan-400/20' : 'text-gray-400 hover:text-white';


    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsShuffled(!isShuffled)} className={`p-2 rounded-full transition-all ${bgStyle}`}>
                    <Shuffle className="w-5 h-5" />
                </button>

                <button onClick={playPrevious} className="p-2 text-gray-400 hover:text-white transition-all">
                    <SkipBack className="w-6 h-6" />
                </button>

                <button onClick={isPlaying ? pauseAudio : playAudio} className="p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white hover:from-cyan-400 hover:to-purple-400 transition-all transform hover:scale-105">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button onClick={playNext} className="p-2 text-gray-400 hover:text-white transition-all">
                    <SkipForward className="w-6 h-6" />
                </button>

                <button onClick={() => setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none')} className={`p-2 rounded-full transition-all relative ${repeatBtnStyle}`}>
                    <Repeat className="w-5 h-5" />
                    {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-xs bg-cyan-400 text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">1</span>}
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-all">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider" />
                <span className="text-sm text-gray-400 w-8">{Math.round((isMuted ? 0 : volume) * 100)}</span>
            </div>
        </div>
    )
}
