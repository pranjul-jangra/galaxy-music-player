import { Upload } from "lucide-react"


export default function UploadFiles({ fileInputRef, setAudioFiles }) {

    // Upload musics
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        setAudioFiles((prevFiles) => {
            const existingFiles = new Set(prevFiles.map(file => `${file.name}-${file.size}`));

            const uniqueNewFiles = newFiles.filter(file => {
                return !existingFiles.has(`${file.name}-${file.size}`);
            });
            return [...prevFiles, ...uniqueNewFiles];
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    return (
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-cyan-400 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Audio files only</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        </div>
    )
}
