import React, { Component } from "react";
import { FaMapMarked } from "react-icons/fa";

class NightOutBuilder extends Component {
  render() {
    return (
      <div id='NightOutBuilder'>
        <div className='container-fluid'>


          <div className='d-flex justify-content-center'>
            <button className='btn btn-outline-light build-night-button'>
              <FaMapMarked className='map-icon' />
              See HotSpots Map
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NightOutBuilder;
