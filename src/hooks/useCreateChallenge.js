import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";
import { socket } from "../routes/IsLoggedIn";

const createChallenge = async ({ challengeData }) => {
  const formData = new FormData();
  
  // Add all challenge data to formData
  Object.keys(challengeData).forEach(key => {
    if (key === 'photo' && challengeData[key]) {
      formData.append('photo', challengeData[key]);
    } else if (challengeData[key] !== undefined) {
      formData.append(key, challengeData[key]);
    }
  });

  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/challenges`,
    formData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return data;
};

export const useCreateChallenge = () => {
  return useMutation({
    mutationKey: "useCreateChallenge",
    mutationFn: createChallenge,
    onSuccess: (data) => {
      const newChallenge = data?.data?.challenge;

      // Update chats list to include the new challenge chat
      queryClient.setQueryData(["getChats"], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.data.chats = [newChallenge, ...newData.data.chats];
        return {
          ...oldData,
          newData,
        };
      });

      // Notify the socket about the new challenge
      socket.emit("new_challenge", {
        challenge: newChallenge
      });

      // Invalidate challenges query to refresh the list
      queryClient.invalidateQueries(["getUserChallenges"]);
    }
  });
};