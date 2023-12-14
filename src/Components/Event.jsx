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
    this.formRef = React.createRef();
    this.state = {
      eventList: [],
      editingKey: "",
      editingValues: {},
      allowInput: false,
      isButtonEnabled: true,
      form: null,
      isModalOpen: false,
      isDelModalOpen: false,
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

  addEvent = (value) => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log("Success:", values);
        axios
          .post("/createevent", values)
          .then((response) => {
            console.log("Server response:", response);
            this.setState({ allowInput: false, isButtonEnabled: true });
            this.loadEventList();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
      });
  };
  // Edit an event
  editEvent = (e) => {
    this.setState(
      {
        editingKey: e.eventId,
        editingValues: {
          title: e.title,
          venue: e.venue,
          dateTime: e.dateTime,
          desc: e.desc,
          presenter: e.presenter,
          price: e.price,
        },
      },
      () => {
        console.log(this.state.editingKey);
        console.log(this.state.editingValues);
        this.setState({ isModalOpen: true });
      }
    );
  };

  // Update an event
  updateEvent = (key) => {
    const updateData = key;

    key = key.eventId;

    axios({
      url: `http://localhost:8000/admin/event/update/${key}`,
      method: "PUT",
      data: updateData,
    })
      .then((r) => {
        console.log(r.data);
        // Update the user list with the updated user data
        this.loadEventList();
        this.setState({ isModalOpen: false });
        this.setState((prevState) => ({
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleOk = () => {
    this.formRef.current.submit();
  };
  handleCancel = () => {
    this.setState({
      isModalOpen: false,
      isDelModalOpen: false,
    });
  };

  handleDelCancel = () => {
    this.setState({
      isModalOpen: false,
      isDelModalOpen: false,
    });
  };
  // Update an event
  handleOK = (key) => {
    const updateData = key;

    key = key.eventId;

    axios({
      url: `http://localhost:8000/admin/event/update/${key}`,
      method: "PUT",
      data: this.state.editingValues,
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

  /// Delete an event
  deleteEvent = (e) => {
    axios({
      url: `http://localhost:8000/admin/event/delete/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        this.setState({ isDelModalOpen: true });
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
      },
      {
        title: "Venue",
        dataIndex: "venue",
        key: "venue",
      },
      {
        title: "Date Time",
        dataIndex: "dateTime",
        key: "dateTime",
      },
      {
        title: "Event Description",
        dataIndex: "desc",
        key: "desc",
      },
      {
        title: "Presenter",
        dataIndex: "presenter",
        key: "presenter",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
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
            <Button type="primary" danger onClick={() => this.deleteEvent(record.eventId)}>
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
          <h1 style={{ textAlign: "left" }}>Manage Users</h1>
        </div>
        {this.state.isButtonEnabled && (
          <Button
            style={{ marginLeft: "7px", backgroundColor: "pink", marginBottom: "10px" }}
            type="primary"
            onClick={() => this.setState({ allowInput: true, isButtonEnabled: false })}
          >
            Add Event
          </Button>
        )}
        {
          <div style={{ clear: "both" }}>
            {this.state.allowInput && (
              <Form onFinish={this.addEvent}>
                <Form.Item
                  name="EventID"
                  label="Event ID"
                  rules={[{ required: true, message: "Please input the Event ID" }]}
                >
                  <TextArea placeholder="Event ID" />
                </Form.Item>
                <Form.Item name="Title" label="Title" rules={[{ required: true, message: "Please input the title" }]}>
                  <TextArea placeholder="Title" />
                </Form.Item>
                <Form.Item name="Venue" label="Venue" rules={[{ required: true, message: "Please input the venue" }]}>
                  <TextArea placeholder="Location" />
                </Form.Item>
                <Form.Item name="Date" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
                  <TextArea placeholder="Date and Time" />
                </Form.Item>
                <Form.Item
                  name="Description"
                  label="Description"
                  rules={[{ required: true, message: "Please input the description" }]}
                >
                  <TextArea placeholder="Event Description" />
                </Form.Item>
                <Form.Item
                  name="Presenter"
                  label="Presenter"
                  rules={[{ required: true, message: "Please input the presenter" }]}
                >
                  <TextArea placeholder="Presenter" />
                </Form.Item>
                <Form.Item name="Price" label="Price" rules={[{ required: true, message: "Please input the price" }]}>
                  <TextArea placeholder="Price" />
                </Form.Item>
                <Form.Item>
                  <Button style={{ marginBottom: "10px" }} type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        }
        <div>
          <Modal
            ref={this.formRef}
            title="Edit Event"
            open={this.state.isModalOpen}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form
              ref={this.formRef}
              initialValues={{ ...this.state.editingValues, eventId: this.state.editingKey }}
              onFinish={this.updateEvent}
            >
              <Form.Item name="eventId" label="Event ID">
                <Input readOnly />
              </Form.Item>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="venue" label="Venue" rules={[{ required: true, message: "Please input the venue" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="dateTime" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item
                name="desc"
                label="Description"
                rules={[{ required: true, message: "Please input the description" }]}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
              </Form.Item>
              <Form.Item
                name="presenter"
                label="Presenter"
                rules={[{ required: true, message: "Please input the presenter" }]}
              >
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal title="Delete Event" open={this.state.isDelModalOpen} onOk={this.handleDelCancel}>
            Successfully deleted!
          </Modal>
          <Table columns={columns} dataSource={this.state.eventList} rowKey="eventId" />
        </div>
      </main>
    );
  }
}
export default Event;
