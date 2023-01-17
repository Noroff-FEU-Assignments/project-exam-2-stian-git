//import logo from "./logo.svg";
import { useContext } from "react";
import "./App.scss";
//import { Button } from "react-bootstrap";
import LoginUser from "./components/LoginUser.js";
import Logout from "./components/Logout";
import ShowAllPosts from "./components/AllPosts";
import SessionContext, { SessionProvider } from "./context/SessionContext";
import AllPosts from "./components/AllPosts";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import ViewProfiles from "./pages/ViewProfiles";
import ViewSingleProfile from "./pages/ViewSingleProfile";

function App() {
    //const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);

    //console.log(isLoggedIn);
    //console.log(typeof isLoggedIn);
    return (
        <SessionProvider>
            <BrowserRouter>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/post">New Post</Link>
                    <Link to="/profiles">View Profiles</Link>
                    <LoginUser />
                    <Logout />
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/profiles" element={<ViewProfiles />} />
                    <Route path="/profiles/:username" element={<ViewSingleProfile />} />
                </Routes>
            </BrowserRouter>
        </SessionProvider>
    );
}

export default App;
