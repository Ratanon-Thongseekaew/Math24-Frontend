import { ArrowLeft, HelpCircle, RefreshCw, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "~/stores/authStore";
import createAlert from "~/utils/createAlert";
import { actionGenerateNumber, actionSubmitSolution } from "~/api/game";

export default function Game() {
    // State variables with proper TypeScript types
    const [numbers, setNumbers] = useState<number[]>([]);
    const [equation, setEquation] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [gameId, setGameId] = useState<string | number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);

    // Get numbers from backend API
    const fetchGameNumbers = async () => {
        try {
            setIsLoading(true);

            if (!token) {
                createAlert("error", "Authentication token is missing");
                setIsLoading(false);
                return;
            }
            const response = await actionGenerateNumber(token);
            if (response && response.data && response.data.success) {
                setNumbers(response.data.numbers);
                setGameId(response.data.gameId);
            } else {
                createAlert("error", "Failed to generate game numbers");
            }
            setIsLoading(false);
            resetGame();
        } catch (error) {
            console.error("Error fetching game numbers:", error);
            createAlert("error", "Failed to connect to the game server");
            setIsLoading(false);
        }
    };

    // Initialize the game
    useEffect(() => {
        fetchGameNumbers();
    }, []);

    // Reset the game
    const resetGame = () => {
        setEquation("");
    };

    // hdl input on change
    const hdlEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquation(e.target.value);
    };
    // Submit solution to backend
    const submitSolution = async () => {
        try {
            if (!token) {
                createAlert("error", "Authentication token is missing");
                return;
            }
            if (!gameId) {
                createAlert("error", "Game ID is missing");
                return;
            }

            // ตรวจสอบ equation
            if (!equation) {
                createAlert("error", "Please enter an equation");
                return;
            }

            console.log("Submitting expression:", equation);

            const response = await actionSubmitSolution(token, gameId, equation);

            if (response && response.data && response.data.success) {
                if (response.data.isCorrect) {
                    createAlert("success", "Great job! Your solution is correct!");
                    setScore(score + 1);
                    fetchGameNumbers(); // ดึงตัวเลขใหม่
                    resetGame(); 
                } else {
                    createAlert("error", "Your solution is incorrect. Try again!");
                    console.log("Submitted expression:", equation);
                    console.log("Response:", response.data);
                }
            } else {
                createAlert("error", "Failed to submit solution");
            }
        } catch (error) {
            console.error("Error submitting solution:", error);
            createAlert("error", "Failed to connect to the game server");
        }
    };

    const hdlBackToHome = () => {
        navigate("/home");
    };

    // Start a new game with new numbers
    const startNewGame = () => {
        fetchGameNumbers();
        setScore(0);
        resetGame(); 
    };

    return (
        <main className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-b from-amber-300 to-amber-500 py-8">
            <div className="flex-1 flex flex-col items-center gap-6 max-w-4xl mx-auto px-4">
                <header className="w-full">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-2 tracking-tight drop-shadow-md">
                            Math 24 Game
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

                {/* Game Statistics */}
                <section className="w-full bg-white rounded-xl shadow-lg p-4">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Check size={20} className="text-green-500" />
                            <span className="text-gray-800 font-medium">Score: {score}</span>
                        </div>
                        <button
                            onClick={startNewGame}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <RefreshCw size={18} />
                            <span className="font-medium cursor-pointer">New Numbers</span>
                        </button>
                        <button
                            onClick={() => {
                                createAlert("info", "Make 24 using all four numbers and operations (+, -, *, /)");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <HelpCircle size={18} />
                            <span className="cursor-pointer font-medium">Help</span>
                        </button>
                    </div>
                </section>

                {/* Game Board */}
                <section className="w-full bg-white rounded-xl shadow-lg p-6">
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Make 24 with these numbers:</h2>

                            {/* Display the numbers to use */}
                            <div className="flex justify-center flex-wrap gap-4 mb-6">
                                {isLoading ? (
                                    <div className="text-gray-500">Loading numbers...</div>
                                ) : (
                                    numbers.slice(0, 4).map((num, index) => (
                                        <div
                                            key={index}
                                            className="w-20 h-20 flex items-center justify-center rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white text-3xl font-bold"
                                        >
                                            {num}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Equation Input */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter Your Equation:</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Use the 4 numbers above with operations (+, -, *, /) to make 24. 
                                    <br />Example: (8+8)*3/1 = 24
                                </p>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={equation}
                                        onChange={hdlEquationChange}
                                        placeholder="Enter your equation..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                    />
                                    <button
                                        onClick={resetGame}
                                        className="cursor-pointer px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex justify-center gap-3 mt-6">
                                    <button
                                        onClick={submitSolution}
                                        className="cursor-pointer px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-lg"
                                        disabled={!equation}
                                    >
                                        Submit Answer
                                    </button>
                                </div>
                            </div>
                        </>
                    
                </section>

                {/* Game Rules */}
                <section className="w-full bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <HelpCircle size={20} className="text-blue-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">How to Play</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Use all four numbers exactly once</li>
                        <li>• Use operations (+, -, *, /) to make exactly 24</li>
                        <li>• Use parentheses to control the order of operations</li>
                        <li>• Example: If you have 3, 5, 7, 8, a valid solution could be (3+5)*(8-7) = 24</li>
                        <li>• Click Submit when you want to check your answer</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}