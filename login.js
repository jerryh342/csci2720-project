import React, { useState } from 'react';
// import { Button, Checkbox, Form, Input, Typography  } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import NavBar from './navbar';
import 'bootstrap/dist/css/bootstrap.css';

// const {Title} = Typography;

const onFinishFailed = (errorInfo) => {

    console.log('Failed:', errorInfo);
};
const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: ''
      });
    const [showisLoggedIn, setshowisLoggedIn] = useState(false)
    const navigate = useNavigate()
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("formData>>", formData)
        try {
            axios({
                method: "POST",
                data: {
                    username: formData.username,
                    password: formData.password,
                },
                withCredentials: true,
                url: 'http://localhost:3001/login'
            }).then(async (res) => {
                console.log("res>>", res)
                if (res.data === "Password or Username dont match") {
                    setshowisLoggedIn(true)
                }
                if (res.data === "Successfully Authenticated") {
                    navigate('/home')
                }
            })

        } catch (error) {
            console.log("error>>", error)
        }

    };
    return (
        <>
        <NavBar/>
        <Container className="d-flex justify-content-center align-items-center vh-100">
        <Form onSubmit={handleSubmit}>
             <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" placeholder="username" onChange={handleChange}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </Container>
        </>
    );
};
export default Login;
