import moment from "moment";

function FormatTimeStamp(props) {
  const todaysDate = Date.now();
  // Checks if the timestamp is in this week.
  const isThisWeek = moment(props.timestamp).isSame(todaysDate, "week");
  // returns a value of how long time ago it is.
  if (isThisWeek) {
    return moment(props.timestamp).fromNow();
  }
  // otherwise it returns the timestamp of syntax. example: Feb 15th 2023
  return moment(props.timestamp).format("MMM Do YYYY");
}

export default FormatTimeStamp;
