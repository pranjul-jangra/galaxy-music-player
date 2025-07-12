import { useState, useRef, useEffect } from 'react';
import './App.css'
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Playlist from './components/Playlist';
import UploadFiles from './components/UploadFiles';
import PlaybackSpeed from './ui/PlaybackSpeed';
import Controls from './components/Controls';
import ProgressBar from './ui/ProgressBar';
import MusicDisplay from './ui/MusicDisplay';
import Header from './ui/Header';


export default function App() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const fileInputRef = useRef(null);


  const loadAndPlay = (file) => {
    const fileURL = URL.createObjectURL(file);
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      audioRef.current.src = fileURL;
      audioRef.current.load();
      audioRef.current.play();
      setCurrentFile(file);
      setIsPlaying(true);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const getNextSong = () => {
    if (!currentFile || audioFiles.length === 0) return null;
    const currentIndex = audioFiles.findIndex(f => f.name === currentFile.name);

    if (isShuffled) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * audioFiles.length);
      } while (randomIndex === currentIndex && audioFiles.length > 1);

      return audioFiles[randomIndex];
    }

    const nextIndex = (currentIndex + 1) % audioFiles.length;
    return audioFiles[nextIndex];
  };

  const getPreviousSong = () => {
    if (!currentFile || audioFiles.length === 0) return null;
    const currentIndex = audioFiles.findIndex(f => f.name === currentFile.name);

    if (isShuffled) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * audioFiles.length);
      } while (randomIndex === currentIndex && audioFiles.length > 1);
      return audioFiles[randomIndex];
    }

    const prevIndex = currentIndex === 0 ? audioFiles.length - 1 : currentIndex - 1;
    return audioFiles[prevIndex];
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (repeatMode === 'all' || audioFiles.length > 1) {
      const nextSong = getNextSong();
      if (nextSong) {
        loadAndPlay(nextSong);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    const nextSong = getNextSong();
    if (nextSong) {
      loadAndPlay(nextSong);
    }
  };

  const playPrevious = () => {
    const prevSong = getPreviousSong();
    if (prevSong) {
      loadAndPlay(prevSong);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          isPlaying ? pauseAudio() : playAudio();
          break;
        case 'ArrowRight':
          e.preventDefault();
          playNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyS':
          e.preventDefault();
          setIsShuffled(prev => !prev);
          break;
        case 'KeyR':
          e.preventDefault();
          setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentFile, audioFiles, volume]);


  // Update metadata on music load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration || 0);
    const updateCurrentTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFiles, currentFile, repeatMode, isDragging]);

  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header />

        {/* Player Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentFile && (
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/10">
                <MusicDisplay currentFile={currentFile} />

                <ProgressBar
                  progressRef={progressRef}
                  currentTime={currentTime}
                  duration={duration}
                  audioRef={audioRef}
                  setCurrentTime={setCurrentTime}
                  setIsDragging={setIsDragging}
                />

                <Controls
                  isShuffled={isShuffled}
                  setIsShuffled={setIsShuffled}
                  playPrevious={playPrevious}
                  isPlaying={isPlaying}
                  pauseAudio={pauseAudio}
                  playAudio={playAudio}
                  playNext={playNext}
                  repeatMode={repeatMode}
                  setRepeatMode={setRepeatMode}
                  toggleMute={toggleMute}
                  isMuted={isMuted}
                  volume={volume}
                  setIsMuted={setIsMuted}
                  setVolume={setVolume}
                  audioRef={audioRef}
                />

                <PlaybackSpeed audioRef={audioRef} setPlaybackSpeed={setPlaybackSpeed} playbackSpeed={playbackSpeed} />
              </div>
            )}

            <UploadFiles fileInputRef={fileInputRef} setAudioFiles={setAudioFiles} />
          </div>

          <Playlist
            audioRef={audioRef}
            audioFiles={audioFiles}
            setShowPlaylist={setShowPlaylist}
            setIsPlaying={setIsPlaying}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showPlaylist={showPlaylist}
            currentFile={currentFile}
            loadAndPlay={loadAndPlay}
            setAudioFiles={setAudioFiles}
            pauseAudio={pauseAudio}
            setCurrentFile={setCurrentFile}
            setCurrentTime={setCurrentTime}
            setDuration={setDuration}
          />
        </div>

        <KeyboardShortcuts />
      </div>

      <audio ref={audioRef} />
    </div>
  );
};