import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: 'auto'
  }
};

export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
        const { lat, lng } = this.props.initialCenter;
        this.state = {
          currentLocation: {
            lat: lat,
            lng: lng
          },
          input:''
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap();
        }
    }
    recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation;
        const google = this.props.google;
        const maps = google.maps;
        if (map) {
          let center = new maps.LatLng(current.lat, current.lng);
          map.panTo(center);
        }
    }
    componentDidMount() {
      const current_user = JSON.parse(localStorage.me)
      if (this.props.centerAroundCurrentLocation) {
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            const coords = pos.coords;
            this.setState({
              currentLocation: {
                lat: coords.latitude,
                lng: coords.longitude
              }
            });
            axios({
              method: 'post',
              url: 'http://localhost:5000/api/v1/locations/new',
              data: { 
                  id: current_user.user.id,
                  lat : this.state.currentLocation.lat,
                  lng: this.state.currentLocation.lng
              }
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
              console.log(error.response)
            })
          });
        }
      }
      this.loadMap();
    }
    loadMap() {
        if (this.props && this.props.google) {
          const { google } = this.props;
          const maps = google.maps;
          // const searchbox = new maps.places.SearchBox(input)
          const mapRef = this.refs.map;
          const node = ReactDOM.findDOMNode(mapRef);
          let { zoom } = this.props;
          const { lat, lng } = this.state.currentLocation;
          const center = new maps.LatLng(lat, lng);
          const mapConfig = Object.assign(
            {},
            {
              center: center,
              zoom: zoom
            }
          );
          this.map = new maps.Map(node, mapConfig);
        }
    }
    renderChildren() {
        const { children } = this.props;
        if (!children) return;
        return React.Children.map(children, c => {
          if (!c) return;
          return React.cloneElement(c, {
            map: this.map,
            google: this.props.google,
            mapCenter: this.state.currentLocation
          });
        });
    }
    // handleInput=(event)=> {
    //   const name = event.target.name;
    //   const value = event.target.value;
    //   this.setState({ [name]: value });
    // }
    render() {
        const style = Object.assign({}, mapStyles.map);
       return (
         <div>
           <div style={style} ref="map">
             Loading map...
           </div>
           {/* <input id="pac-input" className="controls" type="text" name="input" placeholder="Search Box" onChange={this.handleInput} /> */}
           {this.renderChildren()}
         </div>
       );
    }
}
export default CurrentLocation;

CurrentLocation.defaultProps = {
    zoom: 16,
    initialCenter: {
        lat: -1.2884,
        lng: 36.8233
    },
    centerAroundCurrentLocation: false,
    visible: true
};