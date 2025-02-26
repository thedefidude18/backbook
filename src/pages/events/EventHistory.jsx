import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './EventHistory.module.css';
import Card from '../../components/UI/Card/Card';
import EventCard from '../../components/events/EventCard';
import axiosInstance from '../../utils/axios';
import PostSkeleton from '../../components/skeleton/PostSkeleton';

function EventHistory() {
  const [activeTab, setActiveTab] = useState('participated');

  const { isLoading: isLoadingParticipated, data: participatedEvents } = useQuery({
    queryKey: ['participatedEvents'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/events/participated');
      return data.events;
    },
    enabled: activeTab === 'participated',
  });

  const { isLoading: isLoadingCreated, data: createdEvents } = useQuery({
    queryKey: ['createdEvents'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/events/created');
      return data.events;
    },
    enabled: activeTab === 'created',
  });

  const isLoading = activeTab === 'participated' ? isLoadingParticipated : isLoadingCreated;
  const events = activeTab === 'participated' ? participatedEvents : createdEvents;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Event History</h2>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'participated' ? styles.active : ''}`}
            onClick={() => setActiveTab('participated')}
          >
            Participated Events
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'created' ? styles.active : ''}`}
            onClick={() => setActiveTab('created')}
          >
            Created Events
          </button>
        </div>
      </div>

      <div className={styles.eventsList}>
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : events && events.length > 0 ? (
          events.map(event => (
            <Card key={event._id} className={styles.eventCard}>
              <EventCard event={event} />
            </Card>
          ))
        ) : (
          <div className={styles.noEvents}>
            <p>No events found. {activeTab === 'participated' ? 'Join some events!' : 'Create an event!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventHistory;