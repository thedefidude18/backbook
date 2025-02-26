import axios from "./axios";
import { toast } from "react-hot-toast";

// Default banner image URL if needed
const DEFAULT_BANNER = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

// Test event data with additional fields
const testEventData = {
  title: "Test Event",
  description: "This is a test event",
  category: "sports", // lowercase to match your enum values
  startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16), // 1 hour from now
  endTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16),   // 2 hours from now
  wagerAmount: "100",
  maxParticipants: "10",
  rules: "1. Test rule\n2. Another test rule",
  location: "Test Location", // Required field
  isPrivate: false,
  bannerUrl: DEFAULT_BANNER, // Default banner URL
  pool: {
    total_amount: 1000,
    entry_fee: 100
  }
};

// Function to convert test data to the format expected by the API
export const formatEventData = (data, type = 'public') => {
  const formattedData = { ...data };
  
  // Format based on event type
  if (type === 'challenge') {
    // For challenge type events
    formattedData.startDate = new Date(data.startTime).toISOString().split('T')[0];
    formattedData.endDate = new Date(data.endTime).toISOString().split('T')[0];
    formattedData.pool = {
      total_amount: data.pool?.total_amount || parseInt(data.wagerAmount) * parseInt(data.maxParticipants),
      entry_fee: data.pool?.entry_fee || parseInt(data.wagerAmount)
    };
    // Use title as is for challenges
  } else {
    // For public/private events
    formattedData.name = data.title; // Rename title to name
    formattedData.date = new Date(data.startTime).toISOString().split('T')[0];
    formattedData.time = new Date(data.startTime).toISOString().split('T')[1].substring(0, 5);
    formattedData.is_private = type === 'private';
  }
  
  // Add banner URL
  formattedData.banner_url = data.bannerUrl;
  formattedData.max_participants = parseInt(data.maxParticipants);
  
  // Remove fields not needed by the API
  delete formattedData.startTime;
  delete formattedData.endTime;
  
  return formattedData;
};

// Function to fetch a random banner image from Unsplash
export const fetchRandomBanner = async (category = 'sports') => {
  try {
    const response = await fetch(`https://source.unsplash.com/random/1200x600/?${category}`);
    return response.url;
  } catch (error) {
    console.error('Error fetching random banner:', error);
    return DEFAULT_BANNER;
  }
};

// Function to test event creation
export const testCreateEvent = async (type = 'public') => {
  try {
    // Get a random banner image
    const bannerUrl = await fetchRandomBanner(testEventData.category);
    const testDataWithBanner = { ...testEventData, bannerUrl };
    
    const formattedData = formatEventData(testDataWithBanner, type);
    
    const formData = new FormData();
    
    // Add all event data to formData
    Object.keys(formattedData).forEach(key => {
      if (key === 'pool') {
        // Handle nested objects
        formData.append('pool', JSON.stringify(formattedData[key]));
      } else if (formattedData[key] !== undefined) {
        formData.append(key, formattedData[key]);
      }
    });
    
    // Add type
    formData.append('type', type);
    
    // For testing, you can log the data being sent
    console.log('Sending event data:', Object.fromEntries(formData));
    
    const { data } = await axios.post(
      '/events',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    toast.success('Test event created successfully!');
    console.log('Event created:', data);
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create test event');
    console.error('Error creating test event:', error);
    throw error;
  }
};

// Export the test data for use elsewhere
export const getTestEventData = () => testEventData;