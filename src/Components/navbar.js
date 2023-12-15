import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Row, Col } from "antd";
import { FaHeart } from "react-icons/fa6";
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

const NavBar = (props) => {
  const { component } = props;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logOut = () => {
    axios({
      method: "DELETE",
      url: "http://localhost:8000/logout",
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Logged out");
          sessionStorage.clear();
          navigate("/login");
        }
      })

      .catch((err) => {
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
        return location.pathname == "/register" ? null : navigate("/login");
      }
    };
    checkAuth();
  }, []);
  // console.log("user>>", user);
  if (!user) {
    return (
      <Menu mode="horizontal" theme="dark" style={{ display: "flex", justifyContent: "space-between" }}>
        <Menu.Item key="left-item" style={{ marginLeft: 100 }}>
          {component}
        </Menu.Item>
        <Menu.Item key="right-item" style={{ marginLeft: "auto" }} icon={<UserOutlined />} />
      </Menu>
    );
  } else {
    return (
      
      <Menu mode="horizontal" theme="dark" style={{ display: "flex", justifyContent: "end" }} >
        <Row justify="end" gutter={32}>
        <Col>
        <Menu.Item key="left-item" style={{ marginRight: "100" }}>
          {component}
        </Menu.Item>
        </Col>
        <Col>
        <Menu.Item key="venue" onClick={() => navigate("/venue")}>
          <HomeOutlined style={{ marginRight: 10 }} />
          Venues
        </Menu.Item>
        </Col>
        <Col>
        <Menu.Item key="favourites" >
          <FaHeart style={{ marginRight: 10 }}/>
          Favourites
        </Menu.Item>
        </Col>
        <Col>
        <Menu.Item key="invites" onClick={() => navigate("/invites")}>
          <MailOutlined style={{ marginRight: 10 }} />
          Event Invitations
        </Menu.Item>
        </Col>
        <Col>
        <Menu.Item key="right-item" style={{ marginLeft: "100" }}>
          <SubMenu key="SubMenu" icon={<UserOutlined />} title={user.username}>
            <Menu.Item key="setting:1" onClick={logOut}>
              Logout
            </Menu.Item>
            <Menu.Item key="setting:2" onClick={() => navigate("/register")}>
              Add new users (maybe add to Jeffrey's Page)
            </Menu.Item>
          </SubMenu>
        </Menu.Item>
        </Col>
        </Row>
      </Menu>
      
    );
  }
};

NavBar.defaultProps = {
  component: "CSCI 2720 project",
};

export default NavBar;
