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
import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Input, Collapse } from "antd";
import NavBar from "./navbar";
import { withRouter } from "react-router-dom";
import { SignUp } from "./signup";
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      editingKey: "",
      editingValues: {},
    };
  }
  componentDidMount() {
    this.LoadUserList();
  }

  LoadUserList() {
    axios({
      url: "http://localhost:8000/admin/user",
      method: "GET",
    })
      .then((r) => {
        this.setState({
          userList: r.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Edit a user
  editUser = (e) => {
    this.setState({
      editingKey: e.id,
      editingValues: { username: e.name, password: e.pw },
    });
  };

  // Update a user
  updateUser = (key) => {
    const { editingValues } = this.state;

    key = key.id;
    axios({
      url: `http://localhost:8000/updateuser/${key}`,
      method: "PUT",
      data: editingValues,
    })
      .then((r) => {
        console.log(r.data);
        this.LoadUserList();
        // Update the user list with the updated user data
        this.setState((prevState) => ({
          //userList: prevState.userList.map((user) => (user._id === r.data.id ? r.data : user)),
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Delete a user
  deleteUser = (e) => {
    const payload = {
      username: e,
    };

    axios({
      url: `http://localhost:8000/deleteuser/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        this.LoadUserList();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { editingKey, editingValues } = this.state;
    let role;
    try {
      role = JSON.parse(sessionStorage.getItem("role"))?.value;
    } catch (error) {
      console.log("error>>", error);
    }
    if (role !== "admin") {
      window.location.assign("/");
    }

    const columns = [
      {
        title: "Username",
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (text, record) =>
          editingKey === record.id ? (
            <Input
              value={editingValues.username}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, username: e.target.value } })}
              style={{ width: 200 }}
            />
          ) : (
            text
          ),
      },
      {
        title: "Hashed Password",
        dataIndex: "pw",
        key: "pw",
        width: 600,
        render: (text, record) =>
          editingKey === record.id ? (
            <Input
              value={editingValues.password}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, password: e.target.value } })}
              style={{ width: 600 }}
            />
          ) : (
            text
          ),
      },
      {
        title: "Operations",
        key: "operations",
        width: 100,
        render: (text, record) => (
          <div>
            {editingKey === record.id ? (
              <Button
                style={{ marginRight: "10px", backgroundColor: "green" }}
                type="primary"
                onClick={() => this.updateUser(record)}
              >
                Update User
              </Button>
            ) : (
              <Button style={{ marginRight: "10px" }} type="primary" onClick={() => this.editUser(record)}>
                Edit User
              </Button>
            )}
            <Button type="primary" danger onClick={() => this.deleteUser(record.name)}>
              Delete User
            </Button>
          </div>
        ),
      },
    ];

    return (
      <main>
        <div>
          {<NavBar />}
          <h1 style={{ textAlign: "left" }}>Manage Users</h1>
          {/*<Collapse
            size="large"
            items={[
              {
                key: 1,
                label: "Create new user",
                children: <SignUp />,
              },
            ]}
          ></Collapse>*/}
          <Button style={{ float: "left", marginLeft: "7px", marginBottom: "10px" }} type="primary" href="/register">
            Create User
          </Button>
        </div>
        <div>
          <Table columns={columns} dataSource={this.state.userList} rowKey="name" />
        </div>
      </main>
    );
  }
}

export default User;
