import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Descriptions, Button } from "antd";

function Invite(props) {
  const invite = props.invite;
  const [isJoined, setIsJoined] = useState(props.isJoined);
  const venueLink = "http://localhost:3000/venue/" + invite.venueId;
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
    { key: "2", label: "Venue ID", children: <a href={venueLink}>{invite.venueId}</a> },
    { key: "3", label: "Price", children: invite.price },
  ];
  function handleClick() {
    let payload = {
      username: "kwok",
      delete: isJoined ? true : false,
    };
    axios({
      url: "http://localhost:8000/invites/update/" + invite.eventId,
      method: "PUT",
      data: payload,
    }).then((res) => {
      console.log(res);
    });
  }
  return (
    <>
      <Card style={{ width: 800 }} title={invite.title}>
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

function Invites(props) {
  const [invites, setInvites] = useState([]);
  const [joined, setJoined] = useState([]);
  function getAllInvites() {
    axios({
      url: "http://localhost:8000/invites",
      method: "GET",
    })
      .then((res) => {
        const inviteList = res.data.map((item, idx) => {
          return {
            key: idx,
            eventId: item.eventId,
            title: item.event.title,
            venueId: item.event.venue,
            dateTime: item.event.dateTime,
            price: item.event.price,
            users: item.users.map((item) => item.username),
          };
        });
        setInvites(inviteList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getJoined() {
    axios({
      url: "http://localhost:8000/invites/user",
      method: "POST",
      data: {
        username: "kwok", //TODO: get current user
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
  useEffect(() => {
    getJoined();
    getAllInvites();
  }, []);
  return (
    <>
      <h1>Under construction</h1>
      {invites.map((item, idx) => (
        <Invite invite={item} key={idx} isJoined={joined.indexOf(item.eventId) > 0} />
      ))}
    </>
  );
}

export default Invites;
