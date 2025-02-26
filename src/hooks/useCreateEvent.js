import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios"; // Use custom axios instance
import { queryClient } from "../App";
import { socket } from "../routes/IsLoggedIn";

const createEvent = async (eventData) => {
  const formData = new FormData();
  
  // Add all event data to formData
  Object.keys(eventData).forEach(key => {
    if (key === 'bannerImage' && eventData[key]) {
      formData.append('bannerImage', eventData[key]);
    } else if (eventData[key] !== undefined) {
      formData.append(key, eventData[key]);
    }
  });

  const { data } = await axios.post(
    `/events`, // Use relative URL since baseURL is set in axios instance
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return data;
};

export const useEventCreation = () => {
  return useMutation({
    mutationKey: ["useEventCreation"],
    mutationFn: createEvent,
    onSuccess: (data) => {
      // Invalidate and refetch events query
      queryClient.invalidateQueries(["events"]);

      // Handle notifications
      const newNotification = data?.data?.newNotification;
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};