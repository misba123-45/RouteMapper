import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Polyline, Marker } from 'google-maps-react';
import sampleData from './MockData';
import { STARTING_POINT, ENDING_POINT } from './App.constants';
import './App.css';

class DynamicPolyline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polyline: [], // polyline coordinates
      coordinates: sampleData,
      currentStep: 0, // Current step along the coordinates
      isPlaying:false
    };
  }

  componentDidMount() {
    // Simulate real-time updates every second
    this.interval = setInterval(this.updatePolyline, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePolyline = () => {
    const { coordinates, currentStep,isPlaying } = this.state;
    if(isPlaying){
    const nextStep = currentStep + 1;
    if (nextStep < coordinates.length) {
      const startPoint = coordinates[currentStep];
      const endPoint = coordinates[nextStep];
      const intermediatePoints = this.interpolateCoordinates(startPoint, endPoint, 10);
      this.setState((state) => ({
        polyline: [...state.polyline, ...intermediatePoints],
        currentStep: nextStep,
      }));
    }
  }
  };

  interpolateCoordinates(start, end, points) {
    const intermediatePoints = [];
    for (let i = 0; i < points; i++) {
      const fraction = i / (points - 1);
      const lat = Number(start.lat) + fraction * (Number(end.lat) - Number(start.lat));
      const lng = Number(start.lng) + fraction * (Number(end.lng) - Number(start.lng));
      intermediatePoints.push({ lat, lng });
    }
    return intermediatePoints;
  }

  render() {
    const { polyline } = this.state;
    const { google } = this.props;
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4, 
      strokeColor: '#FF0000', 
    };
    const icons = [{ icon: lineSymbol}];
    const buttonText=this.state.isPlaying?'Pause':'Play';
    return (
      <div>
        <button className="button" onClick={()=>this.setState({isPlaying:!this.state.isPlaying})}>{buttonText}</button>
        <Map
          google={google}
          initialCenter={STARTING_POINT} 
          zoom={5}
        >
          <Marker position={STARTING_POINT} icon={{path:this.state.polyline.length ?google.maps.SymbolPath.CIRCLE: null,scale:4}}/>
          <Marker position={ENDING_POINT}/>
          <Polyline
            path={polyline}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            icons={icons}
          />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'API KEY',
})(DynamicPolyline);
