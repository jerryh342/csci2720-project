import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Input } from "antd";
import NavBar from "./navbar";
import { withRouter } from "react-router-dom";

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
      editingValues: { username: e.name, pw: e.pw },
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
        // Update the user list with the updated user data
        this.setState((prevState) => ({
          userList: prevState.userList.map((user) => (user._id === r.data.id ? r.data : user)),
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
      // need change localhost to the publicIP
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

    const columns = [
      {
        title: "Username",
        dataIndex: "name",
        key: "name",
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
        render: (text, record) =>
          editingKey === record.id ? (
            <Input
              value={editingValues.pw}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, pw: e.target.value } })}
              style={{ width: 600 }}
            />
          ) : (
            text
          ),
      },
      {
        title: "Operations",
        key: "operations",
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
          {/* <NavBar /> */}
          <h1 style={{ textAlign: "left" }}>Manage Users</h1>
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
