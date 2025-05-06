import axios from "axios"

export const actionGenerateNumber = async (token: string): Promise<{data: GenerateNumbersResponse} | undefined> => {
    try {
      const result = await axios.get(
        `http://localhost:8888/api/games/generate-numbers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return result; 
  } catch (error) {
    console.log("generate number error check:",error)
  }

}
export const actionSubmitSolution = async(token:string,gameId:string | number,expression:string)=>{
try {
    const result = await axios.post(
    `http://localhost:8888/api/games/submit-solution`,
    {gameId,expression},
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return result;
} catch (error) {
    console.log("submit solution error check:", error);
}
    
} 
