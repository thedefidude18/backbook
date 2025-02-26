import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import { useSelector } from 'react-redux';

export function useEventHistory() {
  const [history, setHistory] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.userinfo);

  const fetchEventHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch events the user has participated in
      const participatedResponse = await axiosInstance.get('/events/participated');
      
      // Fetch events created by the user
      const createdResponse = await axiosInstance.get('/events/created');
      
      setHistory(participatedResponse.data.events || []);
      setCreatedEvents(createdResponse.data.events || []);
    } catch (error) {
      console.error('Error fetching event history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const editEvent = useCallback(async (eventId, updatedData) => {
    try {
      const response = await axiosInstance.put(`/events/${eventId}`, updatedData);
      
      // Update local state
      setCreatedEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, ...updatedData } : event
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchEventHistory();
  }, [fetchEventHistory]);

  return {
    history,
    createdEvents,
    loading,
    editEvent,
    refreshEvents: fetchEventHistory
  };
}
