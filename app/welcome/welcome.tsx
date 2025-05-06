import { Brain, Calculator, LogIn, Star, User } from "lucide-react";

import { useNavigate } from "react-router";

export function Welcome() {
  const navigate = useNavigate()
  const hdlNavigatetoRegister = ()=>{
    navigate("/register")
  }
  const hdlNavigatetoLogin = ()=>{
    navigate("/login")
  }
  return (
    <main className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-b from-amber-300 to-amber-500 py-8">
      <div className="flex-1 flex flex-col items-center gap-8 max-w-4xl mx-auto px-4">
        <header className="w-full mb-4">
          <div className="flex justify-center items-center w-full">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-2 tracking-tight drop-shadow-md">
              Math 24: The Game
            </h1>
          </div>
          <p className="text-center text-white text-lg mt-4 max-w-2xl mx-auto font-medium drop-shadow-md">
            Challenge your math skills with the classic 24 Game. Use addition, subtraction, multiplication, and division to make 24!
          </p>
        </header>

        {/* Main Card */}
        <section className="w-full bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Welcome to Math 24
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Test your arithmetic skills in this fun and challenging game!
          </p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <button
              onClick={hdlNavigatetoLogin}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg shadow-md font-bold text-lg transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center gap-3"
            >
              <LogIn size={24} />
              Login to Play
            </button>
            
            <button
              onClick={hdlNavigatetoRegister}
              className="cursor-pointer bg-white border-2 border-purple-500 text-purple-600 py-4 px-6 rounded-lg shadow-md font-bold text-lg transition-all hover:bg-purple-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center gap-3"
            >
              <User size={24} />
              Create New Account
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Game Features */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Calculator size={24} className="text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Challenge Yourself</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Use your arithmetic skills to combine four numbers with operations to reach exactly 24.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Addition</span>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Subtraction</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Multiplication</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm">Division</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Brain size={24} className="text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Train Your Brain</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Improve mental arithmetic</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Develop problem-solving skills</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Enhance logical thinking</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Track your progress</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Star size={24} className="text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Game Features</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center py-2 px-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full text-amber-600 mr-3 font-bold">1</div>
                <span className="text-gray-700">Random challenges</span>
              </div>
              <div className="flex items-center py-2 px-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-3 font-bold">2</div>
                <span className="text-gray-700">Score tracking</span>
              </div>
              <div className="flex items-center py-2 px-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 mr-3 font-bold">3</div>
                <span className="text-gray-700">Game History</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

