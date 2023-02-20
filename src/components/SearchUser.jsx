import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { allowedUserNameRegex } from "../constants/variables";

const schema = yup.object().shape({
  searchstring: yup.string().required("Username is required.").matches(allowedUserNameRegex, "Please avoid punctuation marks."),
});

function SearchUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function doSearch(data) {
    window.location.href = "/profiles/" + data.searchstring;
  }
  return (
    <Form onSubmit={handleSubmit(doSearch)} className="searchform">
      <Form.Group className="searchform__name" controlId={`formNameSearch`}>
        <Form.Control placeholder="Profile search" className="searchform__name-input" {...register("searchstring")} />
        <Button variant="primary" type="submit" className="searchform__name-submitbutton">
          Search
        </Button>
      </Form.Group>
    </Form>
  );
}

export default SearchUser;
