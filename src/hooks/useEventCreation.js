import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../App";
import { socket } from "../routes/IsLoggedIn";

const EVENT_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  CHALLENGE: 'challenge'
};

const createEvent = async ({ eventData, type }) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/events/create`,
    { ...eventData, type },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const useEventCreation = () => {
  return useMutation({
    mutationKey: "useEventCreation",
    mutationFn: createEvent,
    onSuccess: (data) => {
      // Update events cache
      queryClient.setQueryData(["getEvents"], (oldData) => {
        if (!oldData) return oldData;
        
        let newData = oldData;
        const newEvent = data.data.event;
        
        // Add new event to the list
        if (newData.pages && newData.pages[0]) {
          newData.pages[0].data = [newEvent, ...newData.pages[0].data];
        }
        
        return newData;
      });

      // Update posts cache to show event in feed
      queryClient.setQueryData(["getPosts"], (oldData) => {
        if (!oldData) return oldData;
        
        let newData = oldData;
        const eventPost = {
          ...data.data.event,
          type: 'event',
          createdAt: new Date().toISOString(),
          user: data.data.event.creator // Assuming creator info is included
        };
        
        // Add event post to the feed
        if (newData.pages && newData.pages[0]) {
          newData.pages[0].data = [eventPost, ...newData.pages[0].data];
        }
        
        return newData;
      });

      // Handle notifications
      const newNotification = data?.data?.newNotification;
      if (newNotification) {
        socket.emit("notification", { notification: newNotification });
      }
    },
  });
};

// Helper function to validate event data
export const validateEventData = (eventData, type) => {
  const errors = {};

  switch (type) {
    case EVENT_TYPES.PUBLIC:
      if (!eventData.name) errors.name = "Event name is required";
      if (!eventData.date) errors.date = "Date is required";
      if (!eventData.time) errors.time = "Time is required";
      if (!eventData.location) errors.location = "Location is required";
      if (!eventData.description) errors.description = "Description is required";
      if (!eventData.category) errors.category = "Category is required";
      break;

    case EVENT_TYPES.PRIVATE:
      if (!eventData.name) errors.name = "Event name is required";
      if (!eventData.date) errors.date = "Date is required";
      if (!eventData.time) errors.time = "Time is required";
      if (!eventData.location) errors.location = "Location is required";
      if (!eventData.description) errors.description = "Description is required";
      if (!eventData.maxAttendees) errors.maxAttendees = "Max attendees is required";
      break;

    case EVENT_TYPES.CHALLENGE:
      if (!eventData.title) errors.title = "Challenge title is required";
      if (!eventData.description) errors.description = "Description is required";
      if (!eventData.startDate) errors.startDate = "Start date is required";
      if (!eventData.endDate) errors.endDate = "End date is required";
      if (!eventData.reward) errors.reward = "Reward is required";
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
