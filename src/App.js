import { useEffect, useState } from "react";
import Router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatePostPopup from "./components/posts/CreatePostPopup";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Portal from "./utils/Portal";
import CreateEvent from "./components/home/events/CreateEvent";
import SplashScreen from "./components/SplashScreen/SplashScreen.tsx";


export const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const user = useSelector((state) => ({ ...state.user.userinfo }));
  const theme = useSelector((state) => state.user.theme);
  const createPost = useSelector((state) => state.createPost);

  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          <Toaster position="top-center" reverseOrder={false} />
          <Router />
          {createPost && <Portal />}
        </>
      )}
    </QueryClientProvider>
  );
}

export default App;
