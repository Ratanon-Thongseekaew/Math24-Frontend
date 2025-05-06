import axios from "axios";

export const actionGetHistory = async (token: string, page = 1, limit = 5) => {
  try {
    const result = await axios.get(`http://localhost:8888/api/history/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit
      }
    });
    return result;
  } catch (error) {
    console.log("GetHistory error check:", error);
  }
};
