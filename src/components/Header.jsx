import { useState } from "react";
import { NavItem } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import LoginUser from "./LoginUser";
import Logout from "./Logout";
//import logo from "../../public/images/MyFriends-logo.png";

export default function Header() {
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);
  const [activePage, setActivePage] = useState("home");

  // function goToLink(key) {
  //   //e.preventDefault();
  //   //console.log(e.target.dataset.rrUiEventKey);
  //   console.log(key);
  //   setActivePage(key);
  // }
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img className="navbar-brand-logo" title="Myfriends Logo" alt="MyFriends Logo" aria-label="MyFriends Logo" src="images/MyFriends-logo.png" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/profiles" className="nav-link" end>
              Profiles
            </NavLink>
            <NavLink to="/post" className="nav-link">
              New Post
            </NavLink>
            <NavLink to={`/profiles/${loggedIn.name}`} className="nav-link" exact>
              My Activity
            </NavLink>
            {/* <Nav.Link eventKey={"home"} href="/">
              Home
            </Nav.Link>
            <Nav.Link eventKey={"profiles"} href="/profiles">
              Profiles
            </Nav.Link>
            <Nav.Link eventKey={"post"} href="/post">
              New post
            </Nav.Link> */}
          </Nav>
          <Nav>{loggedIn ? <Logout /> : <LoginUser />}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
