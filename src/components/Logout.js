import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import SessionContext from "../context/SessionContext";

function Logout() {
    const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);

    function doLogout() {
        //console.log("Logging out now...");
        setIsLoggedIn(null);
    }
    return <>{isLoggedIn ? <Button onClick={doLogout}>Logout</Button> : ""}</>;
}

export default Logout;
