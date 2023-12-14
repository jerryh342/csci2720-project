import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import NavBar from "./navbar";

class Event extends Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         eventList: [],
    //         editingKey: '',
    //         editingValues: {},
    //         showForm: false,
    //     };
    // }

    // componentDidMount() {
    //     this.loadEventList();
    // }

    // loadEventList() {
    //     axios({
    //         url: "http://localhost:8000/admin/event",
    //         method: "GET",
    //     })
    //     .then((r) => {
    //         this.setState({
    //             eventList: r.data,
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    // }

    // // Enable Form
    // allowInput = () => {
    //     this.setState({showForm: true});
    // }

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

    // // Edit an event
    // editEvent = (e) => {
    //     this.setState({
    //         editingKey: e.eventId,
    //         editingValues: {
    //             title: e.title, 
    //             loc: e.venue, 
    //             date: e.dateTime, 
    //             desc: e.desc, 
    //             presenter: e.presenter, 
    //             price: e.price
    //         },
    //     });
    // };

    // // Update an event
    // updateEvent = (key) => {
    //     const { editingValues } = this.state;

    //     key = key.eventId; 

    //     axios({
    //         url: `http://localhost:8000/updateevent/${key}`,
    //         method: "PUT",
    //         data: editingValues,
    //     })
    //     .then((r) => {
    //         console.log(r.data);
    //         // Update the user list with the updated user data
    //         this.setState(prevState => ({
    //         eventList: prevState.eventList.map(eventList => eventList.eventId === r.data.eventId ? r.data : eventList),
    //         editingKey: '',
    //         editingValues: {},
    //         }));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    // };

    // // Delete an event
    // deleteUser = (e) => {    
    //     axios({
    //         // need change localhost to the publicIP
    //         url: `http://localhost:8000/deleteevnet/${e}`, 
    //         method: "DELETE",
    //     })
    //     .then((e) => {
    //         this.loadEventList();
    //     })
    //     .catch((err) => console.log(err))
    // }

    // render(){
    //     const { editingKey, editingValues } = this.state;
    //     const columns = [
    //         {
    //             title: 'Event ID',
    //             dataIndex: 'eventId',
    //             key: 'eventId',
    //         },
    //         {
    //             title: 'Event Name',
    //             dataIndex: 'title',
    //             key: 'title',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.title}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, title: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //         {
    //             title: 'Venue',
    //             dataIndex: 'loc',
    //             key: 'loc',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.loc}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, loc: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //         {
    //             title: 'Date Time',
    //             dataIndex: 'date',
    //             key: 'date',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.date}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, date: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //         {
    //             title: 'Event Description',
    //             dataIndex: 'desc',
    //             key: 'desc',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.desc}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, desc: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //         {
    //             title: 'Presenter',
    //             dataIndex: 'presenter',
    //             key: 'presenter',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.presenter}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, presenter: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //         {
    //             title: 'Price',
    //             dataIndex: 'price',
    //             key: 'price',
    //             render: (text, record) => editingKey === record.eventId ? (
    //                 <Input
    //                 value={editingValues.price}
    //                 onChange={(e) =>
    //                     this.setState({ editingValues: { ...editingValues, price: e.target.value } })
    //                 }
    //                 />
    //             ) : (
    //             text
    //             ),
    //         },
    //     ]

    //     return(
    //         <main>
    //             <div>
    //             {/* <NavBar /> */}
    //             <h1 style={{textAlign: "left"}}>Manage Users</h1>
    //             <Button style={{float: "left", marginLeft: '7px',marginBottom: '10px'}} type="primary" onClick={() => allowInput}>Create User</Button>
    //             </div>
    //             <div style={{ clear: "both" }}>    
    //             {this.state.showForm && (
    //             <Form form={form} onFinish={this.addEvent} onFinishedFailed = {onFinishFailed}>
    //                 <Form.Item name="EventID" rules={[{ required: true}]}>
    //                 <Input placeholder="Event ID" />
    //                 </Form.Item>
    //                 <Form.Item name="Title" rules={[{ required: true}]}>
    //                 <Input placeholder="Title" />
    //                 </Form.Item>
    //                 <Form.Item name="Venue" rules={[{ required: true}]}>
    //                 <Input placeholder="Location" />
    //                 </Form.Item>
    //                 <Form.Item name="Date" rules={[{ required: true}]}>
    //                 <Input placeholder="Date and Time" />
    //                 </Form.Item>
    //                 <Form.Item name="Description" rules={[{ required: true}]}>
    //                 <Input placeholder="Event Description" />
    //                 </Form.Item>
    //                 <Form.Item name="Presenter" rules={[{ required: true}]}>
    //                 <Input placeholder="Presenter" />
    //                 </Form.Item>
    //                 <Form.Item name="Price" rules={[{ required: true}]}>
    //                 <Input placeholder="Price" />
    //                 </Form.Item>
    //                 <Form.Item>
    //                 <Button 
    //                     style={{marginBottom: '10px'}} 
    //                     type="primary" 
    //                     htmlType="submit" 
    //                     onClick={() => this.addEvent()}
    //                 >
    //                 Add Event
    //                 </Button>
    //                 </Form.Item>
    //             </Form>
    //             )}
    //             </div>
    //             <div>
    //             <Table columns={columns} dataSource={this.state.eventList} rowKey="eventId" />
    //             </div>
    //         </main>
    //     );
    // }
}
export default Event;