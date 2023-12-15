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
import NavBar from "./navbar";

class FavouriteLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
      isLoadingData: true,
      userFavList: [],
    };
    this.LoadLocationList();

    this.handleFilter = this.handleFilter.bind(this);
  }

  // load all locations in a table
  LoadLocationList() {
    this.setState({ isLoadingData: true });
    axios({
      url: "http://localhost:8000/venue",
      method: "GET",
      withCredentials: true,
    })
      .then((r) => {
        const filteredData = r.data.filter((v) => v.eventCount > 3);
        const slicedData = filteredData.slice(0, 10);
        this.setState(
          {
            locationList: slicedData,
            filteredLocations: slicedData,
          },
          () => {
            this.loadUserFavLoc();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFilter() {
    const fitleredLoc = this.state.filteredLocations.filter((loc) => {
      console.log("loc>>");
      console.log("this.state.userFavList>>", this.state.userFavList);
      return this.state.userFavList.includes(parseInt(loc.locid));
    });
    this.setState({ filteredLocations: fitleredLoc, isLoadingData: false });
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
        this.setState({ userFavList: resp.data }, () => {
          this.handleFilter();
        });
      })
      .catch((err) => {
        console.log("err", err);
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
    ];

    return (
      <main>
        <div>
          <NavBar />
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

export default FavouriteLocations;
