import { LogIn, User } from "lucide-react";

import { useNavigate } from "react-router";

export function Welcome() {
  const navigate = useNavigate()
  // const hdlNavigatetoRegister = ()=>{
  //   navigate()
  // }
  // const hdlNavigatetoLogin = ()=>{
  //   navigate()
  // }
  return (
    <main className="flex items-center justify-center pt-16 pb-4 w-screen h-screen bg-gradient-to-b from-amber-300 to-amber-500">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div>
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text py-4 mb-2 tracking-tight drop-shadow-md">Math 24: The Game</h1>
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4 bg-gray-100">
            <p className="leading-6 font-bold text-gray-700  text-center items-center text-2xl">
              Let's Start !
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <User size={30} color="#4F46E5" />
                <p className="font-medium text-gray-700 text-[14px] cursor-pointer">Register</p>
              </div>
              <div className="flex gap-4 items-center mb-3">
                <LogIn size={30} color="#16A34A" />
                <p className="font-medium text-gray-700 text-[14px] cursor-pointer">Login</p>
              </div>
            
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}

