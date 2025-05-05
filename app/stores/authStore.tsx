import { create } from "zustand"
import { actionLogin } from "app/api/auth"
import { persist } from "zustand/middleware"

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}
interface LoginInput {
    email: string;
    password: string;
}
interface AuthStore {
    user: User | null;
    token: string | null;
    actionLoginWithZustand: (value: LoginInput) => Promise<{
        success: boolean;
        firstname?: string;
        error?: string;
    }>;
    actionLogoutWithZustand: () => void;

}

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            actionLoginWithZustand: async (value) => {
                try {
                    console.log("Login attempt with:", value.email);
                    const res = await actionLogin(value);
                    
                    // Check if res.data exists
                    if (!res || !res.data) {
                        console.error("API response is missing data:", res);
                        return {
                            success: false,
                            error: "Invalid API response",
                        };
                    }
                    
                    const { payload, token } = res.data;
                    
                    // Verify payload and token exist
                    if (!payload || !token) {
                        console.error("Missing payload or token in response:", res.data);
                        return {
                            success: false,
                            error: "Invalid response format",
                        };
                    }
                    
                    console.log("Login successful, payload:", payload);
                    console.log("Token received:", token);
                    
                    set({ user: payload, token });
                    return {
                        success: true,
                        firstname: payload.firstname,
                    };
                } catch (error: any) {
                    // Enhanced error logging
                    console.error("Login error:", error);
                    console.error("Response data:", error.response?.data);
                    console.error("Status code:", error.response?.status);
                    
                    return {
                        success: false,
                        error: error.response?.data?.message || "Login failed",
                    };
                }
            },
            actionLogoutWithZustand: () => {
                set({ user: null, token: null });
            },
        }),
        {
            name: "auth-store",
        }
    )
)

export default useAuthStore;