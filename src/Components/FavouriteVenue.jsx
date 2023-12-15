import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import NavBar from "./navbar";

class FavouriteLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
    };
  }

  //invoked for each set state(only called once => new class + new componentdidmount)
  componentDidMount() {
    this.getCurrentUser();
    setTimeout(() => {
      this.LoadLocationList();
    }, 100);
  }

  getCurrentUser() {
    axios({
      url: "http://localhost:8000/checkAuth",
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        this.setState({ user: res.data.username });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // load all locations in a table
  LoadLocationList() {
    axios({
      url: `http://localhost:8000/venue/fav/${this.state.user}`,
      method: "GET",
    })
      .then((r) => {
        this.setState({
          locationList: r.data,
          filteredLocations: r.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteFromFavourite = (record) => {
    const { user } = this.state;
    const locid = record.locid;
    const data = { user: user, locid: locid };
    this.handleSubmit(data);
  };

  handleSubmit(data) {
    let payload = {
      user: data.user,
      locid: data.locid,
    };
    axios({
      url: "http://localhost:8000/venue/fav",
      method: "DELETE",
      data: payload,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const columns = [
      {
        title: "Venue ID",
        dataIndex: "locid",
        key: "locid",
      },
      {
        title: "Venue Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => <a href={`/venue/${record.locid}`}>{text}</a>,
      },
      {
        title: "Latitude",
        dataIndex: "lat",
        key: "lat",
      },
      {
        title: "Longitude",
        dataIndex: "long",
        key: "long",
      },
      {
        title: "Number of Events",
        dataIndex: "eventCount",
        key: "eventCount",
        sorter: (a, b) => a.eventCount - b.eventCount,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Delete from Favourite",
        render: (_, record) => (
          <button type="button" className="btn btn-danger" onClick={() => this.deleteFromFavourite(record)}>
            Delete
          </button>
        ),
      },
    ];

    return (
      <main>
        <div>
          <NavBar />
        </div>
        <header>
          <h1>Favourite Venue</h1>
        </header>
        <div>
          <Table columns={columns} dataSource={this.state.filteredLocations} rowKey="locid" />
        </div>
      </main>
    );
  }
}

export default FavouriteLocations;
