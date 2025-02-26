import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateEvent.module.css';
import Card from "../../UI/Card/Card";
import { Search } from '../../../svg';
import { useEventCreation, validateEventData } from '../../../hooks/useEventCreation';
import { toast } from 'react-hot-toast';
import { fetchRandomBanner } from '../../../utils/testEventCreation';

function CreateEvent() {
  const navigate = useNavigate();
  const { mutate: createEvent, isLoading } = useEventCreation();
  const [activeTab, setActiveTab] = useState('public');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(false);

  const [challengeFormData, setChallengeFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    participants: [],
    reward: '',
    wagerAmount: '',
    bannerUrl: '',
    bannerImage: null
  });

  const [publicFormData, setPublicFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social',
    maxParticipants: '2',
    rules: '',
    bannerImage: null,
    bannerUrl: '',
    wagerAmount: '',
    termsAccepted: false
  });

  const [privateFormData, setPrivateFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    invitees: [],
    maxAttendees: '',
    bannerImage: null,
    bannerUrl: '',
    wagerAmount: ''
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  let eventData;
  switch (activeTab) {
    case 'public':
      eventData = publicFormData;
      break;
    case 'private':
      eventData = privateFormData;
      break;
    case 'challenge':
      eventData = challengeFormData;
      break;
  }

  // Validate the data
  const { isValid, errors } = validateEventData(eventData, activeTab);
  
  if (!isValid) {
    // Show first error
    const firstError = Object.values(errors)[0];
    toast.error(firstError);
    return;
  }

  try {
    console.log(`Submitting ${activeTab} event with data:`, eventData);
    
    await createEvent(
      { eventData, type: activeTab },
      {
        onSuccess: (data) => {
          toast.success('Event created successfully!');
          navigate('/events');
        },
        onError: (error) => {
          console.error('Event creation error:', error);
          
          // Try to extract the most useful error message
          let errorMessage = 'Failed to create event';
          
          if (error.response?.data?.message) {
            // Extract specific validation errors if available
            const validationMessage = error.response.data.message;
            if (validationMessage.includes('validation failed')) {
              // Try to extract specific field errors
              const fieldErrors = validationMessage.match(/([a-zA-Z]+):\s([^,]+)/g);
              if (fieldErrors && fieldErrors.length > 0) {
                // Show the first field error in a more user-friendly way
                const firstError = fieldErrors[0].split(':');
                if (firstError.length > 1) {
                  errorMessage = `${firstError[0].trim()}: ${firstError[1].trim()}`;
                } else {
                  errorMessage = fieldErrors[0];
                }
              } else {
                errorMessage = 'Please check all required fields are filled correctly';
              }
            } else {
              errorMessage = validationMessage;
            }
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast.error(errorMessage);
        }
      }
    );
  } catch (error) {
    console.error('Event submission error:', error);
    toast.error('Failed to create event. Please try again.');
  }
};
  const handleChallengeChange = (e) => {
    const { name, value, type, files } = e.target;
    
    setChallengeFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleUserSearch = (e) => {
    setSearchTerm(e.target.value);
    // TODO: Implement user search functionality
  };

  const handlePublicChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setPublicFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              value
    }));
  };

  const handlePrivateChange = (e) => {
    const { name, value, type, files } = e.target;
    
    setPrivateFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const generateRandomBanner = async (category, formType) => {
    setLoadingBanner(true);
    try {
      const bannerUrl = await fetchRandomBanner(category || 'event');
      
      if (formType === 'public') {
        setPublicFormData(prev => ({
          ...prev,
          bannerUrl
        }));
      } else if (formType === 'private') {
        setPrivateFormData(prev => ({
          ...prev,
          bannerUrl
        }));
      } else if (formType === 'challenge') {
        setChallengeFormData(prev => ({
          ...prev,
          bannerUrl
        }));
      }
      
      toast.success('Banner generated successfully!');
    } catch (error) {
      toast.error('Failed to generate banner');
    } finally {
      setLoadingBanner(false);
    }
  };

  const PublicEventForm = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Event Name</label>
        <input
          type="text"
          name="name"
          value={publicFormData.name}
          onChange={handlePublicChange}
          placeholder="Give your event a name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Category</label>
        <select
          name="category"
          value={publicFormData.category}
          onChange={handlePublicChange}
          required
        >
          <option value="social">Social</option>
          <option value="business">Business</option>
          <option value="education">Education</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={publicFormData.date}
            onChange={handlePublicChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={publicFormData.time}
            onChange={handlePublicChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={publicFormData.location}
          onChange={handlePublicChange}
          placeholder="Event location"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          name="description"
          value={publicFormData.description}
          onChange={handlePublicChange}
          placeholder="Tell people what your event is about"
          rows="4"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Maximum Participants</label>
        <input
          type="number"
          name="maxParticipants"
          value={publicFormData.maxParticipants}
          onChange={handlePublicChange}
          min="2"
          placeholder="Maximum number of participants"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Wager Amount (₦)</label>
        <input
          type="number"
          name="wagerAmount"
          value={publicFormData.wagerAmount}
          onChange={handlePublicChange}
          min="0"
          placeholder="Entry fee in Naira (optional)"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Event Rules</label>
        <textarea
          name="rules"
          value={publicFormData.rules}
          onChange={handlePublicChange}
          placeholder="Enter event rules and guidelines"
          rows="3"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Banner Image</label>
        <div className={styles.bannerInputContainer}>
          <input
            type="file"
            name="bannerImage"
            onChange={handlePublicChange}
            accept="image/jpeg,image/png,image/gif"
          />
          <div className={styles.orDivider}>OR</div>
          <div className={styles.bannerUrlContainer}>
            <input
              type="url"
              name="bannerUrl"
              value={publicFormData.bannerUrl}
              onChange={handlePublicChange}
              placeholder="Enter banner image URL"
            />
            <button 
              type="button" 
              className={styles.generateButton}
              onClick={() => generateRandomBanner(publicFormData.category, 'public')}
              disabled={loadingBanner}
            >
              {loadingBanner ? 'Generating...' : 'Generate Random'}
            </button>
          </div>
        </div>
        {publicFormData.bannerUrl && (
          <div className={styles.bannerPreview}>
            <img src={publicFormData.bannerUrl} alt="Banner preview" />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={publicFormData.termsAccepted}
            onChange={handlePublicChange}
            required
          />
          I accept the terms and conditions
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.createButton}
          disabled={isLoading || !publicFormData.termsAccepted}
        >
          {isLoading ? 'Creating...' : 'Create Public Event'}
        </button>
      </div>
    </form>
  );

  const PrivateEventForm = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Event Name</label>
        <input
          type="text"
          name="name"
          value={privateFormData.name}
          onChange={handlePrivateChange}
          placeholder="Give your event a name"
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={privateFormData.date}
            onChange={handlePrivateChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={privateFormData.time}
            onChange={handlePrivateChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={privateFormData.location}
          onChange={handlePrivateChange}
          placeholder="Add a venue or address"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Maximum Attendees</label>
        <input
          type="number"
          name="maxAttendees"
          value={privateFormData.maxAttendees}
          onChange={handlePrivateChange}
          placeholder="Enter maximum number of guests"
          min="1"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Wager Amount (₦)</label>
        <input
          type="number"
          name="wagerAmount"
          value={privateFormData.wagerAmount}
          onChange={handlePrivateChange}
          min="0"
          placeholder="Entry fee in Naira (optional)"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          name="description"
          value={privateFormData.description}
          onChange={handlePrivateChange}
          placeholder="Tell your invited guests what this event is about"
          rows="4"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Banner Image</label>
        <div className={styles.bannerInputContainer}>
          <input
            type="file"
            name="bannerImage"
            onChange={handlePrivateChange}
            accept="image/jpeg,image/png,image/gif"
          />
          <div className={styles.orDivider}>OR</div>
          <div className={styles.bannerUrlContainer}>
            <input
              type="url"
              name="bannerUrl"
              value={privateFormData.bannerUrl}
              onChange={handlePrivateChange}
              placeholder="Enter banner image URL"
            />
            <button 
              type="button" 
              className={styles.generateButton}
              onClick={() => generateRandomBanner('private', 'private')}
              disabled={loadingBanner}
            >
              {loadingBanner ? 'Generating...' : 'Generate Random'}
            </button>
          </div>
        </div>
        {privateFormData.bannerUrl && (
          <div className={styles.bannerPreview}>
            <img src={privateFormData.bannerUrl} alt="Banner preview" />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.createButton}>
          Create Private Event
        </button>
      </div>
    </form>
  );

  const ChallengeForm = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Challenge Title</label>
        <input
          type="text"
          name="title"
          value={challengeFormData.title}
          onChange={handleChallengeChange}
          placeholder="Name your challenge"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          name="description"
          value={challengeFormData.description}
          onChange={handleChallengeChange}
          placeholder="Describe the challenge rules and objectives"
          rows="4"
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={challengeFormData.startDate}
            onChange={handleChallengeChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={challengeFormData.endDate}
            onChange={handleChallengeChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Wager Amount (₦)</label>
        <input
          type="number"
          name="wagerAmount"
          value={challengeFormData.wagerAmount}
          onChange={handleChallengeChange}
          min="0"
          placeholder="Entry fee in Naira"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Reward</label>
        <input
          type="text"
          name="reward"
          value={challengeFormData.reward}
          onChange={handleChallengeChange}
          placeholder="What will the winner receive?"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Banner Image</label>
        <div className={styles.bannerInputContainer}>
          <input
            type="file"
            name="bannerImage"
            onChange={handleChallengeChange}
            accept="image/jpeg,image/png,image/gif"
          />
          <div className={styles.orDivider}>OR</div>
          <div className={styles.bannerUrlContainer}>
            <input
              type="url"
              name="bannerUrl"
              value={challengeFormData.bannerUrl}
              onChange={handleChallengeChange}
              placeholder="Enter banner image URL"
            />
            <button 
              type="button" 
              className={styles.generateButton}
              onClick={() => generateRandomBanner('challenge', 'challenge')}
              disabled={loadingBanner}
            >
              {loadingBanner ? 'Generating...' : 'Generate Random'}
            </button>
          </div>
        </div>
        {challengeFormData.bannerUrl && (
          <div className={styles.bannerPreview}>
            <img src={challengeFormData.bannerUrl} alt="Banner preview" />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Add Participants</label>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for friends"
            value={searchTerm}
            onChange={handleUserSearch}
          />
        </div>

        {users.length > 0 && (
          <div className={styles.searchResults}>
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                className={styles.userCard}
                onClick={() => {
                  setChallengeFormData({
                    ...challengeFormData,
                    participants: [...challengeFormData.participants, user]
                  });
                }}
              >
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className={styles.userAvatar}
                />
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>{user.name}</h3>
                  <p className={styles.userHandle}>@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {challengeFormData.participants.length > 0 && (
          <div className={styles.selectedParticipants}>
            {challengeFormData.participants.map((participant) => (
              <div key={participant.id} className={styles.participantChip}>
                <img
                  src={participant.avatar_url}
                  alt={participant.name}
                  className={styles.participantAvatar}
                />
                <span>{participant.name}</span>
                <button
                  type="button"
                  className={styles.removeParticipant}
                  onClick={() => {
                    setChallengeFormData({
                      ...challengeFormData,
                      participants: challengeFormData.participants.filter(
                        (p) => p.id !== participant.id
                      )
                    });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.createButton}>
          Create Challenge
        </button>
      </div>
    </form>
  );

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <i className="exit_icon"></i>
          </button>
          <h1 className={styles.title}>Create Event</h1>
        </div>

        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('public')}
            className={`${styles.tabButton} ${activeTab === 'public' ? styles.active : ''}`}
          >
            <i className="public_icon"></i>
            <div className={styles.tabInfo}>
              <h3>Public Event</h3>
              <p>Anyone can see and join</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('private')}
            className={`${styles.tabButton} ${activeTab === 'private' ? styles.active : ''}`}
          >
            <i className="friends_icon"></i>
            <div className={styles.tabInfo}>
              <h3>Private Event</h3>
              <p>Only invited people can join</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('challenge')}
            className={`${styles.tabButton} ${activeTab === 'challenge' ? styles.active : ''}`}
          >
            <i className="gaming_icon"></i>
            <div className={styles.tabInfo}>
              <h3>Challenge</h3>
              <p>Create a competition</p>
            </div>
          </button>
        </div>

        <div className={styles.formContainer}>
          {activeTab === 'public' && <PublicEventForm />}
          {activeTab === 'private' && <PrivateEventForm />}
          {activeTab === 'challenge' && <ChallengeForm />}
        </div>
      </Card>
    </div>
  );
}

export default CreateEvent;
