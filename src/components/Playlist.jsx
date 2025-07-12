import { List, Music, PanelBottomOpen, Search, X } from 'lucide-react';


export default function Playlist({ audioRef, audioFiles, setShowPlaylist, setIsPlaying, searchTerm, setSearchTerm, showPlaylist, currentFile, loadAndPlay, setAudioFiles, pauseAudio, setCurrentFile, setCurrentTime, setDuration }) {

    // Filter song
    const filteredSongs = audioFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Remove file
    const removeSong = (fileToRemove) => {
        setAudioFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));

        if (currentFile === fileToRemove) {
            pauseAudio();
            setCurrentFile(null);
            setCurrentTime(0);
            setDuration(0);
        }
    };

    // Clear playlist
    const clearPlaylist = () => {
        if(audioRef.current) audioRef.current.pause();
        setAudioFiles([]);
        setCurrentFile(null);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    };

    // Condition style
    function bgColor(file) {
        if (currentFile?.name === file.name) {
            return 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30';
        } else {
            return 'bg-black/30';
        }
    }
    const rotate = showPlaylist ? "rotate-0" : "rotate-[180deg]"


    
    return (
        <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <List className="w-5 h-5" />
                        Playlist ({audioFiles?.length})
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setShowPlaylist(prev => !prev)} className="p-2 text-gray-400 hover:text-white transition-all">
                            <PanelBottomOpen className={`w-5 h-5 ${rotate}`} />
                        </button>
                        {audioFiles?.length > 0 && (
                            <button onClick={clearPlaylist} className="p-2 text-gray-400 hover:text-red-400 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search */}
                {audioFiles?.length > 0 && (
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="Search songs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400" />
                        </div>
                    </div>
                )}

                {/* Song List */}
                {showPlaylist && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredSongs?.length > 0
                            ?
                            (
                                filteredSongs.map((file, index) => (
                                    <div key={index} className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${bgColor(file)}`} onClick={() => loadAndPlay(file)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">{file.name.replace(/\.[^/.]+$/, "")}</p>
                                                <p className="text-gray-400 text-sm">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); removeSong(file) }} className="p-1 text-gray-400 hover:text-red-400 transition-all">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            :
                            searchTerm ? (
                                <div className="text-center py-8 text-gray-400">
                                    <Search className="w-8 h-8 mx-auto mb-2" />
                                    <p>No songs found</p>
                                </div>
                            )
                                :
                                (
                                    <div className="text-center py-8 text-gray-400">
                                        <Music className="w-8 h-8 mx-auto mb-2" />
                                        <p>No songs uploaded</p>
                                        <p className="text-sm">Upload some music to get started</p>
                                    </div>
                                )}
                    </div>
                )}
            </div>
        </div>
    )
}
