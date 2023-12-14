import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Form, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import NavBar from "./navbar";
import TextArea from "antd/es/input/TextArea";

function CreateEventForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData] = useState({
    EventID: "",
    Title: "",
    Venue: "",
    Date: "",
    Description: "",
    Presenter: "",
    Price: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /*async function addEvent(values) {
    console.log("submit");
    console.log("values>>", formData);
    if (
      formData.EventID == null ||
      formData.Title == null ||
      formData.Venue == null ||
      formData.Date == null ||
      formData.Description == null ||
      formData.Presenter == null ||
      formData.Price == null
    ) {
      form.resetFields();
      console.log("reset");
      return;
    }
    console.log(form);*/

  /*console.log("Success:", values);
    try {
      const postResult = await axios.post("http://localhost:8000/createevent", { formData });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        this.setState({ showForm: false });
        this.loadEventList();
      }
    } catch (error) {
      console.log("error>>", error);
    }
  }*/

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add New Event
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form>
          <Form.Item name="EventID" label="Event ID" rules={[{ required: true }]}>
            <TextArea placeholder="Event ID" />
          </Form.Item>
          <Form.Item name="Title" label="Title" rules={[{ required: true }]}>
            <TextArea placeholder="Title" />
          </Form.Item>
          <Form.Item name="Venue" label="Venue" rules={[{ required: true }]}>
            <TextArea placeholder="Location" />
          </Form.Item>
          <Form.Item name="Date" label="Date" rules={[{ required: true }]}>
            <TextArea placeholder="Date and Time" />
          </Form.Item>
          <Form.Item name="Description" label="Description" rules={[{ required: true }]}>
            <TextArea placeholder="Event Description" />
          </Form.Item>
          <Form.Item name="Presenter" label="Presenter" rules={[{ required: true }]}>
            <TextArea placeholder="Presenter" />
          </Form.Item>
          <Form.Item name="Price" label="Price" rules={[{ required: true }]}>
            <TextArea placeholder="Price" />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </>
  );
}

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      editingKey: "",
      editingValues: {},
      allowInput: false,
      isButtonEnabled: true,
    };
  }

  componentDidMount() {
    this.loadEventList();
  }

  loadEventList() {
    axios({
      url: "http://localhost:8000/admin/event",
      method: "GET",
    })
      .then((r) => {
        this.setState({
          eventList: r.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // // Validate the form
  // onFinishFailed = (errorInfo) => {
  //     console.log("Failed:", errorInfo);
  // };

  // // Add an event
  // addEvent = async (values) =>{
  //     const [formData] = useState({
  //       EventID: "",
  //       Title: "",
  //       Venue: "",
  //       Date: "",
  //       Description: "",
  //       Presenter: "",
  //       Price: "",
  //     });
  //     console.log("submit")
  //     console.log("values>>", formData)
  //     // if (formData.EventID==null || formData.Title==null ||formData.Venue==null ||formData.Date==null ||formData.Description ==null ||formData.Presenter ==null ||formData.Price==null){
  //     //     setShowErr(true)
  //     //     form.resetFields();
  //     //     console.log("reset")
  //     //     return
  //     // }

  //     console.log("Success:", values);
  //     try {
  //       const postResult = await axios.post("http://localhost:8000/createevent", { formData });
  //       console.log("postResult>>", postResult);
  //       if (postResult.status === 200) {
  //         this.setState({showForm: false});
  //         this.loadEventList();
  //     }
  //     } catch (error) {
  //       console.log("error>>", error);
  //     }
  // }

  // Edit an event
  editEvent = (e) => {
    this.setState({
      editingKey: e.eventId,
      editingValues: {
        title: e.title,
        loc: e.loc,
        date: e.date,
        desc: e.desc,
        presenter: e.presenter,
        price: e.price,
      },
    });
  };

  // Update an event
  updateEvent = (key) => {
    const { editingValues } = this.state;

    key = key.eventId;

    axios({
      url: `http://localhost:8000/admin/event/update/${key}`,
      method: "PUT",
      data: editingValues,
    })
      .then((r) => {
        console.log(r.data);
        this.loadEventList();
        // Update the user list with the updated user data
        this.setState((prevState) => ({
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Delete an event
  deleteEvent = (e) => {
    axios({
      url: `http://localhost:8000/admin/event/delete/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        this.loadEventList();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { editingKey, editingValues } = this.state;
    const columns = [
      {
        title: "Event ID",
        dataIndex: "eventId",
        key: "eventId",
      },
      {
        title: "Event Name",
        dataIndex: "title",
        key: "title",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.title}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, title: e.target.value } })}
            />
          ) : (
            text
          ),
      },
      {
        title: "Venue",
        dataIndex: "loc",
        key: "loc",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.loc}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, loc: e.target.value } })}
            />
          ) : (
            text
          ),
      },
      {
        title: "Date Time",
        dataIndex: "date",
        key: "date",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.date}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, date: e.target.value } })}
            />
          ) : (
            text
          ),
      },
      {
        title: "Event Description",
        dataIndex: "desc",
        key: "desc",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.desc}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, desc: e.target.value } })}
            />
          ) : (
            text
          ),
      },
      {
        title: "Presenter",
        dataIndex: "presenter",
        key: "presenter",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.presenter}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, presenter: e.target.value } })}
            />
          ) : (
            text
          ),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (text, record) =>
          editingKey === record.eventId ? (
            <TextArea
              value={editingValues.price}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, price: e.target.value } })}
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
            {editingKey === record.eventId ? (
              <Button
                style={{ marginBottom: "10px", backgroundColor: "green" }}
                type="primary"
                onClick={() => this.updateEvent(record)}
              >
                Update Event
              </Button>
            ) : (
              <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => this.editEvent(record)}>
                Edit Event
              </Button>
            )}
            <Button type="primary" danger onClick={() => this.deleteEvent(record.name)}>
              Delete Event
            </Button>
          </div>
        ),
      },
    ];

    return (
      <main>
        <div>
          {/* <NavBar /> */}
          <h1 style={{ textAlign: "left" }}>Manage Events</h1>
        </div>
        <CreateEventForm />
        {<div style={{ clear: "both" }}></div>}
        <div>
          <Table columns={columns} dataSource={this.state.eventList} rowKey="eventId" />
        </div>
      </main>
    );
  }
}
export default Event;
