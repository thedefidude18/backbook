import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeLeft from "../../components/home/left/HomeLeft";
import { useSelector, useDispatch } from "react-redux";
import HomeRight from "../../components/home/right/HomeRight";
import styles from "./style.module.css";
import Stories from "../../components/home/stories/Stories";
import CreatePost from "../../components/home/posts/CreatePost/CreatePost";
import ActivateAccount from "../../components/ActivateAccount/ActivateAccount";
import SendVerification from "../../components/home/SendVerification/SendVerification";
import { logout, updateNStats } from "../../app/slices/userSlice";

import axiosInstance from "../../utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Post from "../../components/posts/post";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../../components/skeleton/PostSkeleton";
import "../../fcm.js";
import { messaging } from "../../fcm";
import { getToken } from "firebase/messaging";
import { useAddFCM } from "../../hooks/useAddFCM";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const fcm = useSelector((state) => state.user.fcm);
  const { token } = useParams();
  const { ref, inView } = useInView();

  const { mutate } = useAddFCM();

  async function requestPermission() {
    try {
      // Check if the browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
      }

      // Check if service worker is registered and active
      if (!navigator.serviceWorker.ready) {
        console.log("Service worker not ready yet");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready;
          
          // Make sure messaging is properly initialized
          if (!messaging) {
            console.log("Firebase messaging not initialized");
            return;
          }
          
          const token = await getToken(messaging, {
            vapidKey: "BJSPwo1aXb5un4sORg-jEcznSFs7QmuIhoFTNT6Se8Zje-r69aH5xxJAlFqDM9Y5SA3QJ5-1xiGfYOkADCT4dZs",
            serviceWorkerRegistration: registration
          });
          
          if (fcm !== token) {
            mutate({ fcm: token });
          }
        } catch (tokenError) {
          console.log("Error getting token:", tokenError);
        }
      } else if (permission === "denied") {
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.log("Error requesting notification permission:", error);
    }
  }

  // Fetch combined feed of posts and events
  const fetchCombinedFeed = async ({ pageParam = 1 }) => {
    const { data } = await axiosInstance.get(
      `/posts/getAllPosts?sort=-createdAt&limit=10&page=${pageParam}&includeEvents=true`
    );
    return data;
  };

  const {
    isLoading,
    error,
    isSuccess,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["combinedFeed"],
    queryFn: fetchCombinedFeed,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) {
        return undefined;
      } else {
        return pages.length + 1;
      }
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 2000,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const {
    refetch,
    error: pingError,
    data: pingdata,
  } = useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.put(
          `/users/ping`
        );
        return data;
      } catch (error) {
        // Silently handle ping failures
        console.warn("Ping failed:", error.message);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: false,
    retry: false,
  });

  const postsSkeleton = isFetching || isLoading;

  const postsData = data || [];

  useEffect(() => {
    if (token && user.verified) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    requestPermission();
    refetch();
  }, []);

  useEffect(() => {
    if (pingdata) {
      dispatch(
        updateNStats({
          recivedRequestsCount: pingdata?.recivedRequestsCount,
          unseenMessages: pingdata?.unseenMessages,
          unseenNotification: pingdata?.unseenNotification,
        })
      );
    }
    if (pingError) {
      dispatch(logout());
    }
  }, [data, error]);

  // Function to render the appropriate component based on item type
  const renderFeedItem = (item) => {
    if (item.type === 'event') {
      // Render event card in the feed
      return <Post post={item} key={item._id} />;
    } else {
      // Render regular post
      return <Post post={item} key={item._id} />;
    }
  };

  return (
    <div className={styles.home}>
      <HomeLeft user={user} />
      <HomeRight user={user} />
      <div className={styles.home_middle}>
        <Stories />
        {token && !user.verified && <ActivateAccount token={token} />}
        {!user.verified && <SendVerification />}
        <CreatePost user={user} />
        <div className={styles.posts}>
          {postsSkeleton && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
          {isSuccess &&
            !isLoading &&
            !error &&
            postsData &&
            data.pages.map &&
            data.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.map((item) => (
                  <React.Fragment key={item._id}>
                    {renderFeedItem(item)}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
        </div>
        <div
          ref={ref}
          disabled={!hasNextPage || isFetchingNextPage}
          style={{ marginBottom: "20px" }}
        >
          {isFetchingNextPage ? (
            <div className={styles.posts}>
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : hasNextPage ? (
            "Loading Newer"
          ) : (
            "You have reached the end"
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
