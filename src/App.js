//import logo from "./logo.svg";
import { useContext } from "react";
import "./App.scss";
//import { Button } from "react-bootstrap";
import LoginUser from "./components/LoginUser.js";
import Logout from "./components/Logout";
import ShowAllPosts from "./components/AllPosts";
import SessionContext, { SessionProvider } from "./context/SessionContext";
import AllPosts from "./components/AllPosts";

function App() {
    //const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);

    //console.log(isLoggedIn);
    //console.log(typeof isLoggedIn);
    return (
        <SessionProvider>
            <LoginUser />
            <Logout />
            <AllPosts />
            {/* {isLoggedIn.name !== "" ? "Not logged in" : <ShowAllPosts />} */}
        </SessionProvider>
    );
}

export default App;
