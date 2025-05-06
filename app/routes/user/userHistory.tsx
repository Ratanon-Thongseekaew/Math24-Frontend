import { ArrowLeft, Book, Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "~/stores/authStore";
import { useState, useEffect } from "react";
import createAlert from "~/utils/createAlert";
import { actionGetHistory } from "~/api/history";

export default function UserHistory() {
    const navigate = useNavigate();
    const payloadwithZustand = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 5;

    // Fetch history data 
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                
                if (!token) {
                    console.log("missing token:",token)
                    return;
                }
                
                console.log('Requesting page:', currentPage, 'with limit:', pageSize);
                const response = await actionGetHistory(token, currentPage, pageSize);
                console.log("history response:", response);
                
                if (response && response.data && response.data.history) {
                    setHistory(response.data.history);
                    if (response.data.totalCount) {
                        setTotalCount(response.data.totalCount);
                        //total count divide pagesize
                        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
                    } else {
                        setTotalPages(Math.max(currentPage, 1));
                    }
                } else {
                    createAlert("error", "Failed to fetch history data");
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                createAlert("error", "Failed to connect to the server");
                setIsLoading(false);
            }
        };
        
        fetchHistory();
    }, [token, currentPage]);

    // Navigation handlers
    const hdlBackToHome = () => {
        navigate("/home");
    };
    
    // Format the numbers array from the backend
    const formatNumbers = (numbersString:any) => {
        try {
            return JSON.parse(numbersString);
        } catch (error) {
            console.error("Error parsing numbers:", error);
            return [];
        }
    };
    
    // Handle pagination
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <main className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-b from-amber-300 to-amber-500 py-8">
            <div className="flex-1 flex flex-col items-center gap-6 max-w-5xl mx-auto px-4">
                <header className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-2 tracking-tight drop-shadow-md">
                            Game History
                        </h1>
                        <button
                            onClick={hdlBackToHome}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} color="#4F46E5" />
                            <span className="text-gray-700 font-medium cursor-pointer">Back to Home</span>
                        </button>
                    </div>
                </header>

                {/* Game History */}
                <section className="w-full bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Book size={22} className="text-purple-500" />
                            <h3 className="text-xl font-semibold text-gray-800">{payloadwithZustand?.firstname}'s History</h3>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                        </div>
                    ) : history && history.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numbers</th>
                                            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Equation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((game) => (
                                            <tr key={game.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2 text-sm text-gray-600 flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    {new Date(game.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="flex gap-1">
                                                        {formatNumbers(game.numbers).map((num, index) => (
                                                            <span key={index} className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-100 text-blue-600 text-sm font-medium">
                                                                {num}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-sm font-medium text-gray-800">{game.expression}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex flex-col items-center mt-6">
                                {/* Display pagination stats */}
                                <div className="text-sm text-gray-500 mb-3">
                                    {totalCount > 0 && (
                                        <span>
                                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} History
                                        </span>
                                    )}
                                </div>
                                
                                {/* Pagination controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        
                                        {/* Page number indicators */}
                                        {totalPages <= 5 ? (
                                            // Show all page numbers if 5 or fewer pages
                                            Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer ${
                                                        currentPage === page
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))
                                        ) : (
                                            // Show limited page numbers with ellipsis for many pages
                                            <>
                                                {/* First page */}
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                                                        currentPage === 1
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    1
                                                </button>
                                                
                                                {/* Ellipsis */}
                                                {currentPage > 3 && (
                                                    <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
                                                )}
                                                
                                                {/* Pages around current page */}
                                                {Array.from(
                                                    { length: Math.min(3, totalPages - 2) },
                                                    (_, i) => {
                                                        let pageNum;
                                                        if (currentPage <= 2) {
                                                            pageNum = i + 2; // Show 2, 3, 4 when on page 1 or 2
                                                        } else if (currentPage >= totalPages - 1) {
                                                            pageNum = totalPages - 3 + i; // Show last 3 pages when near end
                                                        } else {
                                                            pageNum = currentPage - 1 + i; // Show pages around current
                                                        }
                                                        
                                                        // Only show if within range and not first or last page
                                                        if (pageNum > 1 && pageNum < totalPages) {
                                                            return (
                                                                <button
                                                                    key={pageNum}
                                                                    onClick={() => setCurrentPage(pageNum)}
                                                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                                                                        currentPage === pageNum
                                                                        ? "bg-purple-100 text-purple-600"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                    }`}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            );
                                                        }
                                                        return null;
                                                    }
                                                ).filter(Boolean)}
                                                
                                                {/* Ellipsis if needed */}
                                                {currentPage < totalPages - 2 && (
                                                    <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
                                                )}
                                                
                                                {/* Last page */}
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                                                        currentPage === totalPages
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}
                                        
                                        <button 
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <Book size={48} className="text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No history found</p>
                            <p className="text-sm">Play some games to see your history here!</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}