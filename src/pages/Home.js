import React from "react";
import { Container } from "react-bootstrap";
import AllPosts from "../components/AllPosts";
import LoginUser from "../components/LoginUser";
import NewUserForm from "../components/NewUserForm";
import useLocalStorage from "../hooks/useLocalStorage";

function Home() {
  const [loggedIn, setLoggedIn] = useLocalStorage("socialSessionInfo", null);
  return (
    <>
      {loggedIn ? (
        <AllPosts />
      ) : (
        <Container>
          <NewUserForm />
          <LoginUser />
        </Container>
      )}
    </>
  );
}

export default Home;
