import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
const UserRegistration = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    userRole: "freelancer",
  };
  const [stateObj, setStateObj] = useState(initialState);
  const submitHandler = async (e) => {
    e.preventDefault();
    let resp;
    try {
      resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/createAdminPanelUser`,
        stateObj
      );
      console.log("User", resp.data.data);
      alert(
        `User ${resp.data.data.firstName} ${resp.data.data.lastName} user created successfully`
      );
      setStateObj(initialState);
    } catch (e) {
      debugger;
      alert(`Some error occurred:- ${e.response.data.message}`);
    }
  };
  const onChange = (e) => {
    setStateObj((prev) => {
      prev[e.target.name] = e.target.value;
      return { ...prev };
    });
  };
  console.log("stateObj", stateObj);
  return (
    <Container>
      <Row>
        <Col className="text-info my-3 py-3">User Registration</Col>
      </Row>
      <Form onSubmit={submitHandler}>
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={8}>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs={6}>
                <FormGroup className="d-flex flex-column items-start">
                  <Label
                    for="firstName"
                    className="px-2"
                    style={{ textAlign: "left" }}
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={stateObj?.firstName}
                    required
                    onChange={onChange}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup className="d-flex flex-column items-start">
                  <Label
                    for="lastName"
                    className="px-2"
                    style={{ textAlign: "left" }}
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={stateObj?.lastName}
                    onChange={onChange}
                    placeholder="Last Name"
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup className="d-flex flex-column items-start">
                  <Label
                    for="email"
                    className="px-2"
                    style={{ textAlign: "left" }}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={stateObj?.email}
                    onChange={onChange}
                    placeholder="Email"
                    required
                    type="email"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup className="d-flex flex-column items-start">
                  <Label
                    for="password"
                    className="px-2"
                    style={{ textAlign: "left" }}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    value={stateObj?.password}
                    onChange={onChange}
                    autoComplete="new-password"
                    required
                    placeholder="Password"
                    type="password"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup className="d-flex flex-column items-start">
                  <Label
                    for="company"
                    className="px-2"
                    style={{ textAlign: "left" }}
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={stateObj?.company}
                    onChange={onChange}
                    required
                    placeholder="Company"
                    type="text"
                  />
                </FormGroup>
              </Col>
            </Row>
            <button
              type="submit"
              className="btn btn-primary btn-sm mx-2"
              style={{ minWidth: "100px" }}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ minWidth: "100px" }}
            >
              Cancel
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UserRegistration;
