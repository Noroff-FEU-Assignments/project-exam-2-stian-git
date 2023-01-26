import "./App.scss";
import { SessionProvider } from "./context/SessionContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import ViewProfiles from "./pages/ViewProfiles";
import ViewSingleProfile from "./pages/ViewSingleProfile";
import SinglePost from "./pages/SinglePost";
import Header from "./components/Header";

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/post/:postid" element={<SinglePost />} />
            <Route path="/post/:postid/edit" element={<Post />} />
            <Route path="/profiles" element={<ViewProfiles />} />
            <Route path="/profiles/:username" element={<ViewSingleProfile />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
