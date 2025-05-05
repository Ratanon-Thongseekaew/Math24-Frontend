// import {create} from "zustand"
// import { actionLogin } from "../api/auth";
// import {persist} from "zustand/middleware"
// // step 1 create store
// const authStore =(set)=>({
// user:[],
// token:null,
// actionLoginWithZustand: async(value)=>{
//     // console.log("Hello, Zustand")
//     try {
//         const res = await actionLogin(value)
//         const {payload, token} = res.data;
//         console.log(payload.role)
//         console.log(payload.lastname)
//         console.log(token)
//         set({user:payload, token:token})
//         return {success: true,role:payload.role, firstname:payload.firstname}
//     } catch (error) {
//         return {success: false, error:error.response.data.message}
//     }
// },
// actionLogoutWithZustand: async(value)=>{
//     set({user:[],token:null})
// },
// });
// //({}) คือการ return ออกมาเป็น obj


// //step 2 export store

// const useAuthStore = create(persist(authStore,{name:"auth-store"}));


// export default useAuthStore