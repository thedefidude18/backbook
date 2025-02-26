import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export function useLeaderboard(timeFilter = 'all') {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch from your API
      // const { data } = await axios.get(
      //   `${process.env.REACT_APP_BACKEND_URL}/api/v1/leaderboard?timeFilter=${timeFilter}`,
      //   { withCredentials: true }
      // );
      
      // Mock data for demonstration
      const mockUsers = [
        {
          id: '1',
          name: 'Sarah Johnson',
          username: 'sarahj',
          photo: 'https://randomuser.me/api/portraits/women/44.jpg',
          groups_joined: 15,
          events_won: 23,
          total_winnings: 45000,
        },
        {
          id: '2',
          name: 'Michael Chen',
          username: 'mikechen',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          groups_joined: 12,
          events_won: 18,
          total_winnings: 36000,
        },
        // Add more mock users as needed
      ];

      // Process user data
      const processedUsers = mockUsers.map(user => ({
        ...user,
        rank: 0 // Will be assigned below
      }));

      // Sort users by score (groups joined + events won + winnings)
      const sortedUsers = processedUsers.sort((a, b) => {
        const aScore = a.groups_joined * 10 + a.events_won * 20 + a.total_winnings;
        const bScore = b.groups_joined * 10 + b.events_won * 20 + b.total_winnings;
        return bScore - aScore;
      });

      // Assign ranks
      sortedUsers.forEach((user, index) => {
        user.rank = index + 1;
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    users,
    loading,
    fetchLeaderboard
  };
}