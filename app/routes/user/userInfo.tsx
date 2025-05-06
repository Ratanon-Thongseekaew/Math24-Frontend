import { ArrowLeft, User, Edit, Settings, Calendar, Book } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "~/stores/authStore";

export default function UserInfo() {
    const navigate = useNavigate();
    const payloadwithZustand = useAuthStore((state) => state.user);
    
    // Mock join date (replace with actual data from your backend)
    const joinDate = "March 15, 2025";

    // Navigation handlers
    const hdlBackToHome = () => {
        navigate("/home");
    };

    const hdlNavigatetoHistory = () => {
        navigate("/history");
    };

    return (
        <main className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-b from-amber-300 to-amber-500 py-8">
            <div className="flex-1 flex flex-col items-center gap-6 max-w-4xl mx-auto px-4">
                <header className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-2 tracking-tight drop-shadow-md">
                            User Profile
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

                {/* User Profile Card */}
                <section className="w-full bg-white rounded-xl shadow-lg p-6 mb-4">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {payloadwithZustand?.firstname?.charAt(0)}{payloadwithZustand?.lastname?.charAt(0)}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                        {payloadwithZustand?.firstname} {payloadwithZustand?.lastname}
                                    </h2>
                                    <p className="text-gray-500 text-sm">Player since {joinDate}</p>
                                </div>
                                
                                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors">
                                    <Edit size={16} />
                                    <span className="text-sm">Edit Profile</span>
                                </button>
                            </div>
                            
                            <div className="mt-4 flex gap-4">
                                <button 
                                    onClick={hdlNavigatetoHistory}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                                >
                                    <Book size={16} />
                                    <span>View History</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Details Card */}
                <div className="w-full bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <User size={22} className="text-blue-500" />
                            <h3 className="text-xl font-semibold text-gray-800">Account Details</h3>
                        </div>
                        
                        <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">First Name</span>
                                <span className="font-medium text-gray-800">
                                    {payloadwithZustand?.firstname}
                                </span>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">Last Name</span>
                                <span className="font-medium text-gray-800">
                                    {payloadwithZustand?.lastname}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">Email</span>
                                <span className="font-medium text-gray-800">
                                    {payloadwithZustand?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}