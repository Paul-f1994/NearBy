import React from 'react';
import {withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow} from 'react-google-maps';

class AroundMap extends React.Component {
  render() {
    return (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{lat: -34.397, lng: 150.644}}
        >
          <Marker
              position={{lat: -34.397, lng: 150.644}}
          >
          </Marker>
        </GoogleMap>
    )
  }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));