import { ArrowLeft, HelpCircle, RefreshCw, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "~/stores/authStore";
import createAlert from "~/utils/createAlert";
import { actionGenerateNumber, actionSubmitSolution } from "~/api/game";

export default function Game() {
    // State variables with proper TypeScript types
    const [numbers, setNumbers] = useState<number[]>([]);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [operators, setOperators] = useState<string[]>(['+', '-', '×', '÷']);
    const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
    const [equation, setEquation] = useState<(number | string)[]>([]);
    const [equationString, setEquationString] = useState<string>("");
    const [calculationHistory, setCalculationHistory] = useState<string>("");
    const [result, setResult] = useState<number | null>(null);
    const [score, setScore] = useState<number>(0);
    const [gameCompleted, setGameCompleted] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string | number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [specialOperators, setSpecialOperators] = useState<string[]>(['(', ')', 'DEL']);
    const [currentCalculation, setCurrentCalculation] = useState<string>("");
    const [unusedNumbers, setUnusedNumbers] = useState<number[]>([]);

    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
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
                setUnusedNumbers(response.data.numbers)
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

    // Reset the game state but keep calculation history
    const resetGame = () => {
        setSelectedNumbers([]);
        setSelectedOperator(null);
        setEquation([]);
        setCurrentCalculation("");
        setResult(null);
        // Don't reset equationString and calculationHistory to keep the history
    };

    // Reset the game completely including history
    const resetGameCompletely = () => {
        setSelectedNumbers([]);
        setSelectedOperator(null);
        setEquation([]);
        setEquationString("");
        setCalculationHistory("");
        setCurrentCalculation("");
        setResult(null);
        setUnusedNumbers(numbers)
    };

    // Convert UI operator symbols to JavaScript operators for calculation and submission
    const operatorToJS = (op: string) => {
        switch (op) {
            case '+': return '+';
            case '-': return '-';
            case '×': return '*';
            case '÷': return '/';
            default: return op;
        }
    };

    // Handle number selection
    // Handle number selection
    const handleNumberClick = (num: number, index: number) => {
        // ป้องกันการเลือกตัวเลขซ้ำหรือเลือกตัวเลขที่สามก่อนเลือกตัวดำเนินการ
        if (selectedNumbers.includes(index) || (selectedOperator === null && selectedNumbers.length >= 1)) {
            return;
        }

        // เพิ่มดัชนีนี้ไปยังตัวเลขที่เลือก
        setSelectedNumbers([...selectedNumbers, index]);

        if (selectedOperator === null) {
            // การเลือกตัวเลขตัวแรก
            setEquation([num]);
            setCurrentCalculation(num.toString());

            // เก็บตัวเลขเริ่มต้นสำหรับการส่ง
            if (!equationString) {
                setEquationString(num.toString());
            }
        } else {
            // การเลือกตัวเลขตัวที่สองหลังจากเลือกตัวดำเนินการ
            const newEquation = [...equation, num];
            setEquation(newEquation);

            // อัปเดตการแสดงการคำนวณปัจจุบัน
            const displayCalculation = `${currentCalculation} ${num}`;
            setCurrentCalculation(displayCalculation);

            // คำนวณผลลัพธ์
            calculateResult(newEquation, equationString, displayCalculation);

            // รีเซ็ตการเลือกตัวดำเนินการ
            setSelectedOperator(null);
        }
    };

    // Handle operator selection
    const handleOperatorClick = (op: string) => {
        if (selectedNumbers.length !== 1 || equation.length === 0) {
            return;
        }

        setSelectedOperator(op);
        setEquation([...equation, op]);
        setCurrentCalculation(`${currentCalculation} ${op}`);
    };

    // Calculate result of the current equation
    const calculateResult = (eq: (number | string)[], eqString: string, displayCalc: string) => {
        if (eq.length !== 3) return;
        
        const num1 = eq[0] as number;
        const operator = eq[1] as string;
        const num2 = eq[2] as number;
        let calculatedResult: number;
        
        switch (operator) {
            case '+':
                calculatedResult = num1 + num2;
                break;
            case '-':
                calculatedResult = num1 - num2;
                break;
            case '×':
                calculatedResult = num1 * num2;
                break;
            case '÷':
                if (num2 === 0) {
                    createAlert("error", "Cannot divide by zero");
                    resetGame();
                    return;
                }
                calculatedResult = num1 / num2;
                break;
            default:
                return;
        }
        

        // Update calculation history with the full calculation
    const stepHistory = `${displayCalc} = ${calculatedResult}`;
    setCalculationHistory(prev => prev ? `${prev}, ${stepHistory}` : stepHistory);

        // ใช้วงเล็บกับสมการที่จะส่งไป backend เพื่อให้แน่ใจว่าลำดับการคำนวณถูกต้อง
        // แนวทาง: เมื่อมีการคำนวณครั้งที่สอง ให้ใส่วงเล็บรอบสมการเดิม
        let updatedEquationString = "";
        if (equationString && (equationString.includes("+") ||
            equationString.includes("-") ||
            equationString.includes("*") ||
            equationString.includes("/"))) {
            // ถ้ามีเครื่องหมายคำนวณอยู่แล้ว ให้ใส่วงเล็บรอบสมการเดิม
            const jsOperator = operatorToJS(operator);
            updatedEquationString = `(${equationString})${jsOperator}${num2}`;
        } else {
            // ถ้าเป็นการคำนวณครั้งแรก ไม่ต้องใส่วงเล็บ
            const jsOperator = operatorToJS(operator);
            updatedEquationString = `${equationString}${jsOperator}${num2}`;
        }
        setEquationString(updatedEquationString);
        
        // เก็บผลลัพธ์ที่คำนวณได้
        setResult(calculatedResult);

        // สำหรับการคำนวณต่อไป
        const remaining = numbers.filter((_, idx) => !selectedNumbers.includes(idx));
        setUnusedNumbers(remaining);
    
    // ถ้าไม่มีตัวเลขเหลือแล้ว หรือได้ผลลัพธ์เป็น 24 แล้ว
    if (remaining.length === 0 || Math.abs(calculatedResult - 24) < 0.001) {
        if (Math.abs(calculatedResult - 24) < 0.001) {
            createAlert("info", "You got 24! You can submit your answer now!");
        } else if (remaining.length === 0) {
            createAlert("info", "You've used all numbers. Submit to check your answer.");
        }
        
        // ให้ผู้เล่นกดปุ่ม Submit เพื่อส่งคำตอบ
        // หรือกดปุ่ม "Try New Numbers" เพื่อเริ่มใหม่
        setSelectedNumbers([]);
        setSelectedOperator(null);
        setEquation([]);
        setCurrentCalculation("");
        
        return;
    }
    
    // ถ้ายังมีตัวเลขเหลือ ให้แสดงปุ่มให้ผู้เล่นเลือกว่าจะคำนวณต่อหรือไม่
    createAlert("info", "Continue calculation with the result or start with a new number.");
        
        // แสดงผลลัพธ์เป็นตัวเลขใหม่ที่ผู้เล่นสามารถเลือกได้
        const newNumbers = [...unusedNumbers, calculatedResult];
        setNumbers(newNumbers);
        
        // รีเซ็ตสถานะการเลือกแต่เก็บประวัติไว้
        setSelectedNumbers([]);
        setSelectedOperator(null);
        setEquation([]);
        setCurrentCalculation("");
    };
    const validateFinalExpression = (expression: string) => {
        // ตรวจสอบว่าวงเล็บเปิดและปิดครบคู่กันหรือไม่
        let openCount = 0;
        let closeCount = 0;

        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '(') openCount++;
            if (expression[i] === ')') closeCount++;
        }

        // ถ้าวงเล็บไม่ครบคู่ ให้เพิ่มวงเล็บปิดที่ขาด
        if (openCount > closeCount) {
            let diff = openCount - closeCount;
            for (let i = 0; i < diff; i++) {
                expression += ')';
            }
        }

        // ตรวจสอบว่าสมการมีตัวดำเนินการครบหรือไม่
        // สมการที่สมบูรณ์ควรมีตัวดำเนินการ 3 ตัว สำหรับตัวเลข 4 ตัว
        const operators = expression.match(/[\+\-\*\/]/g) || [];
        if (operators.length < 3) {
            createAlert("error", "Incomplete equation. Please use all numbers.");
            return null;
        }

        return expression;
    };


    // Submit solution to backend
    const submitSolution = async () => {
        try {
            if (!gameId) {
                createAlert("error", "Game ID is missing");
                return;
            }

            // ตรวจสอบว่ามีสมการหรือไม่
            if (!equationString) {
                createAlert("error", "Please make a calculation first");
                return;
            }

            // ตรวจสอบและแก้ไขสมการสุดท้ายก่อนส่ง
            const finalExpression = validateFinalExpression(equationString);
            if (!finalExpression) return;

            console.log("Submitting expression:", finalExpression);

            const response = await actionSubmitSolution(token, gameId, finalExpression);

            if (response && response.data && response.data.success) {
                if (response.data.isCorrect) {
                    createAlert("success", "Great job! Your solution is correct!");
                    setScore(score + 1);
                    fetchGameNumbers(); // ดึงตัวเลขใหม่
                    resetGameCompletely(); // รีเซ็ตทั้งหมดรวมถึงประวัติ
                } else {
                    createAlert("error", "Your solution is incorrect. Try again!");
                    console.log("Submitted expression:", finalExpression);
                    console.log("Response:", response.data);
                    resetGameCompletely(); // รีเซ็ตทั้งหมดรวมถึงประวัติ
                    fetchGameNumbers(); // ดึงตัวเลขใหม่
                }
            } else {
                createAlert("error", "Failed to submit solution");
            }
        } catch (error) {
            console.error("Error submitting solution:", error);
            createAlert("error", "Failed to connect to the game server");
        }
    };

    // Skip current solution and start over
    const skipSolution = () => {
        resetGameCompletely(); // Reset all including history
        fetchGameNumbers(); // Get new numbers
    };

    const handleBackToHome = () => {
        navigate("/home");
    };

    // Start a new game with new numbers
    const startNewGame = () => {
        fetchGameNumbers();
        setGameCompleted(false);
        setScore(0);
        resetGameCompletely(); // Reset all including history
    };
    const handleSpecialOperator = (op: string) => {
        if (op === 'DEL') {
            // ลบตัวอักษรสุดท้ายของ currentCalculation
            setCurrentCalculation(prev => prev.slice(0, -1));

            // ลบตัวอักษรสุดท้ายของ equationString
            setEquationString(prev => prev.slice(0, -1));

            // ถ้า equation มีข้อมูล ให้ลบสมาชิกสุดท้าย
            if (equation.length > 0) {
                setEquation(prev => prev.slice(0, -1));
            }
        } else if (op === '(' || op === ')') {
            // เพิ่มวงเล็บลงใน currentCalculation และ equationString
            setCurrentCalculation(prev => prev + ` ${op}`);
            setEquationString(prev => prev + op);
        }
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
                            onClick={handleBackToHome}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} color="#4F46E5" />
                            <span className="text-gray-700 font-medium">Back to Home</span>
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
                            <span className="font-medium">New Numbers</span>
                        </button>
                        <button
                            onClick={() => {
                                createAlert("info", "Make 24 using all four numbers and operations (+, -, ×, ÷)");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <HelpCircle size={18} />
                            <span className="font-medium">Help</span>
                        </button>
                    </div>
                </section>

                {/* Game Board */}
                <section className="w-full bg-white rounded-xl shadow-lg p-6">
                    {gameCompleted ? (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
                            <p className="text-lg text-gray-600 mb-6">Your final score: {score}</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setGameCompleted(false);
                                        setScore(0);
                                        startNewGame();
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md font-bold transition-all hover:from-blue-600 hover:to-purple-700"
                                >
                                    Play Again
                                </button>
                                <button
                                    onClick={handleBackToHome}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-md font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Make 24 with these numbers:</h2>

                            {/* Current Equation and Result Display */}
                            <div className="mb-6">
                                {/* Current Equation */}
                                <div className="h-16 flex items-center justify-center bg-gray-100 rounded-lg text-2xl font-bold text-gray-800 mb-2">
                                    {isLoading ?
                                        <span className="text-gray-500">Loading game...</span> :
                                        currentCalculation ? currentCalculation : 'Select numbers and operators'
                                    }
                                </div>

                                {/* Calculation History */}
                                <div className="p-3 bg-gray-50 rounded-lg mb-3 min-h-12 text-gray-700">
                                    <h3 className="font-medium text-gray-800 mb-1">Calculation Steps:</h3>
                                    <div className="text-sm">
                                        {calculationHistory ? calculationHistory : 'No calculations yet'}
                                    </div>
                                </div>

                                {/* Current Result */}
                                {result !== null && (
                                    <div className="p-3 bg-blue-50 rounded-lg mb-3 text-center">
                                        <span className="text-xl font-bold text-blue-800">Current Result: {result}</span>
                                        {Math.abs(result - 24) < 0.001 && (
                                            <div className="mt-1 text-green-600 font-medium">That's 24! You can submit your answer.</div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-center gap-3 mt-4">
                                    <button
                                        onClick={submitSolution}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                        disabled={!equationString}
                                    >
                                        Submit Answer
                                    </button>
                                    <button
                                        onClick={skipSolution}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                                    >
                                        Try New Numbers
                                    </button>
                                </div>
                            </div>

                        
                           {/* Number Cards */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {numbers.map((num, index) => {
        // ตัวเลขสุดท้ายในอาร์เรย์จะเป็นผลลัพธ์จากการคำนวณ ถ้ามีตัวเลขเหลือน้อยกว่า 3 ตัว (เพราะตัวเลขเริ่มต้นคือ 4 ตัว)
        const isCalculatedResult = unusedNumbers.length < 3 && index === numbers.length - 1;
        
        return (
            <button
                key={index}
                onClick={() => handleNumberClick(num, index)}
                disabled={selectedNumbers.includes(index) || (selectedOperator === null && selectedNumbers.length >= 1 && equation.length > 0)}
                className={`h-24 flex items-center justify-center rounded-xl shadow-md text-3xl font-bold transition-all ${
                    selectedNumbers.includes(index) || (selectedOperator === null && selectedNumbers.length >= 1 && equation.length > 0)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isCalculatedResult
                            ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600 hover:shadow-lg'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
                }`}
            >
                {isCalculatedResult ? `(${num})` : num}
            </button>
        );
    })}
</div>

                            {/* Operators */}
                            <div className="grid grid-cols-4 gap-4">
                                {operators.map((op, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOperatorClick(op)}
                                        disabled={selectedOperator !== null || selectedNumbers.length !== 1 || equation.length === 0}
                                        className={`h-16 flex items-center justify-center rounded-xl shadow-md text-2xl font-bold transition-all ${selectedOperator === op
                                                ? 'bg-amber-400 text-white'
                                                : selectedOperator !== null || selectedNumbers.length !== 1 || equation.length === 0
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                            }`}
                                    >
                                        {op}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {specialOperators.map((op, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSpecialOperator(op)}
                                        className={`h-12 flex items-center justify-center rounded-xl shadow-md text-xl font-bold 
                        ${op === 'DEL'
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        {op}
                                    </button>
                                ))}
                            </div>

                        </>
                    )}
                </section>

                {/* Game Rules */}
                <section className="w-full bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <HelpCircle size={20} className="text-blue-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">How to Play</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Use all four numbers exactly once</li>
                        <li>• Use operations (+, −, ×, ÷) to make exactly 24</li>
                        <li>• Select numbers and operators in sequence</li>
                        <li>• Each calculation replaces used numbers with the result</li>
                        <li>• Click Submit when you want to check your answer</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}