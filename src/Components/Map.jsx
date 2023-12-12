import React, { Component } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const libraries = ["places"];

function Map(props) {
//props: venues (array), isSingleLocation (bool), zoom (Number)
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
{Array.isArray(venues) ? (
venues.map((item, idx) => <MarkerF position={{ lat: item.lat, lng: item.long }} key={idx} />)
) : (
<MarkerF position={{ lat: venues.lat, lng: venues.long }} key={0} />
)}
</GoogleMap>
);
}
export default Map;