
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Book } from "@/entities/Book";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Plus, Library, Sparkles, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import BookCard from "../Components/books/Bookcard";
import BookForm from "../components/books/BookForm";
import SearchFilters from "../components/books/SearchFilters";
import BookDetail from "../components/books/BookDetail";
import QuickFilters from "../components/books/QuickFilters";

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        status: "semua",
        genre: "semua"
    });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user and books concurrently
                const userPromise = User.me();
                const booksPromise = Book.list("-updated_date");

                const [user, fetchedBooks] = await Promise.all([userPromise, booksPromise]);
                
                setCurrentUser(user);
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Error loading data:", error);
                // RLS will prevent data from showing if not logged in, which is fine.
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const fetchedBooks = await Book.list("-updated_date");
            setBooks(fetchedBooks);
        } catch (error) {
            console.error("Error loading books:", error);
        }
        setLoading(false);
    };

    const handleSubmit = async (bookData) => {
        try {
            if (editingBook) {
                await Book.update(editingBook.id, bookData);
            } else {
                await Book.create(bookData);
            }
            setShowForm(false);
            setEditingBook(null);
            loadBooks();
        } catch (error) {
            console.error("Error saving book:", error);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setShowForm(true);
        setSelectedBook(null); // Close detail view
    };

    const handleViewDetails = (book) => {
        setSelectedBook(book);
    };

    const handleCloseDetail = () => {
        setSelectedBook(null);
    };

    const handleStatusChange = async (book, newStatus) => {
        try {
            await Book.update(book.id, { ...book, status: newStatus });
            loadBooks();
        } catch (error) {
            console.error("Error updating book status:", error);
        }
    };

    const handleQuickFilter = (status) => {
        setFilters(prev => ({
            ...prev,
            status: status
        }));
    };

    const handleAdvancedFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            status: "semua",
            genre: "semua"
        });
    };

    const filteredBooks = books.filter(book => {
        const searchMatch = !filters.search || 
            book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            book.author.toLowerCase().includes(filters.search.toLowerCase());
        
        const statusMatch = filters.status === "semua" || book.status === filters.status;
        const genreMatch = filters.genre === "semua" || book.genre === filters.genre;
        
        return searchMatch && statusMatch && genreMatch;
    });

    const hasActiveFilters = filters.search || filters.genre !== "semua";
    const activeStatusFilter = filters.status;

    const getStats = () => {
        return {
            total: books.length,
            sudah_dibaca: books.filter(b => b.status === 'sudah_dibaca').length,
            sedang_dibaca: books.filter(b => b.status === 'sedang_dibaca').length,
            favorit: books.filter(b => b.status === 'favorit').length
        };
    };

    const stats = getStats();
    const userName = currentUser?.full_name?.split(' ')[0] || "Pribadi";

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-amber-600">Memuat koleksi buku...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                            <Library className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                            Perpustakaan {userName}
                        </h1>
                        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Kelola koleksi buku Anda dengan mudah dan elegan
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Buku</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                        <div className="text-2xl font-bold text-green-600 mb-1">{stats.sudah_dibaca}</div>
                        <div className="text-sm text-gray-600">Sudah Dibaca</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{stats.sedang_dibaca}</div>
                        <div className="text-sm text-gray-600">Sedang Dibaca</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                        <div className="text-2xl font-bold text-rose-600 mb-1">{stats.favorit}</div>
                        <div className="text-sm text-gray-600">Favorit</div>
                    </div>
                </motion.div>

                {/* Add Book Button */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mb-8"
                >
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-medium rounded-2xl"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Buku Baru
                    </Button>
                </motion.div>

                {/* Quick Status Filters */}
                <QuickFilters 
                    books={books}
                    activeFilter={activeStatusFilter}
                    onFilterChange={handleQuickFilter}
                />

                {/* Advanced Search and Filters */}
                <SearchFilters 
                    onFilterChange={handleAdvancedFilterChange}
                    filters={filters}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {/* Active Filter Indicator */}
                {(activeStatusFilter !== "semua" || hasActiveFilters) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">
                                        Menampilkan: {filteredBooks.length} dari {books.length} buku
                                        {activeStatusFilter !== "semua" && (
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                {activeStatusFilter === "belum_dibaca" && "Belum Dibaca"}
                                                {activeStatusFilter === "sedang_dibaca" && "Sedang Dibaca"}
                                                {activeStatusFilter === "sudah_dibaca" && "Sudah Dibaca"}
                                                {activeStatusFilter === "favorit" && "Favorit"}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        handleClearFilters();
                                        handleQuickFilter("semua");
                                    }}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredBooks.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <BookCard
                                        book={book}
                                        onEdit={handleEdit}
                                        onStatusChange={handleStatusChange}
                                        onViewDetails={handleViewDetails}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Library className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {books.length === 0 ? "Koleksi Kosong" : "Tidak Ada Hasil"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {books.length === 0 
                                    ? "Mulai membangun perpustakaan pribadi Anda dengan menambah buku pertama"
                                    : activeStatusFilter !== "semua"
                                    ? `Belum ada buku dengan status "${
                                        activeStatusFilter === "belum_dibaca" ? "Belum Dibaca" :
                                        activeStatusFilter === "sedang_dibaca" ? "Sedang Dibaca" :
                                        activeStatusFilter === "sudah_dibaca" ? "Sudah Dibaca" :
                                        "Favorit"
                                      }"`
                                    : "Tidak ada buku yang sesuai dengan filter yang dipilih"
                                }
                            </p>
                            {books.length === 0 && (
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Buku Pertama
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Form Modal */}
                <AnimatePresence>
                    {showForm && (
                        <BookForm
                            book={editingBook}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingBook(null);
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Book Detail Modal */}
                <AnimatePresence>
                    {selectedBook && (
                        <BookDetail
                            book={selectedBook}
                            onClose={handleCloseDetail}
                            onEdit={handleEdit}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
