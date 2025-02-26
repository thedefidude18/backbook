import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";
import { socket } from "../routes/IsLoggedIn";

const respondToChallenge = async ({ challengeId, action }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/challenges/respond`,
    { challengeId, action },
    {
      withCredentials: true
    }
  );
  return data;
};

export const useRespondToChallenge = () => {
  return useMutation({
    mutationKey: "useRespondToChallenge",
    mutationFn: respondToChallenge,
    onSuccess: (data) => {
      const updatedChallenge = data?.data?.challenge;

      // Update the chat with the updated challenge
      queryClient.setQueryData(["getMessages", updatedChallenge._id], (oldData) => {
        if (!oldData) return oldData;
        let newData = oldData;
        newData.pages[0].data.chat = updatedChallenge;
        return newData;
      });

      // Notify the socket about the challenge response
      socket.emit("challenge_response", {
        challenge: updatedChallenge
      });

      // Invalidate challenges query to refresh the list
      queryClient.invalidateQueries(["getUserChallenges"]);
    }
  });
};