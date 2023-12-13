import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Tooltip, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import { useForm } from 'antd/lib/form/Form';
const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const SignUp = () => {
  const [form] = useForm();
  const [showErr, setShowErr] = useState(false);
  const [userNameUsed, setUserNameUsed] = useState(false)
  const [usernames, setUsernames] = useState([])
  const [wrongPw, setWrongPw] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const passwordRegex = /^(?=.*[A-Z]).{4,}$/;
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const setError = (cb) => {
    cb(true)
    form.resetFields();
  }


  const handleSubmit = async (values) => {
    console.log("submit")
    console.log("values>>", formData)
    if (formData.password !== formData.confirmPassword) setError(setShowErr)
    if (!passwordRegex.test(formData.password)) setError(setWrongPw)
    if (usernames.includes(formData.username)) {
      form.resetFields();
      return setUserNameUsed(true)
    }

    console.log("Success:", values);
    try {
      const postResult = await axios.post("http://localhost:8000/register", { formData });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  useEffect(() => {
    const getUserNames = () => {
      axios.get('http://localhost:8000/checkUsername')
        .then(res => {
          setUsernames(res.data)
        })
        .catch(err => console.log("err>>", err))
    }
    getUserNames()
  }, [])
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 16
          }}
          style={{
            width: "50%",
            alignContent: "center"
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
              span: 8
            }}
            wrapperCol={{
              span: 16
            }}
            label="username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
            style={{ color: "red", textAlign: 'left' }}
          >
            <Input type="string"
              name="username"
              placeholder={userNameUsed ? "user exists"
                : "input username"}
              onChange={handleChange}
              status={userNameUsed ? "error" : ""}
              prefix={userNameUsed ? <ClockCircleOutlined /> : null}

            />
          </Form.Item>
            <Form.Item
              labelCol={{
                span: 8
              }}
              wrapperCol={{
                span: 16
              }}
              label="password"
              name="password"
              tooltip="Password must have at least 4 characters and one uppercase letter"
              rules={[{ required: true, message: 'Password is required' }]}
              style={{ color: "red", textAlign: 'left' }}
            >
              <Input.Password
                placeholder={wrongPw ? "password not strong enough" : "input password"}
                name="password"
                onChange={handleChange}
                status={wrongPw ? "error" : ""}
                prefix={wrongPw ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
          <Form.Item
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 16
            }}
            label="Confirm password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Password is required' }]}
            style={{ color: "red", textAlign: 'left' }}
          >
            <Input.Password
              placeholder={showErr ? "password not match" : "confirm password"}
              name="confirmPassword"
              onChange={handleChange}
              status={showErr ? "error" : ""}
              prefix={showErr ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit"
            disabled={!formData.username || !formData.password || !formData.confirmPassword ? true : false}
          >
            Register
          </Button>
        </Form>
      </div>


    </>
  );
};
export default SignUp;
