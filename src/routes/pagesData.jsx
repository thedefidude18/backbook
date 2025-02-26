import React from "react";
import CreateEvent from "../components/home/events/CreateEvent";

const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));
const Forgot = React.lazy(() => import("../pages/forgot"));
const Profile = React.lazy(() => import("../pages/profile"));
const FriendsPage = React.lazy(() => import("../pages/friends"));
const PostPage = React.lazy(() => import("../pages/post/PostPage"));
const Messages = React.lazy(() => import("../pages/messages"));
const Wallet = React.lazy(() => import("../pages/wallet"));
const Challenges = React.lazy(() => import("../pages/challenges"));
const Leaderboard = React.lazy(() => import("../pages/leaderboard"));
const MyEvents = React.lazy(() => import("../pages/events/MyEvents"));
const EventHistory = React.lazy(() => import("../pages/events/EventHistory"));
const Referral = React.lazy(() => import("../pages/referrals")); // Changed from "../pages/referral" to "../pages/referrals"

const pagesData = [
  {
    path: "",
    element: <Home />,
    title: "home",
    priv: true,
  },
  {
    path: "/activate/:token",
    element: <Home />,
    title: "home",
    priv: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    title: "profile",
    priv: true,
  },
  {
    path: "/messages",
    element: <Messages />,
    title: "messages",
    priv: true,
  },
  {
    path: "/messages/:chatId",
    element: <Messages />,
    title: "messages",
    priv: true,
  },
  {
    path: "/friends",
    element: <FriendsPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "/friends/:type",
    element: <FriendsPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "/profile/:username",
    element: <Profile />,
    title: "profile",
    priv: true,
  },
  {
    path: "challenges",
    element: <Challenges />,
    title: "Challenges",
    priv: true,
  },
  {
    path: "leaderboard",
    element: <Leaderboard />,
    title: "Leaderboard",
    priv: true,
  },
  {
    path: "myevents",
    element: <MyEvents />,
    title: "My Events",
    priv: true,
  },
  {
    path: "events/history",
    element: <EventHistory />,
    title: "Event History",
    priv: true,
  },
  {
    path: "/:username/posts/:post",
    element: <PostPage />,
    title: "profile",
    priv: true,
  },
  {
    path: "forgot",
    element: <Forgot />,
    title: "home",
    priv: false,
  },
  {
    path: "login",
    element: <Login />,
    title: "login",
    priv: false,
  },
  {
    path: "create-event",
    element: <CreateEvent />,
    title: "Create Event",
    priv: true,
  },
  {
    path: "wallet",
    element: <Wallet />,
    title: "wallet",
    priv: true,
  },
  {
    path: "referral",
    element: <Referral />,
    title: "Referral Program",
    priv: true,
  },
];

export default pagesData;
