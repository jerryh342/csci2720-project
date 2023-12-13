import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Col, Row, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import "bootstrap/dist/css/bootstrap.css";

const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function setSessionStorageWithExpiration(key, value, expirationTimeInMinutes) {
  const expirationMs = expirationTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
  const now = new Date().getTime();
  const expirationTime = now + expirationMs;

  const item = {
    value: value,
    expirationTime: expirationTime,
  };

  sessionStorage.setItem(key, JSON.stringify(item));
}
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showErr, setShowErr] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    console.log("formData>>", formData);
    try {
      axios({
        method: "POST",
        data: {
          username: formData.username,
          password: formData.password,
        },
        withCredentials: true,
        url: "http://localhost:8000/login",
      })
        .then(async (res) => {
          console.log("res>>", res);
          if (res.status == 200) {
            console.log("res.data>>", res.data);
            setSessionStorageWithExpiration("username", res.data.username, 120);
            //expire after 2 hrs
            navigate("/venue");
          }
        })
        .then(async (res) => {
          console.log("res>>", res);
          if (res.status == 200) {
            console.log("res.data>>", res.data);
            sessionStorage.setItem("login", `{username: ${res.data.username}}`);
            navigate("/venue");
          }
        })
        .catch((err) => setShowErr(true));
    } catch (error) {
      console.log("error>>", error);
    }
  };
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          style={{
            width: "50%",
            alignContent: "center",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="username"
            name="username"
          >
            <Input type="string" onChange={handleChange} name="username" placeholder="input username" />
            {showErr && <p style={{ color: "red", textAlign: "left" }}>Wrong username or password</p>}
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="password"
            name="password"
          >
            <Input.Password placeholder="input password" name="password" onChange={handleChange} />
            {showErr && <p style={{ color: "red", textAlign: "left" }}>Wrong username or password</p>}
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};
export default Login;
