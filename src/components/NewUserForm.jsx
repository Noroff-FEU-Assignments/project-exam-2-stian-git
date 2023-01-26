import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { apiBaseUrl, mediaUrlSyntax, validEmailDomains } from "../constants/variables";
import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Image } from "react-bootstrap";

const regUserApiUrl = apiBaseUrl + "/auth/register";

const schema = yup.object().shape({
  name: yup.string().required("Please enter a name"),
  email: yup
    .string()
    .email()
    .required("A valid email is required.")
    .test("Domain check", "Email domain is not accepted", function (email) {
      const enteredDomain = email.split("@")[1];
      return validEmailDomains.includes(enteredDomain);
      //console.log(email);
      //return isValid;
    }),
  password: yup.string().required("You don`t want a blank password."),
  password_recheck: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  avatar: yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"),
  banner: yup.string().matches(mediaUrlSyntax, "Please enter a valid url to an image"),
});
function NewUserForm() {
  const [isSending, setIsSending] = useState(false);
  const [regFailed, setRegFailed] = useState(null);
  const [avatarError, setAvatarError] = useState(null);
  const [bannerError, setBannerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function registerUser(data) {
    console.log(data);
  }

  function showPreview() {
    // show image...
  }
  function imageError(e) {
    console.log(e);
    e.target.style.display = "none";

    // Identify avatar or banner and set the proper message:
    //errors.avatar = "Image could not be loaded. Please check your url.";
  }
  return (
    <Form onSubmit={handleSubmit(registerUser)}>
      <Form.Group className="mb-3" controlId="regUserFormName">
        <Form.Control type="text" placeholder="Name" {...register("name")} />
        <Form.Text className="text-muted">{errors.name ? <span className="form-requirement">{errors.name.message}</span> : ""}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormEmail">
        <Form.Control type="text" placeholder="Email" {...register("email")} />
        <Form.Text className="text-muted">{errors.email ? <span className="form-requirement">{errors.email.message}</span> : ""}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormPassword">
        <Form.Control type="password" placeholder="Password" {...register("password")} />
        <Form.Text className="text-muted">{errors.password ? <span className="form-requirement">{errors.password.message}</span> : ""}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormPasswordRecheck">
        <Form.Control type="password" placeholder="Retype Password" {...register("password_recheck")} />
        <Form.Text className="text-muted">{errors.password_recheck ? <span className="form-requirement">{errors.password_recheck.message}</span> : ""}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormAvatar">
        <Form.Control type="text" onKeyUp={showPreview} placeholder="Avatar URL" {...register("avatar")} />
        <Form.Text className="text-muted">{errors.avatar ? <span className="form-requirement">{errors.avatar.message}</span> : <Image className="mediaThumb" src={document.querySelector("#regUserFormAvatar")?.value} onError={imageError} thumbnail />}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormBanner">
        <Form.Control type="text" onKeyUp={showPreview} placeholder="Banner URL" {...register("banner")} />
        <Form.Text className="text-muted">{errors.banner ? <span className="form-requirement">{errors.banner.message}</span> : <Image className="mediaThumb" src={document.querySelector("#regUserFormBanner")?.value} onError={imageError} thumbnail />}</Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default NewUserForm;
