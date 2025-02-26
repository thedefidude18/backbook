import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyEvents.module.css';
import Card from "../../components/UI/Card/Card";
import Loading from "../../components/UI/Loading/Loading";
import EventCard from "../../components/events/EventCard";
import { toast } from 'react-hot-toast';
import { useEventHistory } from '../../hooks/useEventHistory';

// Mock data for development and testing
const mockEvents = {
  all: [
    {
      _id: 'event1',
      title: 'Tech Conference 2023',
      description: 'Annual tech conference featuring the latest innovations and industry trends.',
      startDate: new Date(2023, 11, 15).toISOString(),
      endDate: new Date(2023, 11, 17).toISOString(),
      match_status: 'matched',
      location: 'Lagos Tech Hub',
      participants: Array(120).fill({}),
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    },
    {
      _id: 'event2',
      title: 'Startup Pitch Night',
      description: 'Showcase your startup idea and get feedback from investors and industry experts.',
      startDate: new Date(2023, 10, 5).toISOString(),
      endDate: new Date(2023, 10, 5).toISOString(),
      match_status: 'completed',
      location: 'Innovation Center',
      participants: Array(85).fill({}),
      bannerImage: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    }
  ],
  created: [
    {
      _id: 'created1',
      title: 'Community Coding Day',
      description: 'A day dedicated to collaborative coding and knowledge sharing.',
      startDate: new Date(2023, 11, 25).toISOString(),
      endDate: new Date(2023, 11, 25).toISOString(),
      match_status: 'waiting',
      location: 'Community Center',
      participants: Array(40).fill({}),
      bannerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    },
    {
      _id: 'created2',
      title: 'Mobile App Design Sprint',
      description: 'Design and prototype a mobile app in this intensive design sprint.',
      startDate: new Date(2024, 0, 15).toISOString(),
      endDate: new Date(2024, 0, 17).toISOString(),
      match_status: 'matched',
      location: 'Design Studio',
      participants: Array(25).fill({}),
      bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    }
  ]
};

function MyEvents() {
  const navigate = useNavigate();
  const { history, createdEvents, loading, editEvent } = useEventHistory();
  const [activeTab, setActiveTab] = useState('all');
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState({
    all: [],
    active: [],
    completed: [],
    cancelled: [],
    created: []
  });

  // For development, use mock data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setEvents({
        all: mockEvents.all,
        active: mockEvents.all.filter(e => new Date(e.endDate) >= new Date()),
        completed: mockEvents.all.filter(e => new Date(e.endDate) < new Date()),
        cancelled: [],
        created: mockEvents.created
      });
    } else {
      // For production, use real data from the hook
      if (!loading && history && createdEvents) {
        setEvents({
          all: [...history],
          active: history.filter(e => e.status === 'active'),
          completed: history.filter(e => e.status === 'completed'),
          cancelled: history.filter(e => e.status === 'cancelled'),
          created: [...createdEvents]
        });
      }
    }
  }, [loading, history, createdEvents]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'matched':
        return styles.matched;
      case 'waiting':
        return styles.waiting;
      case 'completed':
        return styles.completed;
      case 'cancelled':
        return styles.cancelled;
      default:
        return '';
    }
  };

  const renderEvents = () => {
    const eventsToShow = events[activeTab] || [];

    if (eventsToShow.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>No events found in this category</p>
          <button 
            className={styles.createButton}
            onClick={() => navigate('/create-event')}
          >
            Create an Event
          </button>
        </div>
      );
    }

    return (
      <div className={styles.eventGrid}>
        {eventsToShow.map(event => (
          <Card key={event._id} className={styles.eventCardWrapper}>
            <EventCard event={event} />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <i className="exit_icon"></i>
        </button>
        <h1>My Events</h1>
        <button 
          className={styles.createButton}
          onClick={() => navigate('/create-event')}
        >
          Create Event
        </button>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All
          <span className={styles.tabBadge}>{events.all.length}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
          onClick={() => handleTabChange('active')}
        >
          Active
          <span className={styles.tabBadge}>{events.active.length}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => handleTabChange('completed')}
        >
          Completed
          <span className={styles.tabBadge}>{events.completed.length}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'cancelled' ? styles.active : ''}`}
          onClick={() => handleTabChange('cancelled')}
        >
          Cancelled
          <span className={styles.tabBadge}>{events.cancelled.length}</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'created' ? styles.active : ''}`}
          onClick={() => handleTabChange('created')}
        >
          Created
          <span className={styles.tabBadge}>{events.created.length}</span>
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        renderEvents()
      )}
    </div>
  );
}

export default MyEvents;
