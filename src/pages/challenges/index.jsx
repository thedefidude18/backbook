import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './Challenges.module.css';
import Card from '../../components/UI/Card/Card';
import ChallengeCard from '../../components/challenges/ChallengeCard';
import axiosInstance from '../../utils/axios';
import PostSkeleton from '../../components/skeleton/PostSkeleton';

// Mock data for challenges
const mockChallenges = {
  active: [
    {
      _id: 'active1',
      title: 'Daily Fitness Challenge',
      description: 'Complete 30 minutes of exercise every day for 30 days. Share your progress and inspire others!',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      participants: Array(24),
      reward: 'Fitness Badge & $50 Gift Card'
    },
    {
      _id: 'active2',
      title: 'Photography Contest',
      description: 'Share your best nature photos and get a chance to be featured on our homepage!',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      participants: Array(42),
      reward: 'Pro Camera Lens & Featured Profile'
    },
    {
      _id: 'active3',
      title: 'Book Reading Marathon',
      description: 'Read 5 books in 30 days and share your reviews with the community.',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
      participants: Array(18),
      reward: 'E-reader & Book Store Gift Card'
    }
  ],
  scheduled: [
    {
      _id: 'scheduled1',
      title: 'Coding Hackathon',
      description: 'Build an app that solves a real-world problem in 48 hours.',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
      participants: Array(8),
      reward: 'Developer Kit & Job Interview'
    },
    {
      _id: 'scheduled2',
      title: 'Healthy Recipe Challenge',
      description: 'Share your best healthy recipes and get voted by the community.',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
      participants: Array(12),
      reward: 'Kitchen Appliance Set'
    }
  ],
  ended: [
    {
      _id: 'ended1',
      title: 'Winter Art Contest',
      description: 'Create and share your winter-themed artwork.',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      participants: Array(56),
      reward: 'Art Supplies Kit'
    },
    {
      _id: 'ended2',
      title: 'Holiday Decoration Challenge',
      description: 'Show off your best holiday decorations and win prizes!',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      endDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      participants: Array(38),
      reward: 'Home Decor Gift Card'
    },
    {
      _id: 'ended3',
      title: 'New Year Resolution Challenge',
      description: 'Share your progress on your new year resolutions for 30 days.',
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
      endDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
      participants: Array(72),
      reward: 'Productivity Course & Premium Planner'
    }
  ]
};

function Challenges() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [useMockData, setUseMockData] = useState(false);
  const [challengeCounts, setChallengeCounts] = useState({
    active: 0,
    scheduled: 0,
    ended: 0
  });

  // Fetch challenges based on active tab
  const { data, isLoading, isError } = useQuery({
    queryKey: ['challenges', activeTab],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/events/challenges/${activeTab}`);
        return data;
      } catch (error) {
        setUseMockData(true);
        throw error;
      }
    }
  });

  // Use mock data in development or when API fails
  useEffect(() => {
    if (isError || process.env.NODE_ENV === 'development') {
      setUseMockData(true);
    }
  }, [isError]);

  // Update challenge counts
  useEffect(() => {
    if (useMockData) {
      setChallengeCounts({
        active: mockChallenges.active.length,
        scheduled: mockChallenges.scheduled.length,
        ended: mockChallenges.ended.length
      });
    } else if (data) {
      // If we have real data for the current tab, update that count
      setChallengeCounts(prev => ({
        ...prev,
        [activeTab]: data.challenges?.length || 0
      }));
    }
  }, [useMockData, data, activeTab]);

  const handleCreateChallenge = () => {
    navigate('/create-event', { state: { defaultTab: 'challenge' } });
  };

  // Get challenges to display (either from API or mock data)
  const challengesToDisplay = useMockData 
    ? { challenges: mockChallenges[activeTab] } 
    : data;

  return (
    <div className={styles.container}>
      <Card className={styles.header}>
        <h1 className={styles.title}>Challenges</h1>
        <button 
          onClick={handleCreateChallenge} 
          className={styles.createButton}
        >
          Create Challenge
        </button>
      </Card>

      <Card className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'active' ? styles.active : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active
            {challengeCounts.active > 0 && (
              <span className={styles.tabBadge}>{challengeCounts.active}</span>
            )}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'scheduled' ? styles.active : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            Scheduled
            {challengeCounts.scheduled > 0 && (
              <span className={styles.tabBadge}>{challengeCounts.scheduled}</span>
            )}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'ended' ? styles.active : ''}`}
            onClick={() => setActiveTab('ended')}
          >
            Ended
            {challengeCounts.ended > 0 && (
              <span className={styles.tabBadge}>{challengeCounts.ended}</span>
            )}
          </button>
        </div>
      </Card>

      <div className={styles.challengesGrid}>
        {isLoading && !useMockData && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {isError && !useMockData && (
          <Card className={styles.errorCard}>
            <p>Failed to load challenges. Please try again later.</p>
          </Card>
        )}

        {!isLoading && !isError && challengesToDisplay?.challenges?.length === 0 && (
          <Card className={styles.emptyCard}>
            <p>No {activeTab} challenges found.</p>
            {activeTab !== 'active' ? (
              <button 
                onClick={() => setActiveTab('active')} 
                className={styles.viewButton}
              >
                View active challenges
              </button>
            ) : (
              <button 
                onClick={handleCreateChallenge} 
                className={styles.createButton}
              >
                Create your first challenge
              </button>
            )}
          </Card>
        )}

        {challengesToDisplay?.challenges?.map(challenge => (
          <ChallengeCard 
            key={challenge._id} 
            challenge={challenge} 
            status={activeTab}
          />
        ))}
      </div>
    </div>
  );
}

export default Challenges;