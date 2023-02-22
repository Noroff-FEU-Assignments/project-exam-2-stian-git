import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";

export default function ShowStatusMessage(props) {
  const [show, setShow] = useState(true);
  const [msg, setMsg] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    //console.log(props);
    //console.log(props.display);
    if (props.display) {
      //console.log("Display is present");
      setShow(true);
    } else {
      setShow(false);
    }
    //console.log(props.text);
    if (props.isSuccess === true) {
      setIsSuccess(true);
    }
    setMsg(props.text);
  }, [props]);

  if (show) {
    return (
      <Alert variant={isSuccess ? "success" : "danger"} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{isSuccess ? "Success!" : "Error!"}</Alert.Heading>
        <p>{msg}</p>
      </Alert>
    );
  }
}
