import axios from "axios";

export const actionGetHistory = async (token: string) => {
  try {
    const result = await axios.get(`http://localhost:8888/api/history/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result
  } catch (error) {
    console.log("GetHistory error check:", error);
  }
};
