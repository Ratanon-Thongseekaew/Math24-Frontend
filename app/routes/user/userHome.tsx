import { Book, Calculator, Clock, LogOut, Settings, TrendingUp, Trophy, User } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "~/stores/authStore";
import createAlert from "~/utils/createAlert";



export default function userHome() {
    const actionLogoutWithZustand = useAuthStore((state) => state.actionLogoutWithZustand)
    const payloadwithZustand = useAuthStore((state)=>state.user)
    console.log("zustandPayload",payloadwithZustand)
    const navigate = useNavigate()
    const hdlLogout = () => {
        createAlert("success", "Successfully Logout")
        actionLogoutWithZustand()
        navigate("/")
    }
    const hdlNavigatetoGame =()=>{
        navigate("/game")
    }
    return (
        <main className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-b from-amber-300 to-amber-500 py-8">
            <div className="flex-1 flex flex-col items-center gap-8 max-w-4xl mx-auto px-4">
                <header className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-2 tracking-tight drop-shadow-md">
                            Math 24: The Game
                        </h1>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={20} color="#EF4444" />
                            <span className="text-gray-700 font-medium cursor-pointer" onClick={hdlLogout}>Logout</span>
                        </button>
                    </div>
                </header>

                <section className="w-full bg-white rounded-xl shadow-lg p-6 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome back, {payloadwithZustand?.firstname}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Ready to challenge your math skills today?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                        onClick={hdlNavigatetoGame}
                            className="cursor-pointer flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg shadow-md font-bold text-lg transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            Play Now
                        </button>

                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Game Options */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <Calculator size={24} className="text-blue-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Tutorials</h3>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                            <li >Use 4 numbers and operations to make 24</li>
                            <li >• Addition (+)</li>
                            <li >• Subtraction (−)</li>
                            <li >• Multiplication (×)</li>
                            <li >• Division (÷)</li>
                        </ul>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <User size={24} className="text-green-600 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-800">Your Profile</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Firstname:</span>
                                <span className="font-medium text-gray-800">{payloadwithZustand?.firstname}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lastname:</span>
                                <span className="font-medium text-gray-800">{payloadwithZustand?.lastname}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Game Played:</span>
                                <span className="font-medium text-gray-800">36</span>
                            </div>
                            <button
                                className="cursor-pointer mt-2 w-full text-center py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                View Detailed Profile
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <Book size={20} className="text-amber-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">Game History</h3>
                        </div>
                        <div className="space-y-3">
                            <div
                                className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <Trophy size={20} className="text-amber-500 mr-2" />
                                <span className="text-gray-700">Leaderboard</span>
                            </div>
                            <div
                                className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <Clock size={20} className="text-blue-500 mr-2" />
                                <span className="text-gray-700">Game History</span>
                            </div>
                            <div
                                className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <Book size={20} className="text-green-500 mr-2" />
                                <span className="text-gray-700">Tutorials</span>
                            </div>
                            <button
                                className="cursor-pointer mt-2 w-full text-center py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                View Detailed History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )


}

// {/* Daily Challenge */}
// <section className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
// <div className="flex justify-between items-center mb-4">
//   <h2 className="text-xl font-bold">Daily Challenge</h2>
//   <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">New</span>
// </div>
// <p className="mb-4">Solve today's special puzzle and climb the leaderboard!</p>
// <button
//   className="bg-white text-purple-600 py-2 px-6 rounded-lg shadow-md font-medium hover:bg-gray-100 transition-colors"
// >
//   Start Challenge
// </button>
// </section>