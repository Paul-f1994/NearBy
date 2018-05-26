import React from 'react';
import {Tabs, Button, Spin} from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, TOKEN_KEY, AUTH_PREFIX} from '../constants';
import $ from 'jquery';
import {Gallery} from './Gallery'
import {CreatePostButton} from './CreatePostButton'

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
  state = {
    loadingGeoLocation: false,
    loadingPost: false,
    error: '',
    posts: []
  }

  componentDidMount() {
    this.getGeoLocation();
  }

  getGeoLocation = () => {
    this.setState({loadingGeoLocation: true, error: ''});
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          this.onSuccessLoadGeoLocation,
          this.onFailedLoadGeolocation,
          GEO_OPTIONS
      );
    } else {
      this.setState({error: 'Your browser does not support geolocation!'});
    }
  }

  onSuccessLoadGeoLocation = (position) => {
    this.setState({loadingGeoLocation: false, error: ''});
    console.log(position);
    const {
      latitude,
      longitude
    } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
    this.loadNearByPosts();

  }

  onFailedLoadGeolocation = (error) => {
    this.setState({loadingGeoLocation: false, error: 'Failed to load geo location!'});
    console.log(error);
  }

  loadNearByPosts = () => {
    this.setState({loadingPost: true, error: ''});
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
    // const lat = 37.5357;
    // const lon = -122.2695;
    $.ajax(
        {
          url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
          method: "GET",
          headers: {
            Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
          }
        }
    ).then((response) => {
      this.setState({posts: response, loadingPost: false, error: ''});
      console.log(response);
    }, (response) => {
      this.setState({loadingPost: false, error: 'Failed to load posts!'});
      console.log(response.text);
    }).catch((error) => {
      console.log(error);
    });
  }

  getGalleryPanelContent = () => {
    if (this.state.error) {
      return <div> {this.state.error} </div>;
    } else if (this.state.loadingGeoLocation) {
      return <Spin tip="Loading geo location..."></Spin>;
    } else if (this.state.loadingPost) {
      return <Spin tip="Loading posts..."></Spin>
    } else if (this.state.posts && this.state.posts.length > 0) {
      const images = this.state.posts.map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
          caption: post.message,
        }
      });
      return <Gallery images={images}/>
    } else {
      return "";
    }
  }

  render() {
    const createPostButton = <CreatePostButton loadNearByPosts={this.loadNearByPosts}/>;
    return (
        <div className="main-tabs">
          <Tabs tabBarExtraContent={createPostButton}>
            <TabPane tab="Posts" key="1">
              {this.getGalleryPanelContent()}
            </TabPane>
            <TabPane tab="Map" key="2">Content of tab 2</TabPane>
          </Tabs>
        </div>
    );
  }
}
