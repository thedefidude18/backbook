import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUserChallenges = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/challenges`,
    {
      withCredentials: true
    }
  );
  return data;
};

export const useGetUserChallenges = () => {
  return useQuery({
    queryKey: ["getUserChallenges"],
    queryFn: getUserChallenges,
    refetchOnWindowFocus: false
  });
};