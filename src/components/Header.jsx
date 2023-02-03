import { useContext } from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Header() {
  const [socialUsers, setSocialUsers] = useLocalStorage("socialUsersFollowed", null);
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [activePage, setActivePage] = useState("home");
  const history = useNavigate();

  function doLogout() {
    setIsLoggedIn(null);
    setSocialUsers(null);
    history("/");
  }

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img className="navbar-brand-logo" title="Myfriends Logo" alt="MyFriends Logo" aria-label="MyFriends Logo" src="/images/MyFriends-logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/profiles" className="nav-link" end>
                  Profiles
                </NavLink>
                <NavLink to="/post" className="nav-link" end>
                  New Post
                </NavLink>
                <NavLink to={`/profiles/${isLoggedIn.name}`} className="nav-link">
                  My Activity
                </NavLink>
              </>
            ) : (
              ""
            )}
          </Nav>
          {isLoggedIn ? (
            <Nav>
              <NavLink to="#" className="nav-link" onClick={doLogout}>
                {isLoggedIn.name} (Logout)
              </NavLink>
            </Nav>
          ) : (
            ""
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
