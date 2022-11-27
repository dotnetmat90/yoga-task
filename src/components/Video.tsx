import React, { Component } from "react";

class Video extends Component<any, any> {

  video: any = React.createRef();

  componentDidUpdate(preProps: any) {
    const { url } = this.props;
    if (preProps && preProps.url && url) {
      if (preProps.url !== url) {
        this.video.current.src = url;
      }
    }
  }

  render() {
    const { url } = this.props;
    return (
      <video controls ref={this.video}  height={250}>
        <source src={url} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    );
  }
}

export default Video;