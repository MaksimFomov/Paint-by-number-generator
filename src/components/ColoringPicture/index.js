import React, { Component } from "react";
import Palette from "./palette";
import "../../styles/style.css";
import { Button } from "react-bootstrap";

import translate from "../../i18n/translate";

class ColoringPicture extends Component {
  constructor(props) {
    super(props);
    // Refs info from: https://reactjs.org/docs/refs-and-the-dom.html
    this.myRef = React.createRef();

    this.state = {
      imageLoaded: false,
      picture: {},
      currentColor: "",
    };

    this.getPicture = this.getPicture.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.convertHexToRGB = this.convertHexToRGB.bind(this);
    this.handleFilling = this.handleFilling.bind(this);
    this.floodFill = this.floodFill.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.savePicture = this.savePicture.bind(this);
    this.deletePicture = this.deletePicture.bind(this);
    this.handleName = this.handleName.bind(this);
    // this.drawImageScaled = this.drawImageScaled.bind(this);
  }

  getPicture = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        picture: URL.createObjectURL(event.target.files[0]),
      });

      this.img = new Image();
      this.img.src = window.URL.createObjectURL(event.target.files[0]);

      this.img.onload = () => {
        this.setState({ imageLoaded: true });
      };
    }
  };

  async savePicture() {
    //get id from url
    const key = this.props.match.params.id;
    const picture = this.state.picture;
    //request to firebase to do patch picture
    await this.props.firebase.doSavePicture(key, picture, (result) => {
      if (result) {
        window.alert("Picture saved successfully!", "success");
      }
    });
  }

  async deletePicture() {
    //get id from url
    const key = this.props.match.params.id;
    //request to firebase to do delete picture
    await this.props.firebase.doDeletePicture(key, () => {
      this.props.history.push("/");
    });
  }

  handleColor(color) {
    this.setState({ currentColor: color });
  }

  convertHexToRGB(hex) {
    //http://www.javascripter.net/faq/hextorgb.htm
    let color = [];

    const R = hexToR(hex);
    const G = hexToG(hex);
    const B = hexToB(hex);

    function hexToR(hex) {
      return parseInt(cutHex(hex).substring(0, 2), 16);
    }

    function hexToG(hex) {
      return parseInt(cutHex(hex).substring(2, 4), 16);
    }

    function hexToB(hex) {
      return parseInt(cutHex(hex).substring(4, 6), 16);
    }

    function cutHex(hex) {
      return hex.charAt(0) === "#" ? hex.substring(1, 7) : hex;
    }

    color = [R, G, B, 255];
    return color;
  }

  handleFilling(event) {
    //pixel coordinates that was clicked on
    const x = event.nativeEvent.layerX;
    const y = event.nativeEvent.layerY;
    //get currentColor in rgb
    let color = this.convertHexToRGB(this.state.currentColor);

    let newEvent = { type: "fill", color, x, y };

    let { events, ...rest } = this.state.picture;

    if (events === undefined) {
      events = [];
    }

    this.setState({
      picture: {
        events: [...events, newEvent],
        ...rest,
      },
    });
  }

  floodFill(ctx, x, y, fillColor, range = 1) {
    //https://stackoverflow.com/questions/2106995/how-can-i-perform-flood-fill-with-html-canvas
    const getPixel = (imageData, x, y) => {
      // console.log("getting the pixel");
      if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
        return [-1, -1, -1, -1]; // impossible color
      } else {
        const offset = (y * imageData.width + x) * 4;
        return imageData.data.slice(offset, offset + 4);
      }
    };

    const setPixel = (imageData, x, y, fillColor) => {
      // console.log('setting the pixel');
      const offset = (y * imageData.width + x) * 4;
      imageData.data[offset + 0] = fillColor[0];
      imageData.data[offset + 1] = fillColor[1];
      imageData.data[offset + 2] = fillColor[2];
      imageData.data[offset + 3] = fillColor[3];
    };

    const colorsMatch = (a, b, rangeSq) => {
      const dr = a[0] - b[0];
      const dg = a[1] - b[1];
      const db = a[2] - b[2];
      const da = a[3] - b[3];
      return dr * dr + dg * dg + db * db + da * da < rangeSq;
    };

    // read the pixels in the canvas
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    // flags for if we visited a pixel already
    const visited = new Uint8Array(imageData.width * imageData.height);

    // get the before pixel color we're filling
    const targetColor = getPixel(imageData, x, y);

    if (colorsMatch([0, 0, 0, 255], targetColor, 2000)) {
      return;
    }
    // check we are actually filling a different color
    else if (!colorsMatch(targetColor, fillColor)) {
      const rangeSq = range * range;
      const pixelsToCheck = [x, y];

      while (pixelsToCheck.length > 0) {
        const y = pixelsToCheck.pop();
        const x = pixelsToCheck.pop();

        const currentColor = getPixel(imageData, x, y);
        if (
          !visited[y * imageData.width + x] &&
          colorsMatch(currentColor, targetColor, rangeSq)
        ) {
          setPixel(imageData, x, y, fillColor);
          // mark we were here already
          visited[y * imageData.width + x] = 1;
          // add new pixels to check
          pixelsToCheck.push(x + 1, y);
          pixelsToCheck.push(x - 1, y);
          pixelsToCheck.push(x, y + 1);
          pixelsToCheck.push(x, y - 1);
        }
      }
      // put the data back
      ctx.putImageData(imageData, 0, 0);
    }
  }

  removeEvent() {
    const { events, ...rest } = this.state.picture;
    events?.pop();

    this.setState({
      picture: {
        events: events,
        ...rest,
      },
    });
  }

  handleName(event) {
    const { name, ...rest } = this.state.picture;

    this.setState({
      picture: {
        name: event.target.value,
        ...rest,
      },
    });
  }

  fillAlpha(ctx, bgColor) {
    // bgColor is a valid CSS color ctx is 2d context
    // save state
    ctx.save();
    // make sure defaults are set
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";

    // fill transparent pixels with bgColor
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // cleanup
    ctx.restore();
  }

  render() {
    //check if image loaded before drawing the canvas
    if (this.state.imageLoaded) {
      this.canvas = this.myRef.current;

      var MAX_WIDTH = 900;
      var MAX_HEIGHT = 700;
      var width = this.img.width;
      var height = this.img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      this.canvas.width = width;
      this.canvas.height = height;

      if (this.state.picture.ctx) {
        this.ctx = this.state.picture.ctx;
      } else {
        //get the context API
        this.ctx = this.canvas.getContext("2d");

        this.fillAlpha(this.ctx, "white");

        //copy image pixels to the canvas
        this.ctx.drawImage(this.img, 0, 0, width, height);
      }

      if (this.state.picture.events) {
        this.state.picture.events.forEach((e) => {
          if (e.type === "fill") {
            this.floodFill(this.ctx, e.x, e.y, e.color, 128);
          }
        });
      }
    }

    return (
      <div class="container">
        <div class="row">
          <h2> </h2>
          <span>
            {translate("inputFile")}{" "}
            <input
              name="imageLoader"
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={this.getPicture}
            ></input>
            ).
          </span>
        </div>

        <div id="ActivityDIV">
          <Palette
            onSelectColor={this.handleColor}
            onUndoMove={this.removeEvent}
          />

          <canvas
            className="canvas"
            id="canvas"
            ref={this.myRef}
            onClick={this.handleFilling}
          />

          <div className="delete-save">
            <label className="save-pic">
              Picture Name:
              <input
                type="text"
                placeholder={this.state.picture.name}
                onChange={this.handleName}
              />
              <Button type="text" onClick={this.savePicture}>
                Save
              </Button>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default ColoringPicture;
