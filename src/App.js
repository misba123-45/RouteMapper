import React, { Component } from 'react';
import sampleData from './MockData';
import { Map, GoogleApiWrapper, Polyline } from 'google-maps-react';

class MapWithDynamicPolyline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polyline: [], // Array to store polyline coordinates
      coordinates: sampleData,
      currentStep: 0, // Current step along the coordinates
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
    const { coordinates, currentStep } = this.state;

    const nextStep = currentStep + 1;

    if (nextStep < coordinates.length) {
      const startPoint = coordinates[currentStep];
      const endPoint = coordinates[nextStep];
      const intermediatePoints = this.interpolateCoordinates(startPoint, endPoint, 10);

      this.setState((prevState) => ({
        polyline: [...prevState.polyline, ...intermediatePoints],
        currentStep: nextStep,
      }));
    }
  };

  interpolateCoordinates(start, end, numPoints) {
    const intermediatePoints = [];
    for (let i = 0; i < numPoints; i++) {
      const fraction = i / (numPoints - 1);
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
    const icons = [
      {
        icon: lineSymbol,
      
      },
    ];
    return (
      <div>
        <Map
          google={google}
          initialCenter={{ lat: 37.33071, lng: 11.27214 }} 
          zoom={5}
          
        >
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
})(MapWithDynamicPolyline);
