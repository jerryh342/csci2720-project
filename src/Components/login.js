/*
I am submitting the assignment for: 
a group project on behalf of all members of the group. 
It is hereby confirmed that the submission is authorized by all members of the group, and all members of the group are required to sign this declaration. 
We declare that: 
(i) the assignment here submitted is original except for source material explicitly acknowledged/all members of the group have read and checked that all parts of the piece of work, 
irrespective of whether they are contributed by individual members or all members as a group, here submitted are original except for source material explicitly acknowledged; 
(ii) the piece of work, or a part of the piece of work has not been submitted for more than one purpose (e.g. to satisfy the requirements in two different courses) without declaration; and (iii) the submitted soft copy with details listed in the <Submission Details> is identical to the hard copy(ies), 
if any, which has(have) been / is(are) going to be submitted.  
We also acknowledge that I am/we are aware of the University’s policy and regulations on honesty in academic work, and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, as contained in the University website http://www.cuhk.edu.hk/policy/academichonesty/. 
In the case of a group project, we are aware that all members of the group should be held responsible and liable to disciplinary actions, irrespective of whether he/she has signed the declaration and whether he/she has contributed, directly or indirectly, to the problematic contents.
We declare that we have not distributed/ shared/ copied any teaching materials without the consent of the course teacher(s) to gain unfair academic advantage in the assignment/ course.
We declare that we have read and understood the University’s policy on the use of AI for academic work.  we confirm that we have complied with the instructions given by my/our course teacher(s) regarding the use of AI tools for this assignment and consent to the use of AI content detection software to review my/our submission.
We also understand that assignments without a properly signed declaration by the student concerned and in the case of a group project, by all members of the group concerned, will not be graded by the teacher(s).

Signature(s):					        
HuenLongYin CheungHouLong LeungKaiKit ChanHonKi KwokLongChing 

Date:
15 December 2023

Name(s):							
Huen Long Yin Cheung Hou Long Leung Kai Kit Chan Hon Ki Kwok Long Ching

Student ID(s):
1155159568 1155149115 1155143874 1155158959 1155156653

Course code:						
CSCI2720

Course title:
Building Web Applications

*/
import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Col, Row, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import "bootstrap/dist/css/bootstrap.css";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import { useForm } from "antd/lib/form/Form";

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
  const [form] = useForm();
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
            setSessionStorageWithExpiration("username", res.data.user.username, 120);
            setSessionStorageWithExpiration("role", res.data.user.role, 120);
            setSessionStorageWithExpiration("lastUpdatedTime", res.data.timestamp, 120);
            //expire after 2 hrs
            navigate("/venue");
          }
        })
        .catch((err) => {
          console.log("reset");
          form.resetFields();
          setShowErr(true);
        });
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
            rules={[{ required: true, message: "Username is required" }]}
            style={{ color: "red", textAlign: "left" }}
            hasFeedback
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "username and password not match" : ""}
          >
            <Input
              type="string"
              placeholder={!formData.username ? "username is required" : "input username"}
              name="username"
              onChange={handleChange}
              status={!formData.username ? "error" : ""}
              prefix={!formData.username ? <ClockCircleOutlined /> : null}
            />
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
            rules={[{ required: true, message: "Password is required" }]}
            style={{ color: "red", textAlign: "left" }}
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "username and password not match" : ""}
          >
            <Input.Password
              placeholder={!formData.password ? "password is required" : "input password"}
              name="password"
              onChange={handleChange}
              status={!formData.password ? "error" : ""}
              prefix={!formData.password ? <ClockCircleOutlined /> : null}
            />
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
