import React, { Component } from "react";
import Palette from "./palette";
import "../../styles/style.css";
import { Button } from "react-bootstrap";
import translate from "../../i18n/translate";
import { getDatabase, ref, set, get, child, push } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class ColoringPicture extends Component {
  constructor(props) {
    super(props);
    // Refs info from: https://reactjs.org/docs/refs-and-the-dom.html
    this.myRef = React.createRef();

    this.state = {
      imageLoaded: false,
      picture: {},
      currentColor: "",
      colors: this.standartPallete,
      standartPallete: this.standartPallete,
      inputValue: "",
      userUID: "",
      pictureId: "null",
      checked: false,
      cleanPicture: false,
    };

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUid = user.uid;

        this.setState({
          userUID: userUid,
        });

        const dbRef = ref(getDatabase());
        get(child(dbRef, "picturesForColoring/" + userUid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const picture = snapshot.val();

              this.setState({
                picture: picture.pictureImage,
              });

              this.img = new Image();
              this.img.src = picture.pictureImage;

              this.img.onload = () => {
                this.setState({ imageLoaded: true });
                const pallete = picture.pallete;

                this.setState({ colors: pallete });

                this.setState({ pictureId: picture.pictureId });

                this.setState({ cleanPicture: picture.cleanPicture });
              };
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    this.getPicture = this.getPicture.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.convertHexToRGB = this.convertHexToRGB.bind(this);
    this.handleFilling = this.handleFilling.bind(this);
    this.floodFill = this.floodFill.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.savePicture = this.savePicture.bind(this);
    this.handleName = this.handleName.bind(this);
    this.loadTheLastPalleteAndPicture =
      this.loadTheLastPalleteAndPicture.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.savePictureInMyPicture = this.savePictureInMyPicture.bind(this);
  }

  standartPallete = [
    "#000000",
    "#343433",
    "#4E4E4D",
    "#676868",
    "#979797",
    "#CECCCC",
    "#FFFFFF",
    "#F7DAAF",
    "#F7ED45",
    "#FBEE34",
    "#FCD55A",
    "#FDD209",
    "#FFCD37",
    "#FDBE16",
    "#F99B29",
    "#F16A2D",
    "#F37122",
    "#EF463C",
    "#F26F68",
    "#EC2724",
    "#931D1A",
    "#A6322E",
    "#B44426",
    "#7D4829",
    "#AD7229",
    "#DB8D77",
    "#E79D5D",
    "#EC9342",
    "#E4B07C",
    "#E08C39",
    "#DDA463",
    "#BA9F53",
    "#9D8223",
    "#BACD3F",
    "#68AF46",
    "#69BD45",
    "#53B948",
    "#169E49",
    "#05753C",
    "#71CCDC",
    "#188FCA",
    "#3CBEB7",
    "#3C75BA",
    "#014159",
    "#4454A4",
    "#5A499E",
    "#583E98",
    "#6A449B",
    "#905FA7",
    "#8D52A1",
    "#C196C5",
    "#DD64A5",
    "#E0398C",
    "#DB778D",
  ];

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  loadTheLastPalleteAndPicture() {
    if (
      localStorage.getItem("lastPictureColors") !== null &&
      localStorage.getItem("lastPictureImg") !== null
    ) {
      this.setState({ cleanPicture: false });

      //Load picture
      const svgUrl = localStorage.getItem("lastPictureImg");

      this.setState({
        picture: svgUrl,
      });

      this.img = new Image();
      this.img.src = svgUrl;

      this.img.onload = () => {
        this.setState({ imageLoaded: true });

        //Load pallete
        const pallete = JSON.parse(localStorage.getItem("lastPictureColors"));

        for (let i = 0; i < pallete.length; i++) {
          pallete[i] = this.rgb2hex(
            pallete[i][0],
            pallete[i][1],
            pallete[i][2]
          );
        }

        this.setState({ colors: pallete });

        if (this.state.userUID !== "") {
          this.setState({ pictureId: "null" });
          const db = getDatabase();
          set(ref(db, "picturesForColoring/" + this.state.userUID), {
            pictureImage: localStorage.getItem("lastPictureImgFirebase"),
            pictureId: this.state.pictureId,
            pallete: pallete,
            cleanPicture: false,
          });
        }
      };
      this.img.onerror = () => {
        this.setState({ colors: this.standartPallete });
        alert("Картинка не найдена, сгенерируйте новую!");
      };
    } else {
      alert(
        "Последняя картинка или палитра не найдена, попробуйте сгенерировать картинку."
      );
    }
  }

  savePictureInMyPicture() {
    if (this.state.imageLoaded) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userUid = user.uid;

          const pictureName = prompt("Введите название картинки");

          if (pictureName) {
            const db = getDatabase();

            const pallete = [];
            for (let i = 0; i < this.state.colors.length; i++) {
              pallete.push(this.convertHexToRGB(this.state.colors[i]));
            }

            if (
              this.state.pictureId === "null" ||
              this.state.checked ||
              this.state.cleanPicture
            ) {
              const pictureListRef = ref(db, "pictures");
              const newPictureRef = push(pictureListRef);

              set(newPictureRef, {
                userUID: userUid,
                pictureName: pictureName,
                pallete: pallete,
                pictureImage: this.canvas.toDataURL("image/jpeg"),
                cleanPicture: false,
              });
            } else {
              set(ref(db, "pictures/" + this.state.pictureId), {
                userUID: userUid,
                pictureName: pictureName,
                pallete: pallete,
                pictureImage: this.canvas.toDataURL("image/jpeg"),
                cleanPicture: false,
              });
            }

            alert("Картинка сохранена в профиль!");
          } else {
            alert("Вы не ввели имя!");
          }
        } else {
          alert("Вы не авторизованы!");
        }
      });
    } else {
      alert("Вы не добавили картинку!");
    }
  }

  getPicture = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ cleanPicture: false });

      this.setState({
        picture: URL.createObjectURL(event.target.files[0]),
      });

      this.img = new Image();
      this.img.src = window.URL.createObjectURL(event.target.files[0]);

      this.img.onload = () => {
        this.setState({ imageLoaded: true });
        this.setState({ colors: this.standartPallete });

        if (this.state.userUID !== "") {
          this.setState({ pictureId: "null" });
          var userUID = this.state.userUID;
          var pictureId = this.state.pictureId;
          var standartPallete = this.standartPallete;
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = function () {
            const db = getDatabase();
            set(ref(db, "picturesForColoring/" + userUID), {
              pictureImage: reader.result,
              pictureId: pictureId,
              pallete: standartPallete,
              cleanPicture: false,
            });
          };
        }
      };
    }
  };

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  async savePicture() {
    if (this.state.imageLoaded) {
      const pictureName = prompt("Введите имя изображения");
      if (pictureName) {
        var dataURL = this.canvas.toDataURL("image/jpeg");
        var link = document.createElement("a");
        link.href = dataURL;
        link.download = pictureName + ".jpg";
        link.click();
      }
    } else {
      alert(translate("imageNotLoaded"));
    }
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
    this.setState({
      picture: {
        name: event.target.value,
      },
    });

    return this.state.picture.name;
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

        var picture = this.canvas.toDataURL("image/jpeg");

        const db = getDatabase();
        set(ref(db, "picturesForColoring/" + this.state.userUID), {
          pictureImage: picture,
          pallete: this.state.colors,
          pictureId: this.state.pictureId,
        });
      }
    }

    const handleChange = () => {
      this.setState({ checked: !this.state.checked });
    };

    return (
      <div className="container">
        <div className="row">
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
            onPallete={this.state.colors}
          />

          <canvas
            className="canvas"
            id="canvas"
            ref={this.myRef}
            onClick={this.handleFilling}
          />

          <div>
            <br />
          </div>

          <div className="delete-save">
            <Button type="text" onClick={this.loadTheLastPalleteAndPicture}>
              {translate("loadLatestImage")}
            </Button>
            <Button type="text" onClick={this.savePictureInMyPicture}>
              {translate("savePictureInMyPicture")}
            </Button>
          </div>

          <div>
            <br />
          </div>

          <div className="delete-save">
            <label />
            <label
              style={{
                display:
                  this.state.pictureId === "null" || this.state.cleanPicture
                    ? "none"
                    : "block",
              }}
            >
              <input
                id="chkNewImage"
                type="checkbox"
                checked={this.state.checked}
                onChange={handleChange}
              />
              <span
                data-tip
                data-for="resizeImage"
                style={{ marginLeft: "190px" }}
              >
                Сохранить, как новую
              </span>
            </label>
          </div>

          <div>
            <br />
            <br />
          </div>

          <div className="delete-save">
            <label className="save-pic">
              <Button type="text" onClick={this.savePicture}>
                {translate("save")}
              </Button>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default ColoringPicture;
