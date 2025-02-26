import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Card from "../UI/Card/Card";
import FormLoader from "../FormLoader";
import classes from "./ProfileCard.module.css";
import { useRelationship } from "../../hooks/useRealationship";

function ProfileCard({ userId, onClose }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => ({ ...state.user.userinfo }));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/getProfile/${userId}`,
          {
            withCredentials: true,
          }
        );
        setProfile(data.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Use the existing relationship hook
  const { mutate, data, isSuccess } = useRelationship(profile?.username);

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    if (!profile) return;
    
    if (profile.friendship?.following) {
      mutate({ id: profile._id, type: "unfriend" });
    } else {
      mutate({ id: profile._id, type: "follow" });
    }
  };

  // Update local state when relationship changes
  useEffect(() => {
    if (isSuccess && data?.status === "success" && profile) {
      setProfile(prev => ({
        ...prev,
        friendship: data.data.friendship
      }));
    }
  }, [isSuccess, data]);

  // Handle challenge
  const handleChallenge = () => {
    // Implement challenge functionality or navigate to challenge page
    navigate(`/challenge/${profile.username}`);
  };

  if (loading || !profile) {
    return (
      <div className={classes.overlay}>
        <Card className={classes.card}>
          <FormLoader />
        </Card>
      </div>
    );
  }

  return (
    <div className={classes.overlay}>
      <Card className={classes.card}>
        {/* Close Button */}
        <div className={classes.closeButton} onClick={onClose}>
          <i className="exit_icon"></i>
        </div>

        {/* Profile Content */}
        <div className={classes.content}>
          {/* Profile Info */}
          <div className={classes.profileInfo}>
            <img
              src={profile.photo}
              alt={profile.first_name}
              className={classes.avatar}
            />
            <div>
              <h2 className={classes.name}>{profile.first_name} {profile.last_name}</h2>
              <p className={classes.username}>@{profile.username}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={classes.statsGrid}>
            <div className={classes.statCard}>
              <div className={classes.statIcon}>
                <i className="win_icon"></i>
              </div>
              <p className={classes.statLabel}>Win Rate</p>
              <p className={classes.statValue}>{profile.stats?.winRate || 0}%</p>
            </div>
            <div className={classes.statCard}>
              <div className={classes.statIcon}>
                <i className="friends_icon"></i>
              </div>
              <p className={classes.statLabel}>Followers</p>
              <p className={classes.statValue}>{profile.friendsCount || 0}</p>
            </div>
            <div className={classes.statCard}>
              <div className={classes.statIcon}>
                <i className="following_icon"></i>
              </div>
              <p className={classes.statLabel}>Following</p>
              <p className={classes.statValue}>{profile.followingCount || 0}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUser._id !== profile._id && (
            <div className={classes.actionButtons}>
              <button
                onClick={handleFollowToggle}
                className={`${classes.actionButton} ${
                  profile.friendship?.following ? classes.unfollowButton : classes.followButton
                }`}
                disabled={false}
              >
                {profile.friendship?.following ? "Unfollow" : "Follow"}
              </button>

              <button
                onClick={handleChallenge}
                className={classes.challengeButton}
              >
                Challenge
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ProfileCard;