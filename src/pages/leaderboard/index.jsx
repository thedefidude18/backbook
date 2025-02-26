import React, { useState } from 'react';
import { Trophy, Crown, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Leaderboard.module.css';
import Card from '../../components/UI/Card/Card';
import Skeleton from 'react-loading-skeleton';

// Mock data for the leaderboard
const mockLeaderboardData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    groups_joined: 15,
    events_won: 23,
    total_winnings: 45000,
    rank: 1
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: 'mikechen',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    groups_joined: 12,
    events_won: 18,
    total_winnings: 36000,
    rank: 2
  },
  {
    id: '3',
    name: 'Jessica Williams',
    username: 'jesswill',
    photo: 'https://randomuser.me/api/portraits/women/63.jpg',
    groups_joined: 10,
    events_won: 15,
    total_winnings: 30000,
    rank: 3
  },
  {
    id: '4',
    name: 'David Rodriguez',
    username: 'drodriguez',
    photo: 'https://randomuser.me/api/portraits/men/71.jpg',
    groups_joined: 8,
    events_won: 12,
    total_winnings: 24000,
    rank: 4
  },
  {
    id: '5',
    name: 'Emma Thompson',
    username: 'emmathompson',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    groups_joined: 7,
    events_won: 10,
    total_winnings: 20000,
    rank: 5
  },
  {
    id: '6',
    name: 'James Wilson',
    username: 'jwilson',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    groups_joined: 6,
    events_won: 8,
    total_winnings: 16000,
    rank: 6
  },
  {
    id: '7',
    name: 'Olivia Martinez',
    username: 'oliviam',
    photo: 'https://randomuser.me/api/portraits/women/89.jpg',
    groups_joined: 5,
    events_won: 7,
    total_winnings: 14000,
    rank: 7
  },
  {
    id: '8',
    name: 'Daniel Lee',
    username: 'dlee',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    groups_joined: 4,
    events_won: 6,
    total_winnings: 12000,
    rank: 8
  }
];

function Leaderboard() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'weekly', 'monthly'

  // Fetch leaderboard data
  const { isLoading, data } = useQuery({
    queryKey: ['getLeaderboard', timeFilter],
    queryFn: async () => {
      // In a real implementation, you would fetch from your API with the timeFilter
      // const { data } = await axios.get(
      //   `${process.env.REACT_APP_BACKEND_URL}/api/v1/leaderboard?timeFilter=${timeFilter}`,
      //   { withCredentials: true }
      // );
      // return data;
      
      // For now, we'll use mock data
      return { data: { users: mockLeaderboardData } };
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const users = data?.data?.users || [];

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return styles.rankGold;
      case 2:
        return styles.rankSilver;
      case 3:
        return styles.rankBronze;
      default:
        return styles.rankDefault;
    }
  };

  const getAchievementCount = (eventsWon) => {
    if (eventsWon >= 20) return 3;
    if (eventsWon >= 10) return 2;
    if (eventsWon >= 5) return 1;
    return 0;
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${users.find(user => user.id === userId).username}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.titleContainer}>
              <button
                onClick={() => navigate(-1)}
                className={styles.backButton}
              >
                <ArrowLeft className={styles.backIcon} />
              </button>
              <div className={styles.titleWrapper}>
                <Trophy className={styles.trophyIcon} />
                <h1 className={styles.title}>Leaderboard</h1>
              </div>
            </div>
            <div className={styles.timeInfo}>
              <Sparkles className={styles.sparklesIcon} />
              <span className={styles.timeText}>
                {timeFilter === 'weekly' ? '7 days' : timeFilter === 'monthly' ? '30 days' : 'All time'}
              </span>
            </div>
          </div>

          {/* Time Filter */}
          <div className={styles.filterContainer}>
            {['all', 'weekly', 'monthly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`${styles.filterButton} ${timeFilter === filter ? styles.filterButtonActive : ''}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className={styles.leaderboardContainer}>
        <Card>
          <div className={styles.leaderboardList}>
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className={`${styles.userRow} ${user.rank <= 3 ? styles.topRanked : ''}`}
              >
                {/* Avatar with Rank Badge */}
                <div className={styles.avatarContainer}>
                  <img
                    src={user.photo}
                    alt={user.name}
                    className={`${styles.avatar} ${
                      user.rank === 1 ? styles.avatarGold : 
                      user.rank === 2 ? styles.avatarSilver : 
                      user.rank === 3 ? styles.avatarBronze : styles.avatarDefault
                    }`}
                  />
                  {/* Rank Badge */}
                  <div className={`${styles.rankBadge} ${getRankStyle(user.rank)}`}>
                    {user.rank}
                  </div>
                  {/* Crown for #1 */}
                  {user.rank === 1 && (
                    <div className={styles.crownBadge}>
                      <Crown className={styles.crownIcon} />
                    </div>
                  )}
                </div>

                {/* Name and Achievements */}
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.name}</h3>
                  <p className={styles.userUsername}>@{user.username}</p>
                  <div className={styles.achievements}>
                    {Array.from({ length: getAchievementCount(user.events_won) }).map((_, i) => (
                      <Star key={i} className={styles.achievementStar} />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <p className={styles.statLabel}>Groups</p>
                    <p className={styles.statValue}>{user.groups_joined}</p>
                  </div>
                  <div className={styles.statItem}>
                    <p className={styles.statLabel}>Wins</p>
                    <p className={styles.statValue}>{user.events_won}</p>
                  </div>
                  <div className={styles.earningsItem}>
                    <p className={styles.statLabel}>Earnings</p>
                    <p className={styles.earningsValue}>
                      ₦{user.total_winnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Leaderboard;