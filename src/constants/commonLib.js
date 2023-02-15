import axios from "axios";
import moment from "moment/moment";

//import useLocalStorage from "../hooks/useLocalStorage";
import { apiBaseUrl, apiToken } from "./variables";

export function formatTime(timestamp) {
  //const str = new Date(timestamp);

  //console.log(new Date(timestamp));
  //console.log(str.toLocaleDateString());
  const todaysDate = Date.now();
  const isThisHour = moment(timestamp).isSame(todaysDate, "hour");
  // if (isThisHour) {
  //     return moment(timestamp).fromNow();
  // }

  // const isToday = moment(timestamp).isSame(timestamp2, "day");
  // if (isToday) {
  //     return moment(timestamp).fromNow();
  // }
  const isThisWeek = moment(timestamp).isSame(todaysDate, "week");

  if (isThisWeek) {
    return moment(timestamp).fromNow();
  }

  //console.log(isThisWeek);

  return moment(timestamp).format("MMM Do YYYY");
}

export async function getSinglePost(postid) {
  console.log("Retrieving post ID: " + postid);
  const singlePostApiUrl = apiBaseUrl + "/posts/" + postid + "?_author=true&_comments=true&_reactions=true";
  try {
    axios.defaults.headers.common = { Authorization: `Bearer ${apiToken}` };
    const response = await axios.get(singlePostApiUrl);
    console.log(response);
    if (response.status === 200) {
      //return true;
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
