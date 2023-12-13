// import UseAuth from '../hooks/auth';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Redirect, redirect } from "react-router-dom";
import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const menuItems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        General
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        Layout
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Navigation
      </a>
    ),
  },
];

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
      .then(()=>sessionStorage.removeItem('user'))
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
        return navigate("/login");
      }
    };
    checkAuth();
  }, []);
  console.log("user>>", user);
  if (!user) {
    return (

      <Menu mode="horizontal" theme="dark" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu.Item key="left-item" style={{ marginLeft: 100 }}>
          CSCI 2720 Project
        </Menu.Item>
        <Menu.Item key="right-item" style={{ marginLeft: 'auto' }} icon={<UserOutlined />}>
          Guest
        </Menu.Item>
      </Menu>

    );
  } else {
    return (
      <Menu mode="horizontal" theme="dark" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu.Item key="left-item" style={{ marginLeft: 100 }}>
          CSCI 2720 Project
        </Menu.Item>
        <Menu.Item key="right-item" style={{ marginLeft: 'auto' }} disableActive>
          <SubMenu key="SubMenu" icon={<UserOutlined />} title={user.username}>
            
              <Menu.Item key="setting:1" onClick={logOut}>Logout</Menu.Item>
              <Menu.Item key="setting:2" onClick={()=>navigate('/register')}>Add new users</Menu.Item>

            
          </SubMenu>

        </Menu.Item>
      </Menu>
    );
  }
};

export default NavBar;
