import moment from "moment";
import React from "react";

function FormatTimeStamp(props) {
  const todaysDate = Date.now();
  const isThisHour = moment(props.timestamp).isSame(todaysDate, "hour");
  // if (isThisHour) {
  //     return moment(props.timestamp).fromNow();
  // }

  // const isToday = moment(props.timestamp).isSame(props.timestamp2, "day");
  // if (isToday) {
  //     return moment(props.timestamp).fromNow();
  // }
  const isThisWeek = moment(props.timestamp).isSame(todaysDate, "week");

  if (isThisWeek) {
    return moment(props.timestamp).fromNow();
  }

  //console.log(isThisWeek);

  return moment(props.timestamp).format("MMM Do YYYY");
  // return (
  //   <div>FormatTimeStamp</div>
  // )
}

export default FormatTimeStamp;
