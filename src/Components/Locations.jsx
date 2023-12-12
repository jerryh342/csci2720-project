import React, { Component } from "react";
import axios from "axios";
import { Table, Input } from 'antd';
import { SearchOutlined} from '@ant-design/icons';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const libraries = ["places"];

function TempMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBGGC2kgrhzogounenjJfsElrOkWmOFlM0",
    libraries,
  });
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  const center = {
    lat: 22.302711,
    lng: 114.177216,
  };
  if (loadError) {
    console.log(loadError);
    return <div>Error loading map</div>;
  }
  if (!isLoaded) {
    return <div>Rendering</div>;
  }
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>
      {/* {locationList && locationList.map((location, index) => 
        // <MarkerF key={index} position={{ lat: location.lat, lng: location.lng }} />
      )} */
      <MarkerF position={center} />
      }
    </GoogleMap>
  );
}


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
        console.log(r.data);
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
        // Assuming 'name' is the property you want to search in
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
        sorter: (a, b) => a.locid - b.locid,
        sortDirections: ['descend', 'ascend'],
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
    ];

    return (
        <main>
          <Input
            size="large"
            placeholder="Search"
            onChange={this.searchLocation}
            prefix={<SearchOutlined />}
          />
          <br />
          <TempMap /> 
          <Table columns={columns} dataSource={this.state.filteredLocations} rowKey="locid" />
        </main>
    );
  }
}

export default Locations;