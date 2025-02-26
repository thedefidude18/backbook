import { useEffect, useState } from "react";
import Router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatePostPopup from "./components/posts/CreatePostPopup";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Portal from "./utils/Portal";
import CreateEvent from "./components/home/events/CreateEvent";
import SplashScreen from "./components/SplashScreen/SplashScreen.tsx";
import MobileFooterNav from "./components/mobileNav/MobileFooterNav";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404 errors
        if (error?.response?.status === 404) return false;
        // Otherwise, retry up to 3 times
        return failureCount < 3;
      },
      onError: (error) => {
        console.log("Query error:", error.message);
        // Log the URL that failed
        if (error.config && error.config.url) {
          console.log("Failed URL:", error.config.url);
        }
      }
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const theme = useSelector((state) => state.user.theme);
  const createPost = useSelector((state) => state.createPost);
  const isCreatePostOpen = useSelector((state) => state.createPost.isOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <>
            <div className={`${theme}`}>
              <Router />
              {isCreatePostOpen && <CreatePostPopup user={user} />}
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={10}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  className: "",
                  duration: 5000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: "green",
                      secondary: "black",
                    },
                  },
                }}
              />
              <MobileFooterNav />
            </div>
          </>
        )}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
