import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import type { z } from "zod";
import { actionLogin } from "~/api/auth";
import useAuthStore from "~/stores/authStore";
import createAlert from "~/utils/createAlert";
import FormInput from "~/utils/formInput";
import { loginUser } from "~/utils/validators";


type LoginData = z.infer<typeof loginUser>;

export default function Login () {

const actionLoginWithZustand = useAuthStore((state)=>state.actionLoginWithZustand)
const navigate = useNavigate()
    const { register, handleSubmit, formState, reset } = useForm({
        resolver: zodResolver(loginUser)
    })
    const { isSubmitting, errors } = formState;
  const hdlSubmit = async (value: LoginData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await actionLoginWithZustand(value)
        console.log("actionwithZustand check:", res)
        if(res.success){
            reset()
            createAlert("success",`Welcome back, ${res.firstname}`)
            navigate("/home")
          }else
          createAlert("info", "Invalid Email or Password")
          console.log(res.error)
    }
    return(
        <div className="flex w-full h-full justify-center items-center min-h-screen bg-gray-50 bg-gradient-to-b from-amber-300 to-amber-500">
            <div className="w-96 border border-gray-200 p-8 rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>
                <form onSubmit={handleSubmit(hdlSubmit)} className="space-y-5">
                    <FormInput
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        register={register}
                        errors={errors}
                    />
                    <FormInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        errors={errors}
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-md 
        font-medium transition-all duration-300 hover:from-blue-600 hover:to-purple-700 
        hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
        disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            "Login In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
    
    }