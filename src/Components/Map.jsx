import React, { Component } from 'react';
import axios from 'axios';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

function TempMap(props) {
    const libraries = ["places"];
    const venue = props.venues;
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyBGGC2kgrhzogounenjJfsElrOkWmOFlM0",
      libraries,
    });
    const mapContainerStyle = {
      width: "100%",
      height: "100%",
    };
    const center = {
      lat: venue[0].lat, //default lat, to be changed
      lng: venue[0].long,
    };
    if (loadError) {
      console.log(loadError);
      return <div>Error loading map</div>;
    }
    if (!isLoaded) {
      return <div>Rendering</div>;
    }
    return (
    <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={10} 
        center={center} 
        onDragEnd={() => props.onMove(center)}>
      </GoogleMap>
    );
  }

// show all locations in a map, with links to each single location
class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lng: this.props.long,
            lat: this.props.lat,
        };
        this.mapContainer = React.createRef();
    }

    //invoked for each set state(only called once => new class + new componentdidmount)
    componentDidMount() {
        this.LoadLocation();
    }

    LoadLocation() {
        axios({
            // change the localhost to a public IP
            url: "http://localhost:8080/venue",
            method: "POST",
        })
        .then((r) => {    
            this.setState({  
                lng: r.venue.long,
                lat: r.venue.lat,
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleMove = (center) => {
        this.setState({
            lng: center.lng().toFixed(4),
            lat: center.lat().toFixed(4),
        });
    }

    render() {
        const { lng, lat} = this.state;
        return (
            <div>
                <div>
                    Longitude:&nbsp;{lng} | Latitude:&nbsp;{lat}
                </div>
                <div>
                    <TempMap lng={lng} lat={lat} onMove={this.handleMove} />
                </div>
            </div>
        );
    }
}

export default Map;