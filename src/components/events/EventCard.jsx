import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';

function EventCard({ event }) {
  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if the event is upcoming, ongoing, or past
  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) {
      return { status: 'upcoming', className: styles.upcoming };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'ongoing', className: styles.ongoing };
    } else {
      return { status: 'past', className: styles.past };
    }
  };

  const eventStatus = getEventStatus();

  return (
    <div className={styles.eventCard}>
      {event.bannerImage && (
        <div className={styles.bannerContainer}>
          <img 
            src={event.bannerImage} 
            alt={event.title} 
            className={styles.bannerImage} 
          />
          <div className={`${styles.statusBadge} ${eventStatus.className}`}>
            {eventStatus.status}
          </div>
        </div>
      )}
      
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDescription}>{event.description}</p>
        
        <div className={styles.eventDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Start:</span>
            <span className={styles.detailValue}>{formatDate(event.startDate)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>End:</span>
            <span className={styles.detailValue}>{formatDate(event.endDate)}</span>
          </div>
          
          {event.location && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Location:</span>
              <span className={styles.detailValue}>{event.location}</span>
            </div>
          )}
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Participants:</span>
            <span className={styles.detailValue}>{event.participants?.length || 0}</span>
          </div>
        </div>
        
        <div className={styles.eventActions}>
          {eventStatus.status !== 'past' && (
            <Link to={`/events/${event._id}`} className={styles.viewButton}>
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;