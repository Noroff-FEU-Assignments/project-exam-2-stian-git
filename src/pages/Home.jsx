import React, { useContext } from "react";
import { Accordion, Container } from "react-bootstrap";
import AllPosts from "../components/AllPosts";
import LoginUser from "../components/LoginUser";
import NewUserForm from "../components/NewUserForm";
import SessionContext from "../context/SessionContext";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);
  return (
    <>
      {isLoggedIn ? (
        <AllPosts />
      ) : (
        <Container>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Login</Accordion.Header>
              <Accordion.Body>
                <LoginUser />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>New User</Accordion.Header>
              <Accordion.Body>
                <NewUserForm />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      )}
    </>
  );
}

export default Home;
