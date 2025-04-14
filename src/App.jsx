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
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
  
    setAudioFiles((prevFiles) => {
      const existingFiles = new Set(prevFiles.map(file => `${file.name}-${file.size}`));   // Set is created only of existing files
      
      const uniqueNewFiles = newFiles.filter(file => {
        const id = `${file.name}-${file.size}`;
        return !existingFiles.has(id);         // sanitize the duplicate in Set
      });
  
      return [...prevFiles, ...uniqueNewFiles];
    });

    // Reset input so same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const removeSong = (fileToRemove) => {
    setAudioFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  
    if (currentFile === fileToRemove) {
      pauseAudio();
      setCurrentFile(null);
      setCurrentTime(0);
      setDuration(0);
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
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>

        {audioFiles.length !== 0 ? <div>
          Imported: {audioFiles.length}
        </div> : null}


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
              <p>{file.name}</p>
              <svg onClick={(e) => {e.stopPropagation(); removeSong(file); }} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 496 496" xml:space="preserve">
                <path d="M496,320.8c0,96.8-78.4,175.2-175.2,175.2H175.2C78.4,496,0,417.6,0,320.8V175.2
                  C0,78.4,78.4,0,175.2,0h145.6C417.6,0,496,78.4,496,175.2V320.8z"/>
                <path d="M0,175.2C0,78.4,78.4,0,175.2,0h145.6C417.6,0,496,78.4,496,175.2v145.6
                  c0,96.8-78.4,175.2-175.2,175.2"/>
                <g>
                  <path d="M320.8,0C417.6,0,496,78.4,496,175.2v145.6c0,96.8-78.4,175.2-175.2,175.2"/>
                  <path d="M264.8,262.4l67.2-67.2c4.8-4.8,4.8-12,0-16.8s-12-4.8-16.8,0L248,245.6l-67.2-67.2
                    c-4.8-4.8-12-4.8-16.8,0s-4.8,12,0,16.8l67.2,67.2L164,329.6c-4.8,4.8-4.8,12,0,16.8c2.4,2.4,5.6,3.2,8,3.2s5.6-0.8,8-3.2
                    l67.2-67.2l67.2,67.2c2.4,2.4,5.6,3.2,8,3.2s5.6-0.8,8-3.2c4.8-4.8,4.8-12,0-16.8L264.8,262.4z"/>
                </g>
                <path d="M264.8,248l67.2-67.2c4.8-4.8,4.8-12,0-16.8s-12-4.8-16.8,0L248,231.2L180.8,164
                  c-4.8-4.8-12-4.8-16.8,0s-4.8,12,0,16.8l67.2,67.2L164,315.2c-4.8,4.8-4.8,12,0,16.8c2.4,2.4,5.6,3.2,8,3.2s5.6-0.8,8-3.2l67.2-67.2
                  l67.2,67.2c2.4,2.4,5.6,3.2,8,3.2s5.6-0.8,8-3.2c4.8-4.8,4.8-12,0-16.8L264.8,248z"/>
              </svg>
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
