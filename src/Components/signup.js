import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const postResult = await axios.post("http://localhost:8000/register", { values });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  return (
    <>
      <Title level={2}>Register</Title>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="link" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" htmlType="submit">
        Login
      </Button>
    </>
  );
};
export default SignUp;
