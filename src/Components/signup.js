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
Huen Long Yin Chan Hon Ki Cheung Hou Long Leung Kai Kit  Kwok Long Ching

Student ID(s):
1155159568 1155158959 1155149115 1155143874  1155156653

Course code:						
CSCI2720

Course title:
Building Web Applications

*/
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Radio } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { UserAddOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import SuccessPage from "./Success";
const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const RegisterPage = () => {
  return (
    <>
      <NavBar />
      <div>
        <SignUp />
      </div>
    </>
  );
};
export const SignUp = () => {
  const [form] = useForm();
  const [showErr, setShowErr] = useState(false);
  const [userNameUsed, setUserNameUsed] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [wrongPw, setWrongPw] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [formSubmit, setFormSubmit] = useState(false);
  const [userdata, setUserData] = useState();
  const passwordRegex = /^(?=.*[A-Z]).{4,}$/;
  const navigate = useNavigate();
  let role;
  try {
    role = JSON.parse(sessionStorage.getItem("role")).value;
  } catch (error) {
    console.log("error>>", error);
  }
  console.log("type>>", typeof role);
  console.log("role>>", role);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const setError = (cb, state) => {
    cb(state);
    form.resetFields();
  };
  const handleSubmit = async (values) => {
    console.log("submit");
    console.log("values>>", formData);
    if (formData.password !== formData.confirmPassword) return setError(setShowErr, true);
    else setError(setShowErr, false);
    if (!passwordRegex.test(formData.password)) return setError(setWrongPw, true);
    else setError(setWrongPw, false);
    if (usernames.includes(formData.username)) return setError(setUserNameUsed, true);
    else setError(setUserNameUsed, false);
    console.log("cp877", !passwordRegex.test(formData.password));
    if (showErr || userNameUsed || wrongPw) return;

    console.log("Success:", values);
    try {
      const postResult = await axios.post("http://localhost:8000/register", { formData });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        setUserData(postResult.data);
        return setFormSubmit(true);
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  useEffect(() => {
    const getUserNames = () => {
      axios
        .get("http://localhost:8000/checkUsername")
        .then((res) => {
          setUsernames(res.data);
        })
        .catch((err) => console.log("err>>", err));
    };
    getUserNames();
  }, []);

  if (role !== "admin") {
    return (
      <div style={{ width: "50%", margin: "auto" }}>
        <SuccessPage
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          path="/venue"
        />
      </div>
    );
  }
  return (
    <>
      {!formSubmit ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
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
            // disabled={true}
          >
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              style={{ color: "red", textAlign: "left" }}
            >
              <Input
                type="string"
                name="username"
                placeholder={userNameUsed ? "user exists" : "input username"}
                onChange={handleChange}
                status={userNameUsed ? "error" : ""}
                prefix={userNameUsed ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="password"
              name="password"
              tooltip="Password must have at least 4 characters and one uppercase letter"
              rules={[{ required: true, message: "Password is required" }]}
              style={{ color: "red", textAlign: "left" }}
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
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Confirm password"
              name="confirmPassword"
              rules={[{ required: true, message: "Password is required" }]}
              style={{ color: "red", textAlign: "left" }}
            >
              <Input.Password
                placeholder={showErr ? "password not match" : "confirm password"}
                name="confirmPassword"
                onChange={handleChange}
                status={showErr ? "error" : ""}
                prefix={showErr ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="User Role"
              name="role"
              style={{ textAlign: "left" }}
            >
              <Radio.Group name="role" onChange={handleChange} defaultValue={"user"}>
                <Radio.Button value="user">User</Radio.Button>
                <Radio.Button value="admin">Admin</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!formData.username || !formData.password || !formData.confirmPassword ? true : false}
            >
              Register
            </Button>
          </Form>
        </div>
      ) : (
        <SuccessPage
          status={"success"}
          path={"/venue"}
          title={`Successfully create ${userdata.role}: ${userdata.username}`}
          subTitle={"Thank you for signing up."}
        />
      )}
    </>
  );
};
export default RegisterPage;
