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
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Menu, theme, Row, Col } from "antd";
import { FaHeart } from "react-icons/fa6";
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
      <Menu mode="horizontal" theme="dark" style={{ justifyContent: "flex-end" }}>
        <Row>
          <Menu.Item key="venue" onClick={() => navigate("/venue")}>
            <HomeOutlined style={{ marginRight: 10 }} />
            Venues
          </Menu.Item>
          <Menu.Item key="favourites" onClick={() => navigate("/venue/fav")}>
            <FaHeart style={{ marginRight: 10 }} />
            Favourites
          </Menu.Item>
          <Menu.Item key="invites" onClick={() => navigate("/invites")}>
            <MailOutlined style={{ marginRight: 10 }} />
            Event Invitations
          </Menu.Item>
          <Menu.Item key="right-item" style={{ marginLeft: "auto" }}>
            <SubMenu key="SubMenu" icon={<UserOutlined />} title={user.username}>
              <Menu.Item key="setting:1" onClick={logOut}>
                Logout
              </Menu.Item>
              {user.role == "admin" ? (
                <Menu.Item key="setting:2" onClick={() => navigate("/admin/user")}>
                  Manage Users
                </Menu.Item>
              ) : (
                <></>
              )}
              {user.role == "admin" ? (
                <Menu.Item key="setting:3" onClick={() => navigate("/admin/event")}>
                  Manage Events
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu>
          </Menu.Item>
        </Row>
      </Menu>
    );
  }
};

NavBar.defaultProps = {
  component: "CSCI 2720 project",
};

export default NavBar;
