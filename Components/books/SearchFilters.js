import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const genreOptions = [
    { value: "semua", label: "Semua Genre" },
    { value: "fiksi", label: "Fiksi" },
    { value: "non-fiksi", label: "Non-Fiksi" },
    { value: "misteri", label: "Misteri" },
    { value: "romantis", label: "Romantis" },
    { value: "fantasi", label: "Fantasi" },
    { value: "sejarah", label: "Sejarah" },
    { value: "biografi", label: "Biografi" },
    { value: "sains", label: "Sains" },
    { value: "teknologi", label: "Teknologi" },
    { value: "bisnis", label: "Bisnis" },
    { value: "self-help", label: "Self-Help" },
    { value: "horor", label: "Horor" },
    { value: "thriller", label: "Thriller" },
    { value: "komedi", label: "Komedi" },
    { value: "drama", label: "Drama" },
    { value: "petualangan", label: "Petualangan" }
];

export default function SearchFilters({ onFilterChange, filters, hasActiveFilters, onClearFilters }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Pencarian & Filter Lanjutan</h2>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Reset Filter
                    </Button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Cari judul atau penulis..."
                        value={filters.search || ""}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="pl-10 border-gray-200 focus:border-blue-300 bg-white"
                    />
                </div>

                {/* Genre Filter */}
                <Select
                    value={filters.genre || "semua"}
                    onValueChange={(value) => onFilterChange({ ...filters, genre: value })}
                >
                    <SelectTrigger className="border-gray-200 focus:border-blue-300 bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {genreOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}