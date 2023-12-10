import React, { useState, useEffect } from "react";
import { Card, Spin, List, Row, Col } from "antd";
import { Descriptions } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

function TempMap(props) {
  const libraries = ["places"];
  const venue = props.venue;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBGGC2kgrhzogounenjJfsElrOkWmOFlM0",
    libraries,
  });
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const center = {
    lat: venue.lat, //default lat, to be changed
    lng: venue.long,
  };
  if (loadError) {
    console.log(loadError);
    return <div>Error loading map</div>;
  }
  if (!isLoaded) {
    return <div>Rendering</div>;
  }
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
      <MarkerF position={center} />
    </GoogleMap>
  );
}

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

function CommentList(props) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={props.comments}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta avatar={[]} title={item.user} description={item.content} />
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
  useEffect(() => {
    getComments();
  }, []);
  function getComments() {
    setCommentIsSpinning(true);
    axios({
      url: "http://localhost:8000/comments/" + props.venueId,
      method: "GET",
    })
      .then((data) => {
        setComments(data.data);
        setCommentIsSpinning(false);
      })
      .catch((err) => {
        console.log(err);
        setCommentIsSpinning(false);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    let payload = {
      user: "Test",
      venueId: Number(props.venueId),
      content: formJson.comment,
    };
    setFormIsSpinning(true);
    axios({
      url: "http://localhost:8000/newcomment",
      method: "POST",
      data: payload,
    })
      .then((data) => {
        console.log(data);
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
      <div>
        <h3>Comments</h3>
        <Spin spinning={commentIsSpinning}>
          <CommentList comments={comments} />
        </Spin>
      </div>
      <Card>
        <Spin spinning={formIsSpinning}>
          <form id="newUserComment" onSubmit={handleSubmit}>
            <textarea rows="5" name="comment" placeholder="Type your comment here!" required></textarea>
            <br></br>
            <button>Click me to add new comment</button>
          </form>
        </Spin>
      </Card>
    </>
  );
}

function SingleLocation(props) {
  const { venueId } = useParams();
  const [venue, setVenue] = useState({});
  function getLocationDetails() {
    axios({
      url: "http://localhost:8000/venue/" + venueId,
      method: "GET",
    })
      .then((data) => {
        setVenue(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    document.title = "Location" + venueId;
    getLocationDetails();
  }, []);
  console.log(venueId);
  return (
    <>
      <div>
        <h1>{venue.venueName}</h1>
        <div>
          <Row>
            <Col span={12}>
              <TempMap venue={venue} />
            </Col>
            <Col span={12}>
              <LocationDetails venue={venue} />
            </Col>
          </Row>
        </div>
        <Comments venueId={venueId} />
      </div>
    </>
  );
}

export default SingleLocation;
