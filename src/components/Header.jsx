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
    <Container>
      <Navbar collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand href="/">
          <img className="navbar-brand-logo" title="Myfriends Logo" alt="MyFriends Logo" aria-label="MyFriends Logo" src="/images/MyFriends-logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              <i className="fa-solid fa-house-chimney navbar-link-icon"></i>
              <p className="navbar-link-text">Home</p>
            </NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/profiles" className="nav-link" end>
                  <i className="fa-solid fa-users navbar-link-icon"></i>
                  <p className="navbar-link-text">Profiles</p>
                </NavLink>
                <NavLink to="/post" className="nav-link" end>
                  <i className="fa-solid fa-pen-to-square navbar-link-icon"></i>
                  <p className="navbar-link-text">New Post</p>
                </NavLink>
                <NavLink to={`/profiles/${isLoggedIn.name}`} className="nav-link">
                  <i className="fa-solid fa-circle-user navbar-link-icon"></i>
                  {/* concider profile image instead? */}
                  <p className="navbar-link-text">My Activity</p>
                </NavLink>
              </>
            ) : (
              ""
            )}
          </Nav>
          {isLoggedIn ? (
            <Nav>
              <NavLink to="/" className="nav-link" onClick={doLogout}>
                <i className="fa-solid fa-right-from-bracket navbar-link-icon"></i>
                <p className="navbar-link-text">Logout ({isLoggedIn.name})</p>
              </NavLink>
            </Nav>
          ) : (
            ""
          )}
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}
