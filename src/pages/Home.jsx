import React, { useContext } from "react";
import { Accordion, Container } from "react-bootstrap";
import AllPosts from "../components/AllPosts";
import LoginUser from "../components/LoginUser";
import NewUserForm from "../components/NewUserForm";
import { validEmailDomains } from "../constants/variables";
import SessionContext from "../context/SessionContext";

function Home() {
  const [isLoggedIn] = useContext(SessionContext);
  return (
    <>
      {isLoggedIn ? (
        <AllPosts />
      ) : (
        <>
          <Container>
            <h1>Welcome to Myfriends!</h1>
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
            <div>
              <h2>A social media completely without advertising. </h2>
              <p>Share events from your life, inspire others and stay connected.</p>
              <ul>
                <li>Get new friends.</li>
                <li>Comment and react to posts.</li>
                <li>Create your own posts.</li>
                <li>Follow other users.</li>
              </ul>
              <p>Just register and login to start socialising right now!</p>
              <i>Valid domains: {validEmailDomains.map((domain, index) => `${domain}${index === validEmailDomains.length - 1 ? "." : ","} `)}</i>
            </div>
          </Container>
        </>
      )}
    </>
  );
}

export default Home;
