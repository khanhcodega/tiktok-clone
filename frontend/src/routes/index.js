//Page
import HomePage from "~/pages/HomePage";
import ExplorePage from "~/pages/ExplorePage";
import UploadPage from "~/pages/Upload";
import FollowingPage from "~/pages/FollowingPage";
import ActivityPage from "~/pages/ActivityPage";
import FriendsPage from "~/pages/FriendsPage";
import MessagePage from "~/pages/MessagePage";
import ProfilePage from "~/pages/ProfilePage";

//layout
import { Upload } from "~/components/Layouts";
const publicRoutes = [
  { path: "/", component: HomePage },
  { path: "/explore", component: ExplorePage },
  { path: "/following", component: FollowingPage },
  { path: "/activity", component: ActivityPage },
  { path: "/friends", component: FriendsPage },
  { path: "/messages", component: MessagePage },
  { path: "/messages", component: MessagePage },
  { path: "/profile", component: ProfilePage },
  { path: "/upload", component: UploadPage, layout: Upload }
];

const privateroutes = [];

export { publicRoutes, privateroutes };
