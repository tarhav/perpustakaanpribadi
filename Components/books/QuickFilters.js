import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    BookOpen, 
    Clock, 
    CheckCircle, 
    Heart, 
    Library,
    Filter
} from "lucide-react";

const quickFilters = [
    {
        key: "semua",
        label: "Semua Buku",
        icon: Library,
        color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
        activeColor: "bg-gray-600 text-white"
    },
    {
        key: "belum_dibaca",
        label: "Belum Dibaca",
        icon: Clock,
        color: "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200",
        activeColor: "bg-gray-600 text-white"
    },
    {
        key: "sedang_dibaca",
        label: "Sedang Dibaca",
        icon: BookOpen,
        color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200",
        activeColor: "bg-blue-600 text-white"
    },
    {
        key: "sudah_dibaca",
        label: "Sudah Dibaca",
        icon: CheckCircle,
        color: "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200",
        activeColor: "bg-green-600 text-white"
    },
    {
        key: "favorit",
        label: "Favorit",
        icon: Heart,
        color: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200",
        activeColor: "bg-rose-600 text-white"
    }
];

export default function QuickFilters({ books, activeFilter, onFilterChange }) {
    const getCountByStatus = (status) => {
        if (status === "semua") return books.length;
        return books.filter(book => book.status === status).length;
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Filter className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Filter Cepat</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {quickFilters.map((filter, index) => {
                    const IconComponent = filter.icon;
                    const count = getCountByStatus(filter.key);
                    const isActive = activeFilter === filter.key;
                    
                    return (
                        <motion.div
                            key={filter.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onFilterChange(filter.key)}
                                className={`w-full h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                                    isActive ? filter.activeColor : filter.color
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <IconComponent className="w-5 h-5" />
                                    <Badge 
                                        variant="secondary" 
                                        className={`${
                                            isActive 
                                                ? "bg-white/20 text-white border-white/30" 
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {count}
                                    </Badge>
                                </div>
                                <span className="text-sm font-medium text-center leading-tight">
                                    {filter.label}
                                </span>
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}