import React from 'react'
import { InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import CurrentLocation from './CurrentLocation';
import axios from 'axios';


export class MapContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentLatLng: {
                lat: 0,
                lng: 0
            },
            isMarkerShown: false,
            showingInfoWindow: false,
            activeMarker: {}, 
            selectedUser: {},
            locations:[]  
        }
    }
    
    onMarkerClick = (props, marker, e) =>{
        console.log(props)
        this.setState({
            selectedUser: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };
    componentDidMount() {
        const current_user = JSON.parse(localStorage.me)
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/locations/show',
            data: { 
                id: current_user.user.id
            }
        })
        .then(response => {
            this.setState({
                locations:response.data.locations
            })
            console.log(response);
        })
        .catch(error => {
            console.log(error.response)
        })
    }
    
    render() {
        return (
            <CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
            >
                {this.state.locations.map((item, index) =>(
                    <Marker
                    key={index}
                    onClick={this.onMarkerClick}
                    position={{ lat: item.position.lat, lng: item.position.lng }}
                    name={item.user}
                    />
                        
                    )
                    )
                }
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                    >
                    <div>
                        <a href={`/users/${this.state.selectedUser.name}`} ><h4>{this.state.selectedUser.name}</h4></a>
                    </div>
                </InfoWindow>
            </CurrentLocation>
            
        )
    }
}
 
export default GoogleApiWrapper({
  apiKey: ("AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA")
})(MapContainer)