import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polygon
} from "react-google-maps";
// import { LoadScript, GoogleMap } from '@react-google-maps/api';
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import React, { Component } from "react";
import mapStyles from "./google-map-style.json";
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } from "../../config";
import { FaMapMarkerAlt, FaCheck } from "react-icons/fa";
// import Marker from "./Marker/Marker";
// \import CurrentSelection from "../../global-assets/hotspot-score-icon-small.png";
/*global google*/
class ReactGoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "loading data"
    };
  }

  render() {
    const heatMapData =
      this.props.heatmapData ||
      (this.props.places &&
        this.props.places.map(place => {
          return {
            location: new google.maps.LatLng(place.lat, place.lng),
            weight: place.current_hot_score
          };
        }));

    let GoogleMapExample;
    let icon = {
      url: "https://i.ibb.co/J757PNs/super-small-map-marker.png"
    };

    GoogleMapExample = GoogleMapExample = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          defaultCenter={{ lat: 30.2672, lng: -97.7431 }}
          defaultZoom={16}
          defaultOptions={{ styles: mapStyles }}>

          {this.props.neighbourhoods &&
            this.props.neighbourhoods.map(element => {
              return (
                <Polygon
                  paths={element.borderPoints}
                  key={element.id}
                  label={`${element.name}`}
                  options={{
                    fillColor: "#000",
                    fillOpacity: 0,
                    strokeColor: "#ff5a00",
                    strokeOpacity: 0,
                    strokeWeight: 2
                  }}
                />
              );
            })}
          {this.props.showMarkers &&
            (this.props.places &&
              this.props.places.map(place => {
                return (
                  <Marker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    icon={FaMapMarkerAlt}
                    onClick={() => {
                      this.props.updateSelection(place.id);
                    }}
                  />
                );
              }))}
          {this.props.showHeatmap &&
            (this.props.places && (
              <HeatmapLayer data={heatMapData} options={{ radius: 25 }} />
            ))}
        </GoogleMap>
      ))
    );

    if (this.props.mapCenterNeighbourhood) {
      // const icon = {
      //   url: "https://i.ibb.co/jvB4mBH/marker.png"
      // };
      GoogleMapExample = withScriptjs(
        withGoogleMap(props => (
          <GoogleMap
            defaultCenter={this.props.centerNeighbourhood.center}
            defaultZoom={16}
            defaultOptions={{ styles: mapStyles }}>
            <Polygon
              paths={this.props.centerNeighbourhood.borderPoints}
              key={this.props.centerNeighbourhood.id}
              options={{
                fillColor: "#ff5a00",
                fillOpacity: 0.2,
                strokeColor: "#ff5a00",
                strokeOpacity: 0.2,
                strokeWeight: 2
              }}
              onClick={() => { }}
            />
            {this.props.showMarkers &&
              this.props.places.map(place => {
                return (
                  <Marker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.long }}
                    icon={icon}
                    onClick={() => {
                      this.props.updateSelection(place.id);
                    }}
                  />
                );
              })}
            {this.props.showHeatmap &&
              (this.props.places && (
                <HeatmapLayer data={heatMapData} options={{ radius: 20 }} />
              ))}
          </GoogleMap>
        ))
      );
    }

    if (this.props.mapCenterPlace) {
      const currentSelection = {
        // url: "https://i.ibb.co/yf1NfV2/current-selection.png"
        FaCheck
      };

      const onTheList = {
        // url: "https://i.ibb.co/Sdt6P2G/hearted.png"
        FaCheck
      };
      const defaultIcon = {
        // url: "assets/icon/marker.png"
        FaCheck
      };
      GoogleMapExample = withScriptjs(
        withGoogleMap(props => (
          <GoogleMap
            defaultCenter={{
              lat: this.props.centerPlace.lat,
              lng: this.props.centerPlace.lng
            }}
            defaultZoom={16}
            defaultOptions={{ styles: mapStyles }}>
            {this.props.showMarkers &&
              this.props.places.map(place => {
                let image = defaultIcon;
                if (place.id === this.props.centerPlace.id) {
                  image = currentSelection;
                }
                if (
                  this.props.selectionList.map(el => el.id).includes(place.id)
                ) {
                  image = onTheList;
                }
                return (
                  <Marker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    icon={image && image}
                    // label={`${place.rating}`}
                    labelClass={".label-style"}
                    onClick={() => {
                      this.props.updateSelection(place.id);
                    }}
                  />
                );
              })}
            {this.props.showHeatmap &&
              (this.props.places && (
                <HeatmapLayer data={heatMapData} options={{ radius: 20 }} />
              ))}
          </GoogleMap>
        ))
      );
    }

    return (
      <div className='map-container'>
        <GoogleMapExample
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            }&v=3.exp&libraries=visualization`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default ReactGoogleMap;
