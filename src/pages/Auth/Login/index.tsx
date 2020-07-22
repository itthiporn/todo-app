import React, { useState } from 'react';
import { message, Form, Input, Button, Card, Row, Col } from 'antd';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { storeAuthToken } from 'shared/utils/authToken';
import baseUrl from 'shared/config/baseUrl';

const Login: React.FC = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const validate = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  if (redirectToReferrer === true) {
    return <Redirect to="/" />;
  }

  return (
    <Row style={{ marginTop: 30 }}>
      <Col span={6} offset={9}>
        <Card>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={validate}
            onSubmit={async (values) => {
              try {
                const response = await axios.post(`${baseUrl}/todo/users/auth`, {
                  username: values.username,
                  password: values.password,
                });
                storeAuthToken(response.data.token);
                setRedirectToReferrer(true);
              } catch (error) {
                message.error(error.response.data.message);
              }
            }}
          >
            {({ values, handleSubmit, handleChange, handleBlur, errors, touched }) => {
              return (
                <>
                  <Form.Item
                    key="username"
                    help={errors.username && touched.username ? errors.username : undefined}
                    validateStatus={errors.username && touched.username ? 'error' : undefined}
                  >
                    <Input
                      placeholder="Username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="username"
                    />
                  </Form.Item>
                  <Form.Item
                    key="password"
                    help={errors.password && touched.password ? errors.password : undefined}
                    validateStatus={errors.password && touched.password ? 'error' : undefined}
                  >
                    <Input.Password
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                    />
                  </Form.Item>
                  <Button type="primary" onClick={() => handleSubmit()}>
                    Login
                  </Button>
                </>
              );
            }}
          </Formik>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
