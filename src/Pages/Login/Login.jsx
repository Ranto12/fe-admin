import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login/admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: username, password }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
      }
    } catch (error) {
      setErrorMessage("Failed to connect to server. Please try again later.");
    }
    navigate("/dashboard"); // Setelah login sukses, langsung arahkan ke dashboard
  };

  return (
    <Container
      fluid
      className="login-container d-flex justify-content-center align-items-center"
    >
      <Row className="login-form-wrapper">
        <Col md={12} lg={12} className="login-form mx-auto p-4 shadow rounded">
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="w-100 mt-3" variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
