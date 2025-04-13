import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
  
    setAudioFiles((prevFiles) => {
      const existingFiles = new Set(prevFiles.map(file => `${file.name}-${file.size}`));
      
      const uniqueNewFiles = newFiles.filter(file => {
        const id = `${file.name}-${file.size}`;
        return !existingFiles.has(id);
      });
  
      return [...prevFiles, ...uniqueNewFiles];
    });
  };
  

  const loadAndPlay = (file) => {
    const fileURL = URL.createObjectURL(file);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      }

      audioRef.current.src = fileURL;
      audioRef.current.load();
      audioRef.current.play();
      setCurrentFile(file);
      setIsPlaying(true);
    }
  };

  const playAudio = () => {
    if(audioRef.current){
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Auto-play next song
    if (currentFile) {
      const currentIndex = audioFiles.findIndex(f => f.name === currentFile.name);
      const nextIndex = currentIndex + 1;
      if (nextIndex < audioFiles.length) {
        loadAndPlay(audioFiles[nextIndex]);
      }
    }
  };

  const playNext = () => {
    if (currentFile) {
      const currentIndex = audioFiles.findIndex(f => f.name === currentFile.name);
      const nextIndex = currentIndex + 1;
      if (nextIndex < audioFiles.length) {
        loadAndPlay(audioFiles[nextIndex]);
      }
    }
  };
  
  const playPrevious = () => {
    if (currentFile) {
      const currentIndex = audioFiles.findIndex(f => f.name === currentFile.name);
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        loadAndPlay(audioFiles[prevIndex]);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pauseAudio() : playAudio();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        playNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        playPrevious();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentFile, audioFiles]); 
  

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateDuration = () => setDuration(audio.duration || 0);
    const updateCurrentTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFiles, currentFile]);

  return (
    <div id="range" >
      <article>
      <div id="sticky-controls">
        <label className="custom-file-upload" aria-label='Import songs'>
          Import Songs
          <input
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>


        {currentFile && (
          <div id='current-song' onClick={(e)=> {e.preventDefault(); e.stopPropagation()}}>
            <p><strong>Now Playing:</strong> {currentFile.name}</p>

            {/* Progress Bar */}
            <input
              type="range"
              ref={progressRef}
              value={currentTime}
              max={duration}
              onChange={handleProgressChange}
            />
            <div>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div id='buttons'>
              <button onClick={playPrevious} aria-label='Previous song'>&#8592;</button>
              <button onClick={()=>{isPlaying ? pauseAudio() : playAudio()}} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? 'Pause' : 'Play'}</button>
              <button onClick={playNext} aria-label='Next song'>&#8594;</button>
            </div>
          </div>
        )}
      </div>


        <ul>
          {audioFiles.map((file, index) => (
            <li key={index} onClick={() => loadAndPlay(file)}>
              {file.name}
            </li>
          ))}
        </ul>

        {audioFiles.length === 0 ? <div id='centered-div' aria-label='Import songs to play'>
          <p>No songs available</p>
          <p>Import songs to play</p>
        </div>: null}


        <audio ref={audioRef} />
      </article>
    </div>
  );
};

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default App;
