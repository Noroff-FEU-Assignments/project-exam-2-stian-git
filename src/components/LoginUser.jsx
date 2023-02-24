import React, { useContext, useState } from "react";
import { apiBaseUrl } from "../constants/variables";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import SessionContext from "../context/SessionContext";
import ShowStatusMessage from "./ShowStatusMessage";

const loginUrl = apiBaseUrl + "/auth/login";

// Additional checks are not required at the login as it is controlled upon registration.
const schema = yup.object().shape({
  email: yup.string().required("Please enter your email address"),
  password: yup.string().required("Please enter your password"),
});

function LoginUser() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useContext(SessionContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function doLogin(data) {
    console.log("Logging in,", data);
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      const response = await axios.post(loginUrl, data);
      setIsLoggedIn(response.data);
    } catch (error) {
      // handle error code: 401 (wrong username or password)
      if (error.response.status === 401) {
        setLoginError(true);
      } else {
        setLoginError(true);
      }
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(doLogin)}>
        <fieldset hidden={isLoggedIn}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Control type="email" placeholder="Email" {...register("email")} />
            <Form.Text className="text-muted">{errors.email && <span className="form-requirement">{errors.email.message}</span>}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Control type="password" placeholder="Password" {...register("password")} />
            <Form.Text className="text-muted">{errors.password && <span className="form-requirement">{errors.password.message}</span>}</Form.Text>
          </Form.Group>
          <Button type="submit">{isAuthenticating ? "Logging in" : "Login"}</Button>
        </fieldset>
        <ShowStatusMessage display={loginError} text={"Login failed. Please check username and password."} />
      </Form>
    </>
  );
}

export default LoginUser;
