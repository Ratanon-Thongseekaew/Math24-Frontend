import axios from "axios";

export const actionRegister = async (value: RegisterData) => {
  return await axios.post("http://localhost:8888/api/register", value);
};

export const actionLogin = async (value:LoginData) =>{
    return await axios.post("http://localhost:8888/api/login", value);
}