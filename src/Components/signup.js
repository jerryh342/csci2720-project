import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
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
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showEmpty, setShowEmpty] = useState(false); 
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (values) => {
    console.log("submit")
    console.log("values>>", formData)
    if (formData.password !== formData.confirmPassword){
      setShowErr(true)
      form.resetFields();
      console.log("reset")
      return
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
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100}}>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 12
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
              span: 6
            }}
            wrapperCol={{
              span: 12
            }}
            label="username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
            style={{ color: "red", textAlign: 'left'}}
          >
            <Input type="string" name="username" placeholder="input username" onChange={handleChange}/>
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6
            }}
            wrapperCol={{
              span: 12
            }}
            label="password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
            style={{ color: "red", textAlign: 'left'}}
          >
            <Input.Password placeholder="input password" name="password" onChange={handleChange}/>
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6
            }}
            wrapperCol={{
              span: 12
            }}
            label="Confirm password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Password is required' }]}
            style={{ color: "red", textAlign: 'left'}}
          >
            <Input.Password 
            placeholder={showErr ? "password not match" : "confirm password" }
            name="confirmPassword" 
            onChange={handleChange} 
            status={showErr ? "error" : "" }
            prefix={showErr ? <ClockCircleOutlined /> : null} 
           />
          </Form.Item>
          <Button type="primary" htmlType="submit" 
          disabled={!formData.username || !formData.password || !formData.confirmPassword ? true : false }
          >
            Register
          </Button>
        </Form>
      </div>


    </>
  );
};
export default SignUp;
