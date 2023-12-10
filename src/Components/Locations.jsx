import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            locationList: [],
            sortAscending: false,
        }
    }

    //invoked for each set state(only called once => new class + new componentdidmount)
    componentDidMount() { 
        this.LoadLocationList();
    }

    // load all locations in a table
    LoadLocationList() {
        axios({
            // change the localhost to a public IP
            url: "http://localhost:8080/venue",
            method: "POST",
        })
        .then((r) => {
            this.setState({
                locationList: r.data.map(venue => ({
                    name: venue.venueName,
                    lat: venue.lat,
                    long: venue.long,
                    locid: venue.venueId,
                }))
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
			<main>
                <p><button id="sort-btn"  onClick={() => this.sortTable()}>Sort</button></p>
        
                <table id="locationTable">
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Event Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.locationList.map((location, index) =>
                        <LocationRow key={index} i={index} name={location.name} programme={location.programme} locid={location.locid} loc_id={location._id}/>)
                        }
                    </tbody>
                </table>
            </main>
            
        );
    }

    // sorting of the table with the number of events at the venue
    sortTable() {
        var table, rows, switching, i, x, y, needToSwitch;
        table = document.getElementById("locationTable");
        switching = true; // a flag to track whether any switching has occured
          
        // continue the loop until no more switching is needed
        while (switching) {
          switching = false;
          rows = table.rows;
          
          // loop through all table rows expect the header row
          for (i = 1; i < (rows.length - 1); i++) {
            // Assume no switching is needed at the start of each iteration
            needToSwitch = false;
            
            // get the second cell (TD) from the current row and the next one that will be compared
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];
            
            // compare the two cells based on whether sorting is ascending or descending
            if (this.state.sortAscending) {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                // if sorting is ascending and the current cell is greater than the next one, mark for switching and break the loop
                needToSwitch = true;
                break;
                }
            }
            else {
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                // if sorting is descending and the current cell is less than the next one, mark for switching and break the loop
                needToSwitch = true;
                break;
                }
            }
          }
    

        // If a switch is needed, perform the switch and mark that a switch has occurred
          if (needToSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
          }
        }
        
        if (this.state.sortAscending) {
            document.querySelector("#sort-btn").innerHTML = 'Sort ascending';
            this.setState({
                sortAscending: false
            });
        }
        else {
            document.querySelector("#sort-btn").innerHTML = 'Sort descending';
            this.setState({
                sortAscending: true
            });
        }
    }
}

class LocationRow extends Component {
    render() {
        return (
            <tr>
                <td id={"loc" + this.props.i}>
                    <Link to={`/dashboard/location/${this.props.locid}`}>{this.props.name}</Link>
                </td>
                <td>{this.props.programme.length}</td>
            </tr>
        );
    }
}

export default Locations;