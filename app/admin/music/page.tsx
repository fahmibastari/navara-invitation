"use client";

import { useState, useEffect, useCallback } from "react";
import { Music, Upload, Trash2, Loader2, CheckCircle, XCircle, X } from "lucide-react";

// Tipe data untuk musik
interface MusicItem {
    id: number;
    url: string;
}

export default function AdminMusicPage() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [musicList, setMusicList] = useState<MusicItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    // State untuk Modal Konfirmasi Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [musicToDelete, setMusicToDelete] = useState<{ id: number, url: string } | null>(null);


    // Fetch the existing music list on page load
    useEffect(() => {
        const fetchMusic = async () => {
            try {
                // Hapus pesan lama
                setError(null);
                setSuccessMessage(null);

                const response = await fetch("/api/admin/music");
                if (!response.ok) {
                    throw new Error("Failed to fetch music list");
                }
                const data = await response.json();
                setMusicList(data);
            } catch (err) {
                setError("Error fetching music list.");
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();
    }, []);

    // Handle music file upload
    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioFile(file);
            setError(null);
            setSuccessMessage(null);
            setUploading(true);

            const formData = new FormData();
            formData.append("audio", file);

            try {
                const response = await fetch("/api/admin/music", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    // Coba ambil pesan error dari body response jika ada
                    const errorData = await response.json().catch(() => ({ error: "Unknown upload error" }));
                    throw new Error(errorData.error || "File upload failed");
                }

                const data: MusicItem = await response.json();
                if (data?.url) {
                    setMusicList((prevList) => [...prevList, data]);
                    setSuccessMessage(`"${file.name}" uploaded successfully!`);
                    setAudioFile(null);
                    // Reset file input
                    e.target.value = "";
                }
            } catch (err: any) {
                console.error("Upload handler error:", err);
                setError(`Error uploading music file. (${err.message}). Please check Supabase RLS 'INSERT' policy.`);
            } finally {
                setUploading(false);
            }
        }
    };

    // Fungsi untuk membuka modal delete
    const openDeleteModal = (music: MusicItem) => {
        setMusicToDelete(music);
        setIsDeleteModalOpen(true);
    };

    // Handle deleting music (dipanggil dari modal)
    const handleDeleteMusic = async () => {
        if (!musicToDelete) return;

        setIsDeleteModalOpen(false);
        setLoading(true); // Tampilkan loading global saat delete

        try {
            const response = await fetch(`/api/admin/music?id=${musicToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown delete error" }));
                throw new Error(errorData.error || "Failed to delete music");
            }

            setMusicList((prevList) => prevList.filter((music) => music.id !== musicToDelete.id));
            setSuccessMessage("Music deleted successfully!");
            setError(null);
        } catch (err: any) {
            console.error("Delete handler error:", err);
            setError(`Error deleting music. (${err.message}).`);
        } finally {
            setLoading(false);
            setMusicToDelete(null);
        }
    };

    // Extract filename from URL
    const getFileName = (url: string) => {
        try {
            const parts = url.split("/");
            // Dapatkan bagian terakhir dari URL
            let filename = parts[parts.length - 1];
            
            // Hapus timestamp prefix yang kita tambahkan di route.ts (misalnya "1710000000-")
            const timestampRegex = /^\d{10,}-/;
            if (timestampRegex.test(filename)) {
                filename = filename.replace(timestampRegex, '');
            }
            
            return decodeURIComponent(filename.replace(/_/g, ' ')); // Ganti underscore kembali ke spasi
        } catch {
            return "Unknown file";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Music className="w-8 h-8 text-purple-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Music Manager</h1>
                    </div>
                    <p className="text-gray-600">Upload dan kelola musik latar belakang Anda</p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Musik Baru
                    </h2>
                    
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 sm:p-8 text-center hover:border-purple-500 transition-colors">
                        <input
                            type="file"
                            onChange={handleAudioUpload}
                            accept="audio/mpeg, audio/wav, audio/ogg"
                            disabled={uploading}
                            className="hidden"
                            id="audio-upload"
                        />
                        <label
                            htmlFor="audio-upload"
                            className={`cursor-pointer flex flex-col items-center gap-3 ${
                                uploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {uploading ? (
                                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                            ) : (
                                <Upload className="w-12 h-12 text-purple-600" />
                            )}
                            <div>
                                <p className="text-lg font-medium text-gray-700">
                                    {uploading ? "Mengunggah..." : "Klik untuk mengunggah file audio"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    MP3, WAV, OGG didukung
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 overflow-x-auto">
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    )}
                </div>

                {/* Music List Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        Daftar Musik ({musicList.length})
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                    ) : musicList.length === 0 ? (
                        <div className="text-center py-12">
                            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Belum ada musik yang diunggah</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Unggah file audio pertama Anda untuk memulai
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {musicList.map((music) => (
                                <div
                                    key={music.id}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                                                <Music className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 truncate">
                                                    {getFileName(music.url)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    ID: {music.id}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openDeleteModal(music)}
                                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Delete music"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <audio
                                        controls
                                        className="w-full h-10"
                                        preload="metadata"
                                    >
                                        <source src={music.url} type="audio/mpeg" />
                                        Browser Anda tidak mendukung tag audio.
                                    </audio>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && musicToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Konfirmasi Penghapusan</h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus musik "<span className="font-semibold">{getFileName(musicToDelete.url)}</span>"? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteMusic}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}