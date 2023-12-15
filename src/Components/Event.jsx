import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Form, Modal, Select, DatePicker, TimePicker  } from "antd";
import { useForm } from "antd/lib/form/Form";
import NavBar from "./navbar";
import {PlusOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import SuccessPage from "./Success";

function CreateEventForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationArr, setLocationArr] = useState([])
  const [eventIds, seteventIds] = useState([])
  const [fullLoc, setFullLoc] = useState([])
  const [showErr, setShowErr] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    venue: "",
    date: "",
    desc: "",
    presenter: "",
    price: "",
  });
  const { Option } = Select;
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSuccess(false)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSuccess(false)
    setIsModalOpen(false);
  };

  const handleSubmit = (fieldValues) => {
    const parsedValue = parseInt(fieldValues.eventId);
    if (isNaN(parsedValue)) {
      return setShowErr(true);
    } 
    const [loc] = fullLoc.filter(item=>item.name==fieldValues.venue)
    const eventDetails = {
      eventId: parsedValue,
      title: fieldValues.title,
      venue: parseInt(loc.locid),
      dateTime: fieldValues.dateTime.format('YYYY-MM-DD HH:mm:ss'),
      desc: fieldValues.desc,
      presenter: fieldValues.presenter,
      price: fieldValues.price
    };
    setFormData(eventDetails)
    axios({
      url: "http://localhost:8000/admin/event/create",
      method: "POST",
      data: eventDetails
    })
    .then((res=>{
      console.log("res", res)
      form.resetFields()
      setSuccess(true)
    }))
    .catch(err=>{
      console.log("err>>", err)
    })




  }
  const initialValues = {
    eventId: eventIds, // Set the initial value here
  };
  const generateRandomNumber = () => {
    const upperLimit = 1000000;
    let randomNum = Math.floor(Math.random() * upperLimit) + 1;

    while (eventIds.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * upperLimit) + 1;
    }

    seteventIds(randomNum);
  };

  useEffect(() => {
    const fetchVenues = () => {
      const venues = axios({
        url: "http://localhost:8000/venue",
        method: "GET",
      })
        .then(location => {
          setFullLoc(location.data)
          const venuenames = location?.data.map(item => item.name)
          console.log("location.data>>", venuenames)
          setLocationArr(venuenames)
        })
        .catch(err => console.log("err>>", err))
    }
    const fetchEvents = () => {
      const events = axios({
        url: "http://localhost:8000/admin/event",
        method: "GET",
      })
        .then(events => {
          const eventIds = events?.data.map(item => item.eventId)
          console.log("seteventIds>>", eventIds)
          const generateRandomNumber = () => {
            const upperLimit = 1000000;
            let randomNum = Math.floor(Math.random() * upperLimit) + 1;
        
            while (eventIds.includes(randomNum)) {
              randomNum = Math.floor(Math.random() * upperLimit) + 1;
            }
        
            seteventIds(randomNum);
          };
          generateRandomNumber()
        })
        .catch(err => console.log("err>>", err))
    }
    fetchVenues()
    fetchEvents()

  }, [success])

  return (
    <>
      <Button shape="circle" type="primary" icon={<PlusOutlined />} onClick={showModal}/>
      <Modal
        title="Add Event"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        height={400}
        width={1000}
      > 
      {success &&  <SuccessPage
          status={"success"}
          path={"/venue"}
          title={`Successfully create event id: ${formData.eventId}: ${formData.title}`}
          subTitle={"Thank you for signing up."}
        />}
        {!success && <Form
          form={form}
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            width: "100%",
            alignContent: "center",
          }}
          initialValues={initialValues}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="eventId"
            label="Event ID"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            hasFeedback
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "Numbers Only" : ""}
          >
            <Input disabled name="eventId" type="number" placeholder="Event ID" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input placeholder="Title" name="title"/>
          </Form.Item>
          <Form.Item
            name="venue"
            label="Venue"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Select name="venue">
              {locationArr.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dateTime"
            label="Date"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <DatePicker name="dateTime" showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Description"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <TextArea name="desc" placeholder="Event Description" autoSize={{ minRows: 2, maxRows: 4 }}/>
          </Form.Item>
          <Form.Item
            name="presenter"
            label="Presenter"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="presenter" placeholder="Presenter" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="price" placeholder="Price" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </div>

        </Form>}
      </Modal>
    </>
  );
}

const Event = () => {
  const [eventList, setEventList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [editingValues, setEditingValues] = useState({});
  const [allowInput, setAllowInput] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationArr, setLocationArr] = useState([])
  const [showErr, setShowErr] = useState(false)
  const [selectedRow, setSelectedRow] = useState({});
  const [create, setCreate] = useState(false)
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    venue: "",
    dateTime: "",
    desc: "",
    presenter: "",
    price: "",
  });
  const { Option } = Select;
  const [form] = Form.useForm();
  const showModal = () => {
    // if (selectedRow !=null{
      setSelectedRow(null)
    // })
    
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSelectedRow(null)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (fieldValues) => {
    if (typeof (fieldValues.EventID) !== 'number') return setShowErr(true)
    const eventDetails = {
      eventId: fieldValues.EventID,
      title: fieldValues.Title,
      venue: fieldValues.Venue,
      dateTime: fieldValues.Date.format('YYYY-MM-DD HH:mm:ss'),
      desc: fieldValues.Description,
      presenter: fieldValues.Presenter,
      price: fieldValues.Price
    };
    console.log("values>>", eventDetails)


  }
  useEffect(() => {
    const fetchVenues = () => {
      const venues = axios({
        url: "http://localhost:8000/venue",
        method: "GET",
      })
        .then(location => {
          const venuenames = location?.data.map(item => item.name)
          console.log("location.data>>", venuenames)
          setLocationArr(venuenames)
        })
        .catch(err => console.log("err>>", err))
    }
    fetchVenues()

  }, [])

  useEffect(() => {
    loadEventList();
  }, []);

  const loadEventList = () => {
    axios.get("http://localhost:8000/admin/event")
      .then((response) => {
        setEventList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editEvent = (e) => {
    setEditingKey(e.eventId);
    setEditingValues({
      title: e.title,
      loc: e.loc,
      date: e.date,
      desc: e.desc,
      presenter: e.presenter,
      price: e.price,
    });
  };

  const updateEvent = (key) => {
    const { title, loc, date, desc, presenter, price } = editingValues;

    key = key.eventId;

    axios.put(`http://localhost:8000/admin/event/update/${key}`, {
      title,
      loc,
      date,
      desc,
      presenter,
      price,
    })
      .then((response) => {
        console.log(response.data);
        loadEventList();
        setEditingKey("");
        setEditingValues({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteEvent = (e) => {
    axios.delete(`http://localhost:8000/admin/event/delete/${e}`)
      .then(() => {
        loadEventList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenModal = (record) => {
    setSelectedRow(record);
    setCreate(false)
    setIsModalOpen(true);
    
  };

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
      render: (text, record) => (
        editingKey === record.eventId ? (
          <Input value={editingValues.title} onChange={(e) => setEditingValues({ ...editingValues, title: e.target.value })} />
        ) : (
          text
        )
      ),
    },
    {
      title: "Venue",
      dataIndex: "loc",
      key: "loc",
      render: (text, record) => (
        editingKey === record.eventId ? (
          <Input value={editingValues.loc} onChange={(e) => setEditingValues({ ...editingValues, loc: e.target.value })} />
        ) : (
          text
        )
      ),
    },
    // ... other columns ...
    {
      title: "Operations",
      key: "operations",
      render: (text, record) => (
        <div>
          {/* {editingKey === record.eventId ? (
            <Button style={{ marginBottom: "10px", backgroundColor: "green" }} type="primary" onClick={() => updateEvent(record)}>
              Update Event
            </Button>
          ) : (
            <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => editEvent(record)}>
              Edit Event
            </Button>
          )} */}
          <Button type="primary" danger onClick={() => handleOpenModal(record)}>
            edit Event
          </Button>
        </div>
      ),
    },
  ];
  console.log("selectedRow>>", selectedRow)

  return (
    <main>
      <NavBar/>
      <div>
        <h1 style={{ textAlign: "left" }}>Manage Events</h1>
      </div>
      <CreateEventForm />
      {/* <Button type="primary" onClick={showModal}>
        Add New Event
      </Button> */}
      <div style={{ clear: "both" }}></div>
      <div>
        <Table columns={columns} dataSource={eventList} rowKey="eventId" />
      </div>
      <Modal
        title="Add Event"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        height={400}
        width={1000}
      >
        <Form
          form={form}
          name="basic"
          initialValues={create ? "" : selectedRow}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            width: "100%",
            alignContent: "center",
          }}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="eventId"
            label="Event ID"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            hasFeedback
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "Numbers Only" : ""}
          >
            <Input placeholder="Event ID" name="eventId" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input placeholder="Title" name="title" />
          </Form.Item>
          <Form.Item
            name="Venue"
            label="Venue"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Select name="Venue">
              {locationArr.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Date"
            label="Date"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Description"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <TextArea name="desc" placeholder="Event Description" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item
            name="presenter"
            label="Presenter"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="presenter" placeholder="Presenter" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="price" placeholder="Price" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </div>

        </Form>
      </Modal>
    </main>
  );
};

export default Event;
