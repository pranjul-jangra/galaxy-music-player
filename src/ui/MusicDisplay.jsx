import { Music } from 'lucide-react'


export default function MusicDisplay({ currentFile }) {
    return (
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white truncate">
                    {currentFile.name.replace(/\.[^/.]+$/, "")}
                </h3>
                <p className="text-gray-400">Now Playing</p>
            </div>
        </div>
    )
}
