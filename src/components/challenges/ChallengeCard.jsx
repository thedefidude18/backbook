import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChallengeCard.module.css';
import Card from '../UI/Card/Card';
import { format } from 'date-fns';

function ChallengeCard({ challenge, status }) {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const getDaysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getParticipantCount = () => {
    return challenge.participants?.length || 0;
  };
  
  const handleCardClick = () => {
    navigate(`/challenges/${challenge._id}`);
  };

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        {status === 'active' && (
          <div className={styles.badge}>
            {getDaysRemaining()} days left
          </div>
        )}
        {status === 'scheduled' && (
          <div className={`${styles.badge} ${styles.scheduled}`}>
            Starts {formatDate(challenge.startDate)}
          </div>
        )}
        {status === 'ended' && (
          <div className={`${styles.badge} ${styles.ended}`}>
            Ended {formatDate(challenge.endDate)}
          </div>
        )}
      </div>
      
      <h2 className={styles.title}>{challenge.title}</h2>
      
      <p className={styles.description}>
        {challenge.description.length > 100 
          ? `${challenge.description.substring(0, 100)}...` 
          : challenge.description}
      </p>
      
      <div className={styles.details}>
        <div className={styles.dateRange}>
          <span className={styles.label}>Duration:</span>
          <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
        </div>
        
        <div className={styles.participants}>
          <span className={styles.label}>Participants:</span>
          <span>{getParticipantCount()}</span>
        </div>
        
        {challenge.reward && (
          <div className={styles.reward}>
            <span className={styles.label}>Reward:</span>
            <span>{challenge.reward}</span>
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        {status === 'active' && (
          <button className={styles.joinButton}>
            Join Challenge
          </button>
        )}
        {status === 'scheduled' && (
          <button className={styles.remindButton}>
            Set Reminder
          </button>
        )}
        {status === 'ended' && (
          <button className={styles.viewResultsButton}>
            View Results
          </button>
        )}
      </div>
    </Card>
  );
}

export default ChallengeCard;