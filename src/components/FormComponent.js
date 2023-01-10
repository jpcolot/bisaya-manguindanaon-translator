import React, { useState } from "react";
import { Button, Form, Input, Row, Col, Spin } from "antd";
import { FormWrapper, SchoolLogo } from "./StyledComponents";
import { db, auth } from '../config/firebase'
import { Link } from "react-router-dom";

import './FormComponent.css'




const FormComponent = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [authMessage, setAuthMessage] = useState({})
  const [loginForm, setLoginForm] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)



  const emailHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const passwordHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const logIn = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user)
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
      });
  }

  const signUp = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // signup success
        setAuthMessage({
          type: 'success',
          message: 'Successfully created your account. You can now log in'
        })
        setLoginForm(true)
        setSubmitLoading(true)
        setTimeout(() => {
          setSubmitLoading(false)
        }, 5000)
      })
      // signup errors
      .catch((error) => {
        setAuthMessage({
          type: 'error',
          message: error.message
        })
      });
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <FormWrapper>
        <Row>
          <SchoolLogo src='/logo.png' />
        </Row>
        <Row>
          <Col xs={24} xl={24} l={24}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                required
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input onChange={(e) => emailHandler(e)} />
              </Form.Item>

              <Form.Item
                required
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  onChange={(e) => passwordHandler(e)}
                  placeholder="Enter Password"
                />
              </Form.Item>
              {authMessage.type === undefined ? "" : authMessage.type === 'error' ?
                <p style={{ color: 'red', fontSize: '13px' }}>{authMessage.message}</p> :
                <p style={{ color: 'green', fontSize: '13px' }}>{authMessage.message}</p>
              }
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                {loginForm === false ?
                  <Button type="primary" htmlType="submit" onClick={signUp} style={{ width: '150px' }}>
                    Create Account
                  </Button> :
                  <Button type="primary" htmlType="submit" onClick={logIn} style={{ width: '150px' }}>
                    Login
                </Button>
                }
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                {loginForm === true ?
                  <p>Click  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setLoginForm(false)}>  here</span> to create account </p>
                  :

                  <p>Click  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setLoginForm(true)}>  here</span> to sign in </p>

                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </FormWrapper>
    </div >
  );
};

export default FormComponent;
