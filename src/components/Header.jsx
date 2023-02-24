import { useContext } from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { storageKeyFollowedUsers } from "../constants/variables";
import SessionContext from "../context/SessionContext";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  const [showMenu, setShowMenu] = useState(false);
  const history = useNavigate();

  // A helper function to close the menu.
  function menuClick() {
    setShowMenu(false);
  }

  function doLogout() {
    setIsLoggedIn(null);
    localStorage.removeItem(storageKeyFollowedUsers);
    history("/");
  }

  return (
    <Container className="header">
      <Navbar collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand href="/">
          <img className="navbar-brand-logo" title="Myfriends Logo" alt="MyFriends Logo" aria-label="MyFriends Logo" src="/images/MyFriends-logo.png" onClick={menuClick} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />

        <div id="responsive-navbar-nav" className={`collapse navbar-collapse ${showMenu ? "show" : ""}`}>
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link" onClick={menuClick}>
              <i className="fa-solid fa-house-chimney navbar-link-icon"></i>
              <p className="navbar-link-text">Home</p>
            </NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/profiles" className="nav-link" end onClick={menuClick}>
                  <i className="fa-solid fa-users navbar-link-icon"></i>
                  <p className="navbar-link-text">Profiles</p>
                </NavLink>
                <NavLink to="/post" className="nav-link" end onClick={menuClick}>
                  <i className="fa-solid fa-pen-to-square navbar-link-icon"></i>
                  <p className="navbar-link-text">New Post</p>
                </NavLink>
                <NavLink to={`/profiles/${isLoggedIn.name}`} className="nav-link" onClick={menuClick}>
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
              <NavLink to="/" className="nav-link navbar-link-logout" onClick={doLogout}>
                <i className="fa-solid fa-right-from-bracket navbar-link-icon"></i>
                <p className="navbar-link-text">Logout ({isLoggedIn.name})</p>
              </NavLink>
            </Nav>
          ) : (
            ""
          )}
        </div>
      </Navbar>
    </Container>
  );
}
