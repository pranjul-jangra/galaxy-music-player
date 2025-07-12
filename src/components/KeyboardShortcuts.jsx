export default function KeyboardShortcuts() {
    return (
        <div className="mt-8 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm *:flex *:items-center *:gap-4 *:border *:py-2 *:px-3 *:border-black/20 *:rounded-lg *:bg-black/30">
                <div>
                    <span className="text-gray-400">Play/Pause - </span>
                    <span className="text-white">Space</span>
                </div>
                <div>
                    <span className="text-gray-400">Next Track - </span>
                    <span className="text-white">→</span>
                </div>
                <div>
                    <span className="text-gray-400">Previous Track - </span>
                    <span className="text-white">←</span>
                </div>
                <div>
                    <span className="text-gray-400">Volume Up - </span>
                    <span className="text-white">↑</span>
                </div>
                <div>
                    <span className="text-gray-400">Volume Down - </span>
                    <span className="text-white">↓</span>
                </div>
                <div>
                    <span className="text-gray-400">Mute - </span>
                    <span className="text-white">M</span>
                </div>
                <div>
                    <span className="text-gray-400">Shuffle - </span>
                    <span className="text-white">S</span>
                </div>
                <div>
                    <span className="text-gray-400">Repeat - </span>
                    <span className="text-white">R</span>
                </div>
            </div>
        </div>
    )
}
