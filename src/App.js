//import logo from "./logo.svg";
import { useContext, useEffect } from "react";
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
import useLocalStorage from "./hooks/useLocalStorage";
import SinglePost from "./pages/SinglePost";

function App() {
    const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);
    console.log(loggedIn.name);
    return (
        <SessionProvider>
            <BrowserRouter>
                <nav>
                    <Link to="/"> Home |</Link>
                    {loggedIn ? <Link to="/post"> New Post |</Link> : ""}
                    {loggedIn ? <Link to="/profiles"> View Profiles |</Link> : ""}
                    {loggedIn ? <Link to={`/profiles/${loggedIn.name}`}> {loggedIn.name} |</Link> : "not logged in"}
                    {/* <Link to="/">Home</Link> */}
                    {loggedIn ? "" : <LoginUser />}
                    {loggedIn ? <Logout /> : ""}
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/post/:postid" element={<SinglePost />} />
                    <Route path="/profiles" element={<ViewProfiles />} />
                    <Route path="/profiles/:username" element={<ViewSingleProfile />} />
                    {/* <Route path="" element={} /> */}
                </Routes>
            </BrowserRouter>
        </SessionProvider>
    );
}

export default App;
