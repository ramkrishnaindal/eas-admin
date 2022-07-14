import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const [stateObj, setStateObj] = useState(initialState);
  const submitHandler = async (e) => {
    e.preventDefault();
    let resp;
    try {
      resp = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/login`,
        stateObj
      );
      console.log("result", resp.data.message);
      if (resp.data.result.user.role !== "admin") {
        alert(`You need to be an administrator to login to this portal`);
      }
      localStorage.setItem("user", JSON.stringify(resp.data.result.user));
      localStorage.setItem(
        "token",
        JSON.stringify(resp.data.result.user.token)
      );
      alert(resp.data.message);
      window.location.href = window.location.href;
      // setStateObj(initialState);
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
      <Row className="d-flex justify-content-center align-items-center">
        <Col className="text-info my-3 py-3 d-flex justify-content-center align-items-center">
          User Login
        </Col>
      </Row>
      <Form onSubmit={submitHandler} autoComplete="off">
        <Row className="d-flex justify-content-center align-items-center">
          <Col xs={8}>
            <Row className="d-flex flex-column justify-content-center align-items-center">
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
                    autoComplete="off"
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
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
              <Col
                xs={8}
                className="d-flex justify-content-center align-items-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary btn-sm mx-2"
                  style={{ minWidth: "100px" }}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ minWidth: "100px" }}
                  onClick={() => setStateObj(initialState)}
                >
                  Cancel
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Login;
