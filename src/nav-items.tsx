
import { HomeIcon, Users, BookOpen, Newspaper, User, Bell, Heart, Search, GitCompare } from "lucide-react";
import Index from "./pages/Index.jsx";
import Home from "./pages/Home.jsx";
import Colleges from "./pages/Colleges.jsx";
import Predictor from "./pages/Predictor.jsx";
import CollegePredictor from "./pages/CollegePredictor.jsx";
import CollegeDetails from "./pages/CollegeDetails.jsx";
import News from "./pages/News.jsx";
import Compare from "./pages/Compare.jsx";
import Favorites from "./pages/Favorites.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SearchPage from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Processing from "./pages/Processing.jsx";
import NotFound from "./pages/NotFound.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/home",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Home />,
  },
  {
    title: "Colleges",
    to: "/colleges",
    icon: <Users className="h-4 w-4" />,
    page: <Colleges />,
  },
  {
    title: "Predictor",
    to: "/predictor",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Predictor />,
  },
  {
    title: "College Predictor",
    to: "/college-predictor",
    icon: <BookOpen className="h-4 w-4" />,
    page: <CollegePredictor />,
  },
  {
    title: "College Details",
    to: "/college-details/:id",
    page: <CollegeDetails />,
  },
  {
    title: "News",
    to: "/news",
    icon: <Newspaper className="h-4 w-4" />,
    page: <News />,
  },
  {
    title: "Compare",
    to: "/compare",
    icon: <GitCompare className="h-4 w-4" />,
    page: <Compare />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Heart className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: <Bell className="h-4 w-4" />,
    page: <Notifications />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Profile Page",
    to: "/profile-page",
    icon: <User className="h-4 w-4" />,
    page: <ProfilePage />,
  },
  {
    title: "Search",
    to: "/search",
    icon: <Search className="h-4 w-4" />,
    page: <SearchPage />,
  },
  {
    title: "Index",
    to: "/",
    page: <Index />,
  },
  {
    title: "Login",
    to: "/login",
    page: <Login />,
  },
  {
    title: "Signup",
    to: "/signup",
    page: <Signup />,
  },
  {
    title: "Forgot Password",
    to: "/forgot-password",
    page: <ForgotPassword />,
  },
  {
    title: "Processing",
    to: "/processing",
    page: <Processing />,
  },
  {
    title: "404",
    to: "/404",
    page: <NotFound />,
  },
];
