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
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Map from "./Map";
import NavBar from "./navbar";
import { StarOutlined } from "@ant-design/icons";
import { FaStar } from "react-icons/fa";

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
      isLoadingData: true,
      userFavList: [],
      lastUpdatedTime: JSON.parse(sessionStorage.getItem("lastUpdatedTime"))?.value || "",
    };

    this.searchLocation = this.searchLocation.bind(this);
  }

  //invoked for each set state(only called once => new class + new componentdidmount)
  componentDidMount() {
    this.LoadLocationList();
    this.loadUserFavLoc();
    this.getCurrentUser();
  }

  // load all locations in a table
  LoadLocationList() {
    this.setState({ isLoadingData: true });
    axios({
      url: "http://localhost:8000/venue",
      method: "GET",
    })
      .then((r) => {
        const filteredData = r.data.filter((v) => v.eventCount > 3);
        const slicedData = filteredData.slice(0, 10);
        this.setState({
          locationList: slicedData,
          filteredLocations: slicedData,
          isLoadingData: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

  searchLocation(event) {
    const filter = event.target.value.toLowerCase();

    if (filter === "") {
      this.setState({ filteredLocations: this.state.locationList });
    } else {
      const filteredLocations = this.state.locationList.filter((location) => {
        const txtValue = Object.values(location).join(" ").toLowerCase();
        return txtValue.indexOf(filter) > -1;
      });

      this.setState({ filteredLocations });
    }
  }
  handleFilter() {
    const fitleredLoc = this.state.filteredLocations.filter((loc) => {
      console.log("loc>>", loc);
      console.log("this.state.userFavList>>", this.state.userFavList);
      return this.state.userFavList.includes(parseInt(loc.locid));
    });
    this.setState({ filteredLocations: fitleredLoc });
  }

  loadUserFavLoc() {
    const usernameValue = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    axios({
      url: `http://localhost:8000/userbyusername`,
      method: "POST",
      withCredentials: true,
      data: { username: usernameValue },
    })
      .then((resp) => {
        console.log("resp>>", resp);
        this.setState({ userFavList: resp.data });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  handleFavClick(record) {
    this.setState({ isLoadingData: true });
    const usernameValue = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    console.log("record>", record);
    axios({
      url: "http://localhost:8000/addFavbyUser",
      method: "POST",
      withCredentials: true,
      data: {
        username: usernameValue,
        locid: record.locid,
      },
    }).then((result) => {
      this.LoadLocationList();
      this.loadUserFavLoc();
    });
  }

  addToFavourite = (record) => {
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
      method: "POST",
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
        title: <div onClick={() => this.handleFilter()}>Favourites</div>,
        dataIndex: "fav",
        key: "fav",
        render: (fav, rowRecord) => (
          <Button
            icon={
              <FaStar
                color={this.state.userFavList.includes(parseInt(rowRecord.locid)) ? "yellow" : "white"}
                style={{ stroke: "black", strokeWidth: "10" }}
              />
            }
            type="text"
            onClick={() => this.handleFavClick(rowRecord)}
          />
        ),

        /*title: "Add To Favourite",
        render: (_, record) => (
          <button type="button" className="btn btn-success" onClick={() => this.addToFavourite(record)}>
            Add
          </button>
        ),*/
      },
    ];

    return (
      <main>
        <div>
          <NavBar />
        </div>
        <div style={{ height: "500px", width: "100%" }}>
          {<Map venues={this.state.locationList} isSingleLocation={false} zoom={11} markerLink={true} />}
        </div>
        <p style={{ textAlign: "right" }}>Last Updated at {this.state.lastUpdatedTime}</p>
        <div>
          <Input size="large" placeholder="Search" onChange={this.searchLocation} prefix={<SearchOutlined />} />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={this.state.filteredLocations}
            loading={this.state.isLoadingData}
            pagination={false}
            rowKey="locid"
          />
        </div>
      </main>
    );
  }
}

export default Locations;
