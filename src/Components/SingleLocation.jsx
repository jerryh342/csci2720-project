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
import React, { useState, useEffect } from "react";
import { Card, Spin, List, Row, Col, Descriptions, Button, Form, Input, Divider, Space, Table, Collapse } from "antd";
import axios from "axios";
import NavBar from "./navbar";
import Map from "./Map";
import { useParams } from "react-router-dom";
const { TextArea } = Input;

function LocationDetails(props) {
  const venue = props.venue;
  const data = [
    {
      key: "1",
      label: "Venue Name",
      children: venue.venueName,
    },
    {
      key: "2",
      label: "Latitude",
      children: venue.lat,
    },
    {
      key: "3",
      label: "Longitude",
      children: venue.long,
    },
  ];
  const labelStyle = {
    width: "20%",
    textAlign: "center",
  };
  return (
    <div>
      <Descriptions
        title={"Location Details"}
        layout={"horizontal"}
        labelStyle={labelStyle}
        bordered
        items={data}
        column={1}
      />
    </div>
  );
}

function EventDetails() {
  const [events, setEvents] = useState([]);
  const [freeEvents, setFreeEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { venueId } = useParams();
  function getVenueEvents() {
    setIsLoading(true);
    axios({
      url: "http://localhost:8000/venue/" + venueId + "/ev",
      method: "GET",
    })
      .then((res) => {
        setEvents(res.data.map((item, idx) => ({ ...item, key: idx })));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getFreeEvents() {
    setFreeEvents(events.filter((item) => item.price == "Free admission by tickets" || "Free Admission"));
  }
  const columns = [
    {
      title: "Event ID",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Event Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Event Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Presented By",
      dataIndex: "presenter",
      key: "presenter",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  useEffect(() => {
    getVenueEvents();
  }, []);
  useEffect(() => {
    getFreeEvents();
  }, [events]);
  return (
    <>
      <div>
        {
          <Collapse
            size="large"
            items={[
              {
                key: 1,
                label: "Free Events",
                children: (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 4,
                      lg: 4,
                      xl: 6,
                      xxl: 3,
                    }}
                    dataSource={freeEvents}
                    renderItem={(item, idx) => (
                      <List.Item>
                        <Card key={idx} title={item.title}>
                          {item.dateTime}
                        </Card>
                      </List.Item>
                    )}
                  ></List>
                ),
              },
            ]}
          ></Collapse>
        }
        <Table
          title={() => <h3 textAlign="center">All Events</h3>}
          columns={columns}
          bordered
          dataSource={events}
          loading={isLoading}
        />
      </div>
    </>
  );
}

function CommentList(props) {
  //console.log(props.comments);
  return (
    <List
      itemLayout="vertical"
      dataSource={props.comments}
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
      }}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            style={{ whiteSpace: "pre", textAlign: "left" }}
            title={item.user}
            description={item.content}
          />
        </List.Item>
      )}
    />
  );
}

function Comments(props) {
  //comments: array of comment objects
  const [commentIsSpinning, setCommentIsSpinning] = useState(true);
  const [formIsSpinning, setFormIsSpinning] = useState(false);
  const [comments, setComments] = useState([]);
  const maxWidth = 800;
  useEffect(() => {
    getComments();
  }, []);

  function getComments() {
    setCommentIsSpinning(true);
    axios({
      url: "http://localhost:8000/comments/" + props.venueId,
      method: "GET",
    })
      .then((res) => {
        setComments(res.data);
        setCommentIsSpinning(false);
      })
      .catch((err) => {
        console.log(err);
        setCommentIsSpinning(false);
      });
  }
  function handleSubmit(data) {
    let payload = {
      user: props.user,
      venueId: Number(props.venueId),
      content: data.newCommentContent,
    };
    setFormIsSpinning(true);
    axios({
      url: "http://localhost:8000/newcomment",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        console.log(res.data);
        setFormIsSpinning(false);
        getComments();
      })
      .catch((err) => {
        console.log(err);
        setFormIsSpinning(false);
      });
  }

  return (
    <>
      <div align="center">
        <Card title={"Comments"} style={{ maxWidth: maxWidth, align: "center" }}>
          <Spin spinning={commentIsSpinning}>
            <CommentList comments={comments} />
          </Spin>
        </Card>
      </div>
      <Card loading={formIsSpinning} title={"New comment"}>
        <Form name="newUserComment" onFinish={handleSubmit}>
          <Form.Item name="newCommentContent" rules={[{ required: true, message: "Comment cannot be empty!" }]}>
            <TextArea
              showCount
              maxLength={200}
              placeholder="Your Thoughts..."
              style={{ height: 100, resize: "none", maxWidth: maxWidth }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Click me to add new comment
          </Button>
        </Form>
      </Card>
    </>
  );
}

function SingleLocation(props) {
  const [user, setUser] = useState(null);
  const { venueId } = useParams();
  const [venue, setVenue] = useState([]);
  function getLocationDetails() {
    axios({
      url: "http://localhost:8000/venue/" + venueId,
      method: "GET",
    })
      .then((res) => {
        setVenue(res.data);
        document.title = res.data.venueName;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  }
  useEffect(() => {
    getLocationDetails();
    getCurrentUser();
    //setUser("admin"); //TODO: get current user
  }, []);

  return (
    <>
      <div>{<NavBar></NavBar>}</div>
      <div>
        <h1>{venue.venueName}</h1>
        <Divider />
        <div>
          <Row>
            <Col span={12}>{<Map venues={venue} zoom={15} isSingleLocation />}</Col>
            <Col span={12}>
              <LocationDetails venue={venue} />
            </Col>
          </Row>
        </div>
        <Divider />
        <EventDetails />
        <Comments venueId={venueId} user={user} />
      </div>
    </>
  );
}

export default SingleLocation;
