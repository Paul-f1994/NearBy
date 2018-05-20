import React from 'react';
import {Tabs, Button, Spin} from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, TOKEN_KEY, AUTH_PREFIX} from '../constants';
import $ from 'jquery';

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
  state = {
    loadingGeoLocation: false
  }

  componentDidMount() {
    this.setState({loadingGeoLocation: true});
    this.getGeoLocation();
  }

  getGeoLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          this.onSuccessLoadGeoLocation,
          this.onFailedLoadGeolocation,
          GEO_OPTIONS
      );
    } else {
      /*fail*/
    }
  }

  onSuccessLoadGeoLocation = (position) => {
    this.setState({loadingGeoLocation: false});
    console.log(position);
    const {
      latitude,
      longitude
    } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));

    this.loadNearByPosts();

  }

  onFailedLoadGeolocation = (error) => {
    this.setState({loadingGeoLocation: false});
    console.log(error);
  }

  loadNearByPosts = () => {
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
    // const lat = 37.5357;
    // const lon = -122.2695;
    $.ajax(
        {
          url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
          method: "GET",
          headers: {
            Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
          }
        }
    ).then((response) => {
      console.log(response);
    }, (response) => {
      console.log(response.text);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const operations = <Button type="primary">Create New Post</Button>;

    return (
        <div className="main-tabs">
          <Tabs tabBarExtraContent={operations}>
            <TabPane tab="Posts" key="1">{this.state.loadingGeoLocation ?
                <Spin tip="Loading geo location"></Spin> : ''}</TabPane>
            <TabPane tab="Map" key="2">Content of tab 2</TabPane>
          </Tabs>
        </div>
    );
  }
}
