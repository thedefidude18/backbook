import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios"; // Use custom axios instance
import { queryClient } from "../App";
import { socket } from "../routes/IsLoggedIn";

const EVENT_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  CHALLENGE: 'challenge'
};

const createEvent = async ({ eventData, type }) => {
  // Check if eventData contains a file
  const needsFormData = eventData.bannerImage || eventData.photo;
  
  // Prepare data with all required fields regardless of event type
  let preparedData = { ...eventData, type };
  
  // Handle different field names between event types
  if (type === 'challenge') {
    // For challenges, map title to name if name is not already set
    if (eventData.title && !preparedData.name) {
      preparedData.name = eventData.title;
    }
    
    // Ensure startDate and endDate are present
    if (!preparedData.startDate) {
      console.warn('Missing startDate for challenge, using current date');
      preparedData.startDate = new Date().toISOString().split('T')[0];
    }
    
    if (!preparedData.endDate) {
      console.warn('Missing endDate for challenge, using current date + 1 day');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      preparedData.endDate = tomorrow.toISOString().split('T')[0];
    }
  } else {
    // For public and private events
    // Convert date and time to startDate and startTime
    if (eventData.date) {
      // Set startDate directly from date field
      preparedData.startDate = eventData.date;
      
      // Set endDate to same day if not specified
      if (!preparedData.endDate) {
        preparedData.endDate = eventData.date;
      }
    }
    
    // Make sure location is set (even if empty)
    if (!preparedData.location) {
      preparedData.location = "Online"; // Default to "Online" if no location provided
    }
    
    // Add startTime from time field if available
    if (eventData.time) {
      preparedData.startTime = eventData.time;
    }
  }
  
  // Ensure name is set
  if (!preparedData.name || preparedData.name.trim() === '') {
    console.error('Event name is required');
    throw new Error('Event name is required');
  }
  
  let requestData;
  let headers = {};
  
  if (needsFormData) {
    // Create FormData if we have files
    const formData = new FormData();
    
    // Add all prepared data to formData
    Object.keys(preparedData).forEach(key => {
      if ((key === 'bannerImage' || key === 'photo') && preparedData[key]) {
        // Make sure we're appending the actual file object for file inputs
        formData.append(key, preparedData[key]);
      } else if (preparedData[key] !== undefined && preparedData[key] !== null) {
        // Convert boolean values to strings
        if (typeof preparedData[key] === 'boolean') {
          formData.append(key, preparedData[key].toString());
        } else {
          formData.append(key, preparedData[key]);
        }
      }
    });
    
    requestData = formData;
    headers = { 'Content-Type': 'multipart/form-data' };
    
    // Log FormData entries for debugging
    console.log('Sending FormData with the following entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[0] === 'bannerImage' || pair[0] === 'photo' ? '[File]' : pair[1]));
    }
  } else {
    // Use regular JSON if no files
    requestData = preparedData;
    
    // Log JSON data for debugging
    console.log('Sending JSON data:', requestData);
  }

  try {
    const { data } = await axios.post(
      `/events`, // Use relative URL since baseURL is set in axios instance
      requestData,
      {
        headers
      }
    );
    return data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    // Log more detailed error information
    if (error.response?.data) {
      console.error('Event creation error details:', error.response.data);
    }
    throw error;
  }
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
    onError: (error) => {
      console.error('Event creation error details:', error.response?.data);
    }
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

