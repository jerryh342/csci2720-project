import React, { Component } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import axios from "axios";

function TempMap(props) {
    const libraries = ["places"];
    const venue = props.venues; // Assume venues is an array of locations
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
        {venue.map((venue, index) => 
          <MarkerF key={index} position={{ lat: venue.lat, lng: venue.long }} />
        )}
      </GoogleMap>
    );
  }

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: this.props.long,
      lat: this.props.lat,
      locations: [],
    };
  }

  componentDidMount() {
    this.loadLocation();
  }

  loadLocation() {
    axios({
      url: "http://localhost:8000/venue",
      method: "GET",
    })
    .then((r) => {    
      this.setState({  
        locations: r.data, // Assuming r.data is an array of locations
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return(
        <div>
        <TempMap venues={this.state.locations} />
        </div>
    );
  }
}

export default Map;