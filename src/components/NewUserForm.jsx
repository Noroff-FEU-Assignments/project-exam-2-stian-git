import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { allowedUserNameRegex, apiBaseUrl, mediaUrlSyntax, minPasswordLength, validEmailDomains } from "../constants/variables";
import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Image } from "react-bootstrap";
import axios from "axios";
import ShowStatusMessage from "./ShowStatusMessage";

const regUserApiUrl = apiBaseUrl + "/auth/register";

// Notice that we control things like email domain and image extensions here, which can be customized in the variables.
const schema = yup.object().shape({
  name: yup.string().required("Username is required.").matches(allowedUserNameRegex, "Please avoid punctuation marks."),
  email: yup
    .string()
    .email()
    .required("A valid email is required.")
    .test("Domain check", `Email domain not accepted. (Valid: ${validEmailDomains.map((domain, index) => `${domain}${index === validEmailDomains.length - 1 ? "." : ""}`)}) `, function (email) {
      const enteredDomain = email.split("@")[1]?.toLowerCase();
      return validEmailDomains.includes(enteredDomain);
    }),
  password: yup.string().min(minPasswordLength, `Minimum length is ${minPasswordLength} characters.`).required("You don`t want a blank password."),
  password_recheck: yup
    .string()
    .required("Retyped password must match the above.")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  avatar: yup.string().matches(mediaUrlSyntax, { message: "Please enter a valid url to an image", excludeEmptyString: true }),
  banner: yup.string().matches(mediaUrlSyntax, { message: "Please enter a valid url to an image", excludeEmptyString: true }),
});

function NewUserForm() {
  const [isSending, setIsSending] = useState(false);
  const [regFailed, setRegFailed] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function registerUser(data) {
    setIsSending(true);
    try {
      const response = await axios.post(regUserApiUrl, data);
      if (response.status === 200 || response.status === 201) {
        setRegSuccess(true);
        reset();
      }
    } catch (error) {
      setRegFailed(error);
    } finally {
      setIsSending(false);
    }
  }

  function showPreview(e) {
    const imageUrl = e.target.value;
    switch (e.target.id) {
      case "regUserFormAvatar":
        setAvatarImage(imageUrl);
        break;
      default:
        // default = regUserFormBanner:
        setBannerImage(imageUrl);
        break;
    }
  }
  return (
    <Form onSubmit={handleSubmit(registerUser)}>
      <Form.Group className="mb-3" controlId="regUserFormName">
        <Form.Control type="text" placeholder="Username" {...register("name")} />
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
        <Form.Text className="text-muted">
          {errors.avatar ? (
            <span className="form-requirement">{errors.avatar.message}</span>
          ) : (
            <Image
              className="mediaThumb"
              src={avatarImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
              onLoad={(e) => {
                e.target.style.display = "inline";
              }}
            />
          )}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="regUserFormBanner">
        <Form.Control type="text" onKeyUp={showPreview} placeholder="Banner URL" {...register("banner")} />
        <Form.Text className="text-muted">
          {errors.banner ? (
            <span className="form-requirement">{errors.banner.message}</span>
          ) : (
            <Image
              className="mediaThumb"
              src={bannerImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
              onLoad={(e) => {
                e.target.style.display = "inline";
              }}
            />
          )}
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        {isSending ? "Submitting" : "Submit"}
      </Button>
      {/* {regFailed ? <ShowStatusMessage text={"Registration failed. Maybe your username or email is already registered?"} /> : ""} */}
      <ShowStatusMessage display={regFailed} text={"Registration failed. Maybe your username or email is already registered?"} />
      <ShowStatusMessage display={regSuccess} text={`User registration success. Please login above.`} isSuccess={true} />
    </Form>
  );
}

export default NewUserForm;
