import "./App.scss";
import { SessionProvider } from "./context/SessionContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import ViewProfiles from "./pages/ViewProfiles";
import ViewSingleProfile from "./pages/ViewSingleProfile";
import SinglePost from "./pages/SinglePost";
import Header from "./components/Header";
import EditPost from "./pages/EditPost";
import Footer from "./components/Footer";
import Test from "./pages/Test";

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/post" element={<Post />} />
            <Route path="/post/:postid" element={<SinglePost />} />
            <Route path="/post/:postid/edit" element={<EditPost />} />
            <Route path="/profiles" element={<ViewProfiles />} />
            <Route path="/profiles/:username" element={<ViewSingleProfile />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
