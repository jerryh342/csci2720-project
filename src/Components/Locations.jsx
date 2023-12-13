import React, { Component } from "react";
import axios from "axios";
import { Table, Input } from 'antd';
import { SearchOutlined} from '@ant-design/icons';
import Map from './Map';

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
    };

    this.searchLocation = this.searchLocation.bind(this);

  }

  //invoked for each set state(only called once => new class + new componentdidmount)
  componentDidMount() {
    this.LoadLocationList();
  }

  // load all locations in a table
  LoadLocationList() {
    axios({
        // need change localhost to the publicIP
        url: "http://localhost:8000/venue",
        method: "GET",
    })
    .then((r) => {
        this.setState({
            locationList: r.data,
            filteredLocations: r.data
        });
    })
    .catch((err) => {
        console.log(err);
    });
  }

  searchLocation(event) {
    const filter = event.target.value.toLowerCase();
  
    if (filter === '') {
      this.setState({ filteredLocations: this.state.locationList });
    } else {
      const filteredLocations = this.state.locationList.filter(location => {
        const txtValue = Object.values(location).join(' ').toLowerCase();
        return txtValue.indexOf(filter) > -1;
      });
  
      this.setState({ filteredLocations });
    }
  }

  render() {
    const columns = [
      {
        title: 'Venue ID',
        dataIndex: 'locid',
        key: 'locid',
      },
      {
        title: 'Venue Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <a href={`/venue/${record.locid}`}>{text}</a>,
      },
      {
        title: 'Latitude',
        dataIndex: 'lat',
        key: 'lat',
      },
      {
        title: 'Longitude',
        dataIndex: 'long',
        key: 'long',
      },
      {
        title: 'Number of Events',
        dataIndex: 'eventCount',
        key: 'eventCount',
        sorter: (a, b) => a.eventCount - b.eventCount,
        sortDirections: ['descend', 'ascend'],
      },
    ];

    return (
        <main>
          <div>
            <Input
              size="large"
              placeholder="Search"
              onChange={this.searchLocation}
              prefix={<SearchOutlined />}
            />
          </div>
          <div style={{height: '500px', width: '100%'}}>
            {<Map venues={this.state.locationList} isSingleLocation={false} zoom={11} markerLink={true}/>}
          </div>
          <div>
            <Table columns={columns} dataSource={this.state.filteredLocations} rowKey="locid" />
          </div>
        </main>
    );
  }
}

export default Locations;
