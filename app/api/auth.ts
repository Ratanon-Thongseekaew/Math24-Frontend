import axios from "axios";

interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}


  

export const actionRegister = async (value: RegisterData) => {
  return await axios.post("http://localhost:8888/api/register", value);
};
