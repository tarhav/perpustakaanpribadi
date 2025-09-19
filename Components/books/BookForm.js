
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Save, X, BookOpen, Upload, FileCheck, Loader2, Paperclip } from "lucide-react";
import { UploadPrivateFile } from "@/integrations/Core";

const genres = [
    "fiksi", "non-fiksi", "misteri", "romantis", "fantasi", "sejarah", 
    "biografi", "sains", "teknologi", "bisnis", "self-help", "horor", 
    "thriller", "komedi", "drama", "petualangan"
];

const statuses = [
    { value: "belum_dibaca", label: "Belum Dibaca" },
    { value: "sedang_dibaca", label: "Sedang Dibaca" },
    { value: "sudah_dibaca", label: "Sudah Dibaca" },
    { value: "favorit", label: "Favorit" }
];

export default function BookForm({ book, onSubmit, onCancel }) {
    const [formData, setFormData] = React.useState(book || {
        title: "",
        author: "",
        genre: "fiksi",
        status: "belum_dibaca",
        year: "",
        pages: "",
        publisher: "",
        isbn: "",
        description: "",
        cover_url: "",
        rating: "",
        notes: "",
        ebook_uri: ""
    });

    const [ebookFile, setEbookFile] = React.useState(null);
    const [uploadStatus, setUploadStatus] = React.useState('idle'); // idle, uploading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let finalBookData = { ...formData };

        // Convert string numbers to actual numbers
        if (finalBookData.year) finalBookData.year = parseInt(finalBookData.year);
        if (finalBookData.pages) finalBookData.pages = parseInt(finalBookData.pages);
        if (finalBookData.rating) finalBookData.rating = parseInt(finalBookData.rating);

        // Handle file upload
        if (ebookFile) {
            try {
                setUploadStatus('uploading');
                const { file_uri } = await UploadPrivateFile({ file: ebookFile });
                finalBookData.ebook_uri = file_uri;
                setUploadStatus('success');
            } catch (error) {
                console.error("Upload error:", error);
                setUploadStatus('error');
                // Optionally show an error message to the user
                return; // Stop submission on upload failure
            }
        }
        
        onSubmit(finalBookData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEbookFile(file);
            setUploadStatus('idle'); // Reset status when a new file is selected
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                            </div>
                            {book ? "Edit Buku" : "Tambah Buku Baru"}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCancel}
                            className="hover:bg-white/50"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Judul Buku *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="Masukkan judul buku"
                                    required
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                                    Penulis *
                                </Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => handleChange('author', e.target.value)}
                                    placeholder="Nama penulis"
                                    required
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>
                        </div>

                        {/* Genre and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Genre</Label>
                                <Select
                                    value={formData.genre}
                                    onValueChange={(value) => handleChange('genre', value)}
                                >
                                    <SelectTrigger className="border-gray-200 focus:border-amber-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genres.map((genre) => (
                                            <SelectItem key={genre} value={genre}>
                                                {genre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange('status', value)}
                                >
                                    <SelectTrigger className="border-gray-200 focus:border-amber-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Publication Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                                    Tahun Terbit
                                </Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => handleChange('year', e.target.value)}
                                    placeholder="2024"
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pages" className="text-sm font-medium text-gray-700">
                                    Jumlah Halaman
                                </Label>
                                <Input
                                    id="pages"
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => handleChange('pages', e.target.value)}
                                    placeholder="350"
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
                                    Rating (1-5)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => handleChange('rating', e.target.value)}
                                        className="border-gray-200 focus:border-amber-300"
                                    />
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < parseInt(formData.rating) 
                                                        ? "fill-yellow-400 text-yellow-400" 
                                                        : "text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Publisher and ISBN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="publisher" className="text-sm font-medium text-gray-700">
                                    Penerbit
                                </Label>
                                <Input
                                    id="publisher"
                                    value={formData.publisher}
                                    onChange={(e) => handleChange('publisher', e.target.value)}
                                    placeholder="Nama penerbit"
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="isbn" className="text-sm font-medium text-gray-700">
                                    ISBN
                                </Label>
                                <Input
                                    id="isbn"
                                    value={formData.isbn}
                                    onChange={(e) => handleChange('isbn', e.target.value)}
                                    placeholder="978-0123456789"
                                    className="border-gray-200 focus:border-amber-300"
                                />
                            </div>
                        </div>

                        {/* Cover URL */}
                        <div className="space-y-2">
                            <Label htmlFor="cover_url" className="text-sm font-medium text-gray-700">
                                URL Cover Buku
                            </Label>
                            <Input
                                id="cover_url"
                                value={formData.cover_url}
                                onChange={(e) => handleChange('cover_url', e.target.value)}
                                placeholder="https://example.com/cover.jpg"
                                className="border-gray-200 focus:border-amber-300"
                            />
                        </div>

                        {/* E-book Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="ebook-upload" className="text-sm font-medium text-gray-700">
                                Unggah E-book (.pdf, .epub)
                            </Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="ebook-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.epub"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="ebook-upload"
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Pilih File
                                </label>
                                {ebookFile ? (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <FileCheck className="w-4 h-4" />
                                        <span className="truncate max-w-xs">{ebookFile.name}</span>
                                    </div>
                                ) : formData.ebook_uri && (
                                     <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Paperclip className="w-4 h-4" />
                                        <span>File sudah terlampir</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Deskripsi/Sinopsis
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Deskripsi singkat tentang buku ini..."
                                rows={3}
                                className="border-gray-200 focus:border-amber-300"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                                Catatan Pribadi
                            </Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="Catatan atau review pribadi..."
                                rows={2}
                                className="border-gray-200 focus:border-amber-300"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="flex-1 border-gray-200 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                                disabled={uploadStatus === 'uploading'}
                            >
                                {uploadStatus === 'uploading' ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                {uploadStatus === 'uploading' ? 'Mengunggah...' : book ? 'Update Buku' : 'Simpan Buku'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
