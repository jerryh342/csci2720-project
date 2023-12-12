import React, { Component } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

function Map(props) {
  //props: venues (array), isSingleLocation (bool), zoom (Number)
  const libraries = ["places"];
  const venues = props.venues;
  const defaultCenter = {
    lat: props.isSingleLocation ? venues.lat : 22.3529584,
    lng: props.isSingleLocation ? venues.long : 113.974591,
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBGGC2kgrhzogounenjJfsElrOkWmOFlM0",
    libraries,
  });
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };
  if (loadError) {
    console.log(loadError);
    return <div>Error loading map</div>;
  }
  if (!isLoaded) {
    return <div>Rendering</div>;
  }
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={props.zoom ? props.zoom : 10} center={defaultCenter}>
      {venues.isArray ? (
        venues.map((item, idx) => <MarkerF position={{ lat: item.lat, lng: item.long }} key={idx} />)
      ) : (
        <MarkerF position={{ lat: venues.lat, lng: venues.long }} key={0} />
      )}
    </GoogleMap>
  );
}

// show all locations in a map, with links to each single location
/*class Map extends Component {

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
*/
export default Map;
