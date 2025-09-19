
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    BookOpen, 
    Clock, 
    CheckCircle, 
    Heart, 
    Star,
    Edit3,
    Calendar,
    FileText,
    User,
    BookUp // Added BookUp icon
} from "lucide-react";

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

export default function BookCard({ book, onEdit, onStatusChange, onViewDetails }) {
    const StatusIcon = statusConfig[book.status]?.icon || Clock;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card 
                className="group h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => onViewDetails(book)}
            >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
                    {book.cover_url ? (
                        <img 
                            src={book.cover_url} 
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-amber-300" />
                        </div>
                    )}
                    {book.ebook_uri && ( // Conditional E-book badge
                        <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700 shadow-md border-0">
                                <BookUp className="w-3 h-3 mr-1" />
                                E-book
                            </Badge>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(book);
                            }}
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2">
                            {book.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="line-clamp-1">{book.author}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <div className="space-y-4">
                        {/* Status and Genre */}
                        <div className="flex gap-2 flex-wrap">
                            <Badge 
                                className={`${statusConfig[book.status]?.color} border font-medium`}
                            >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[book.status]?.label}
                            </Badge>
                            <Badge 
                                variant="secondary"
                                className={`${genreColors[book.genre]} border-0 font-medium`}
                            >
                                {book.genre}
                            </Badge>
                        </div>

                        {/* Rating */}
                        {book.rating && (
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < book.rating 
                                                ? "fill-yellow-400 text-yellow-400" 
                                                : "text-gray-200"
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">
                                    {book.rating}/5
                                </span>
                            </div>
                        )}

                        {/* Book Details */}
                        <div className="space-y-1 text-sm text-gray-500">
                            {book.year && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{book.year}</span>
                                </div>
                            )}
                            {book.pages && (
                                <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    <span>{book.pages} halaman</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {book.description && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {book.description}
                            </p>
                        )}

                        {/* Status Change Buttons */}
                        <div className="flex gap-2 pt-2">
                            {book.status !== 'sudah_dibaca' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(book, 'sudah_dibaca');
                                    }}
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Selesai
                                </Button>
                            )}
                            {book.status !== 'favorit' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(book, 'favorit');
                                    }}
                                >
                                    <Heart className="w-3 h-3 mr-1" />
                                    Favorit
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
