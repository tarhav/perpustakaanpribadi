    
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    X, 
    BookOpen, 
    User, 
    Calendar, 
    FileText, 
    Building, 
    Hash, 
    Star,
    Clock,
    CheckCircle,
    Heart,
    Edit3,
    ExternalLink,
    BookUp, // Added new icon
    Download, // Added new icon
    Loader2 // Added new icon
} from "lucide-react";
import { CreateFileSignedUrl } from "@/integrations/Core"; // Added new import

const statusConfig = {
    belum_dibaca: { 
        label: "Belum Dibaca", 
        icon: Clock, 
        color: "bg-gray-100 text-gray-700 border-gray-200" 
    },
    sedang_dibaca: { 
        label: "Sedang Dibaca", 
        icon: BookOpen, 
        color: "bg-blue-100 text-blue-700 border-blue-200" 
    },
    sudah_dibaca: { 
        label: "Sudah Dibaca", 
        icon: CheckCircle, 
        color: "bg-green-100 text-green-700 border-green-200" 
    },
    favorit: { 
        label: "Favorit", 
        icon: Heart, 
        color: "bg-rose-100 text-rose-700 border-rose-200" 
    }
};

const genreColors = {
    fiksi: "bg-purple-50 text-purple-700",
    "non-fiksi": "bg-blue-50 text-blue-700",
    misteri: "bg-gray-50 text-gray-700",
    romantis: "bg-pink-50 text-pink-700",
    fantasi: "bg-indigo-50 text-indigo-700",
    sejarah: "bg-amber-50 text-amber-700",
    biografi: "bg-teal-50 text-teal-700",
    sains: "bg-cyan-50 text-cyan-700",
    teknologi: "bg-slate-50 text-slate-700",
    bisnis: "bg-emerald-50 text-emerald-700",
    "self-help": "bg-orange-50 text-orange-700",
    horor: "bg-red-50 text-red-700",
    thriller: "bg-violet-50 text-violet-700",
    komedi: "bg-yellow-50 text-yellow-700",
    drama: "bg-rose-50 text-rose-700",
    petualangan: "bg-lime-50 text-lime-700"
};

export default function BookDetail({ book, onClose, onEdit }) {
    const StatusIcon = statusConfig[book.status]?.icon || Clock;
    const [isDownloading, setIsDownloading] = React.useState(false); // New state for download status

    const handleDownload = async () => {
        if (!book.ebook_uri) return;
        
        setIsDownloading(true);
        try {
            const { signed_url } = await CreateFileSignedUrl({ file_uri: book.ebook_uri });
            
            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = signed_url;
            
            // Suggest a filename
            const fileExtension = book.ebook_uri.split('.').pop();
            const fileName = `${book.title.replace(/ /g, '_')}.${fileExtension}`; // Sanitize title for filename
            link.setAttribute('download', fileName);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Download error:", error);
            // Optionally show an error to the user
            alert("Gagal mengunduh e-book. Silakan coba lagi.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Card className="bg-white shadow-2xl border-0 overflow-hidden">
                    {/* Header */}
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <BookOpen className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {book.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{book.author}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge className={`${statusConfig[book.status]?.color} border font-medium`}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusConfig[book.status]?.label}
                                        </Badge>
                                        <Badge variant="secondary" className={`${genreColors[book.genre]} border-0 font-medium`}>
                                            {book.genre}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(book)}
                                    className="hover:bg-white/50"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="hover:bg-white/50"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="grid lg:grid-cols-3 gap-0">
                            {/* Cover Image */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-orange-100 p-8 flex items-center justify-center">
                                {book.cover_url ? (
                                    <img 
                                        src={book.cover_url} 
                                        alt={book.title}
                                        className="max-w-full max-h-80 object-cover rounded-lg shadow-lg"
                                    />
                                ) : (
                                    <div className="w-48 h-64 bg-white rounded-lg shadow-lg flex items-center justify-center">
                                        <BookOpen className="w-20 h-20 text-amber-300" />
                                    </div>
                                )}
                            </div>

                            {/* Book Information */}
                            <div className="lg:col-span-2 p-8">
                                <div className="space-y-6">
                                    {/* Rating */}
                                    {book.rating && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${
                                                                i < book.rating 
                                                                    ? "fill-yellow-400 text-yellow-400" 
                                                                    : "text-gray-200"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {book.rating}/5 bintang
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {book.description && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {book.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* E-book Download Button */}
                                    {book.ebook_uri && (
                                        <div className="pt-2">
                                            <Button 
                                                onClick={handleDownload} 
                                                disabled={isDownloading}
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                            >
                                                {isDownloading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4 mr-2" />
                                                )}
                                                {isDownloading ? 'Mempersiapkan...' : 'Unduh E-book'}
                                            </Button>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Book Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Informasi Buku</h3>
                                            
                                            {book.year && (
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Tahun Terbit</div>
                                                        <div className="font-medium">{book.year}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {book.pages && (
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Jumlah Halaman</div>
                                                        <div className="font-medium">{book.pages} halaman</div>
                                                    </div>
                                                </div>
                                            )}

                                            {book.publisher && (
                                                <div className="flex items-center gap-3">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">Penerbit</div>
                                                        <div className="font-medium">{book.publisher}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {book.isbn && (
                                                <div className="flex items-center gap-3">
                                                    <Hash className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm text-gray-500">ISBN</div>
                                                        <div className="font-medium font-mono">{book.isbn}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Personal Notes */}
                                        {book.notes && (
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-gray-900">Catatan Pribadi</h3>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {book.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cover Link */}
                                    {book.cover_url && (
                                        <div className="pt-4">
                                            <a
                                                href={book.cover_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Lihat Cover Asli
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
