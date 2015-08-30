import HomePage from "./components/HomePage";
import DeveloperPage from "./components/DeveloperPage";
import DeveloperListPage from "./components/DeveloperListPage";
import { requestDeveloper, requestAllDevelopers } from "./actions/developers";

export default {

  "home": {
    path: "/",
    method: "get",
    handler: HomePage
  },

  "developer": {
    path: "/developer/:name",
    method: "get",
    handler: DeveloperPage,
    actionCreator: requestDeveloper
  },

  "developerRoot": {
    path: "/developer",
    method: "get",
    handler: DeveloperPage,
    actionCreator: requestDeveloper  // this will generate a server-side error since we don't have a :username param
  },

  "developers": {
    path: "/developers",
    method: "get",
    handler: DeveloperListPage,
    actionCreator: requestAllDevelopers
  }

}
