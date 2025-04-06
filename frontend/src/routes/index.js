//Page
import HomePage from "~/pages/HomePage";
import ExplorePage from "~/pages/ExplorePage";
import UploadPage from "~/pages/Upload";
import FollowingPage from "~/pages/FollowingPage";

//layout
import { SidebarOnly } from "~/components/Layouts";
import { Upload } from "~/components/Layouts";
const publicRoutes = [
  { path: "/", component: HomePage },
  { path: "/explore", component: ExplorePage },
  { path: "/following", component: FollowingPage },

  { path: "/upload", component: UploadPage, layout: Upload }
];

const privateroutes = [];

export { publicRoutes, privateroutes };
