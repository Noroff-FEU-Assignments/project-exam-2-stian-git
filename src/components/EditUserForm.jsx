// Add error and success message ?
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { apiBaseUrl, mediaUrlSyntax } from "../constants/variables";
import axios from "axios";

const schema = yup.object().shape({
  avatar: yup.string().matches(mediaUrlSyntax, { message: "Please enter a valid url to an image", excludeEmptyString: true }),
  banner: yup.string().matches(mediaUrlSyntax, { message: "Please enter a valid url to an image", excludeEmptyString: true }),
});

function EditUserForm(props) {
  // props should be a user object incl. name, email, banner, avatar, followers, following, _count
  const [isSending, setIsSending] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Loads and sets the existing images:
  useEffect(() => {
    setAvatarImage(props.user?.avatar);
    setBannerImage(props.user?.banner);
  }, [props]);

  async function updateUser(data) {
    setIsSending(true);
    const updateUserApiUrl = apiBaseUrl + "/profiles/" + props.user.name + "/media";
    try {
      const response = await axios.put(updateUserApiUrl, data);
      if (response.status === 200) {
        setEditSuccess(true);
        // Add a success message below the button?
      }
    } catch (error) {
      setUpdateFailed(error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Container className="userform">
      <Col md={6}>
        <Form onSubmit={handleSubmit(updateUser)} className="userform__form">
          <Form.Group className="mb-3" controlId="regUserFormAvatar">
            <Form.Control type="text" onKeyUp={(e) => setAvatarImage(e.target.value)} placeholder="Avatar URL" {...register("avatar")} defaultValue={props.user?.avatar ? props.user.avatar : ""} />
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
            <Form.Control type="text" onKeyUp={(e) => setBannerImage(e.target.value)} placeholder="Banner URL" {...register("banner")} defaultValue={props.user?.banner ? props.user.banner : ""} />
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
          <Button variant="primary" type="submit" className="userform__form-button">
            {isSending ? "Updating" : "Update Profile"}
          </Button>
        </Form>
      </Col>
    </Container>
  );
}

export default EditUserForm;
