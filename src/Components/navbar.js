import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import UseAuth from '../hooks/auth';
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";

const NavBar = () => {
  // const user = UseAuth()
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logOut = () => {
    axios({
      method: "DELETE",
      url: "http://localhost:8000/logout",
      withCredentials: true,
    })
      .then(setIsLoggedIn(true))
      .catch((err) => {
        setIsLoggedIn(false);
        return navigate("/login");
      });
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8000/checkAuth", { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);
  console.log("user>>", user);
  if (!user) {
    return (
      <Navbar expand="lg" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar expand="lg" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Hi {user.username}</Navbar.Brand>
          <Navbar.Brand>
            <Button>Logout</Button>
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          {/* <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse> */}
        </Container>
      </Navbar>
    );
  }
};

export default NavBar;
