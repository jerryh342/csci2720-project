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
Huen Long Yin Cheung Hou Long Leung Kai Kit Chan Hon Ki Kwok Long Ching

Student ID(s):
1155159568 1155149115 1155143874 1155158959 1155156653

Course code:						
CSCI2720

Course title:
Building Web Applications

*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Descriptions, Button, Form, Input, Alert, List } from "antd";
import NavBar from "./navbar";
function getUsername() {
  return JSON.parse(sessionStorage.getItem("username"))?.value || "";
}

function Invite(props) {
  const [invite, setInvite] = useState(props.invite);
  const [joined, setJoined] = useState([]);
  const [isJoined, setIsJoined] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const eventId = props.invite.eventId;
  const venueLink = "http://localhost:3000/venue/" + props.invite.venue;
  const labelStyle = {
    width: "20%",
    textAlign: "center",
  };
  const details = [
    {
      key: "1",
      label: "Event Date & Time",
      children: invite.dateTime,
    },
    { key: "2", label: "Venue ID", children: <a href={venueLink}>{invite.venue}</a> },
    { key: "3", label: "Price", children: invite.price },
  ];
  function getJoined() {
    axios({
      url: "http://localhost:8000/invites/user",
      method: "POST",
      data: {
        username: getUsername(), //TODO: get current user
      },
    })
      .then((res) => {
        const joinedList = res.data.map((item) => item.eventId);
        setJoined(joinedList);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleClick() {
    let payload = {
      username: getUsername(),
      delete: isJoined ? true : false,
    };
    axios({
      url: "http://localhost:8000/invites/update/" + props.invite.eventId,
      method: "PUT",
      data: payload,
    }).then((res) => {
      console.log(res);
      getInvite();
      getJoined();
      props.update();
    });
  }

  function getInvite() {
    axios({
      url: "http://localhost:8000/invites/" + props.invite.eventId,
      method: "GET",
    })
      .then((res) => {
        const invite = res.data;
        setInvite({
          title: invite.event.title,
          dateTime: invite.event.dateTime,
          price: invite.event.price,
          venue: invite.event.venue,
          users: invite.users,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getJoined();
    setIsLoading(false);
    //setInvite(props.invite);
  }, []);

  useEffect(() => {
    setIsJoined(joined.includes(eventId));
  }, [joined]);

  return (
    <>
      <Card style={{ width: "100%" }} title={invite.title} loading={isLoading}>
        <Descriptions
          title={"Event Details"}
          layout={"horizontal"}
          labelStyle={labelStyle}
          bordered
          items={details}
          column={1}
        />
        <p>{invite.users.length} users is/are going to this event.</p>
        <Button onClick={handleClick}>{isJoined ? "Leave" : "Join"}</Button>
      </Card>
    </>
  );
}

function NewInviteForm(props) {
  const [showError, setShowError] = useState(false);
  function handleClose() {
    setShowError(false);
  }
  async function handleSubmit(data) {
    try {
      const event = await axios.get("http://localhost:8000/ev/" + data.eventId);
      if (event) {
        axios({
          url: "http://localhost:8000/invites/create/" + data.eventId,
          method: "PUT",
          data: {
            username: getUsername(),
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.status == 200) {
              props.update();
            }
          })
          .catch((err) => {
            console.log(err);
            setShowError(true);
          });
      }
    } catch (err) {
      setShowError(true);
      console.log("Error occurred>>");
      console.log(showError);
    }
  }
  return (
    <div align="center">
      <Form name="basic" layout={"inline"} onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          label="Event ID:"
          name="eventId"
        >
          <Input type="string" name="eventId" placeholder="Input Event ID" required />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form>
      {showError ? <Alert type="warning" message={"Invite Not Created"} closable onClose={handleClose}></Alert> : null}
    </div>
  );
}

function Invites(props) {
  const [invites, setInvites] = useState([]);
  const [childUpdated, setChildUpdated] = useState(0);
  function getAllInvites() {
    axios({
      url: "http://localhost:8000/invites",
      method: "GET",
    })
      .then((res) => {
        const inviteList = res.data.map((item) => {
          return {
            eventId: item.eventId,
            title: item.event.title,
            dateTime: item.event.dateTime,
            price: item.event.price,
            venue: item.event.venue,
            users: item.users,
          };
        });
        setInvites(inviteList);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function onChildUpdate() {
    setChildUpdated((current) => current + 1);
  }
  useEffect(() => {
    getAllInvites();
    document.title = "Invites";
  }, []);

  useEffect(() => {
    console.log("childUpdated");
    getAllInvites();
  }, [childUpdated]);

  return (
    <>
      <NavBar></NavBar>
      <h1>Invites</h1>

      <Card title={"Create a new Event Invite!"}>
        <div align="center">
          <NewInviteForm update={onChildUpdate} />
        </div>
      </Card>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 3,
        }}
        dataSource={invites}
        renderItem={(item, idx) => (
          <List.Item>
            <Invite invite={item} key={idx} update={onChildUpdate} />
          </List.Item>
        )}
      />
    </>
  );
}

export default Invites;
