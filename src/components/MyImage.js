import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import "../styles/my-image.css";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  push,
} from "firebase/database";
import { useAuth } from "../firebase";
import translate from "../i18n/translate";

function Myimage() {
  const currentUser = useAuth();

  const history = useHistory();

  if (currentUser === null) {
    history.push("/authorization");
  }

  const availableSizes = [50, 65, 80];

  const [picturesList, setPicturesList] = useState();

  const onSelectSize = (picture, index) => {
    const db = getDatabase();

    const pictureData = {
      userUID: picture.userUID,
      pictureName: picture.pictureName,
      pallete: picture.pallete,
      pictureImage: picture.pictureImage,
      cleanPicture: picture.cleanPicture,
      activeSize: index,
    };

    const updates = {};
    updates["/pictures/" + picture.id] = pictureData;

    return update(ref(db), updates);
  };

  function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  useEffect(() => {
    const db = getDatabase();
    const pictureRef = ref(db, "pictures");
    onValue(pictureRef, (snapshot) => {
      const pictures = snapshot.val();
      const picturesList = [];
      for (let id in pictures) {
        if (pictures[id].userUID === currentUser?.uid) {
          picturesList.push({ id, ...pictures[id] });
        }
      }
      setPicturesList(picturesList);
    });
  }, [currentUser?.uid]);

  function removePicture(index) {
    const db = getDatabase();
    const pictureRef = ref(db, "pictures/" + index);
    set(pictureRef, null);
  }

  function editPicture(picture) {
    var pictureName = prompt(
      localStorage.getItem("language") === "ru-ru"
        ? "Введите новое имя"
        : "Enter new name"
    );

    if (pictureName) {
      const db = getDatabase();

      const pictureData = {
        userUID: picture.userUID,
        pictureName: pictureName,
        pallete: picture.pallete,
        pictureImage: picture.pictureImage,
        cleanPicture: picture.cleanPicture,
        activeSize: picture.activeSize,
      };

      const updates = {};
      updates["/pictures/" + picture.id] = pictureData;

      return update(ref(db), updates);
    }
  }

  function colorizePicture(picture) {
    for (let i = 0; i < picture.pallete.length; i++) {
      picture.pallete[i] = rgb2hex(
        picture.pallete[i][0],
        picture.pallete[i][1],
        picture.pallete[i][2]
      );
    }

    const db = getDatabase();
    set(ref(db, "picturesForColoring/" + picture.userUID), {
      pictureId: picture.id,
      pictureImage: picture.pictureImage,
      pallete: picture.pallete,
      cleanPicture: picture.cleanPicture,
    });

    history.push("/сoloring-a-picture");
  }

  function addToCart(picture) {
    const pallete = [];

    // eslint-disable-next-line array-callback-return
    picture.pallete.map((colour) => {
      pallete.push(rgb2hex(colour[0], colour[1], colour[2]));
    });

    const db = getDatabase();
    const pictureListRef = ref(db, "cart");
    const newPictureRef = push(pictureListRef);
    set(newPictureRef, {
      userUID: picture.userUID,
      pictureName: picture.pictureName,
      pictureImage: picture.pictureImage,
      pallete: pallete,
      size: picture.activeSize,
      quantity: 1,
      price: picture.activeSize === 0 ? 20 : picture.activeSize === 1 ? 25 : 30,
    });

    alert(
      localStorage.getItem("language") === "ru-ru"
        ? "Картина добавлена в корзину"
        : "Picture adding to cart"
    );
  }

  function ImageItem({ picture, id }) {
    return (
      <div className="pizza-block">
        <h4 className="pizza-block__title">{picture.pictureName}</h4>
        <button
          style={{ marginRight: "30px" }}
          onClick={() => removePicture(picture.id)}
        >
          {translate("delete")}
        </button>
        <button onClick={() => editPicture(picture)}>
          {translate("edit")}
        </button>
        <img
          className="pizza-block__image"
          src={picture.pictureImage}
          alt="Pizza"
        />
        <div className="swatchHolder">
          <ul>
            {picture.pallete.map((colour, index) => {
              return (
                <li
                  key={colour}
                  style={{
                    backgroundColor: rgb2hex(colour[0], colour[1], colour[2]),
                  }}
                >
                  {index}
                </li>
              );
            })}
          </ul>
        </div>
        <br />
        <div
          style={{ display: picture.cleanPicture ? "brhbfhr" : "none" }}
          className="pizza-block__selector"
        >
          <ul>
            <a1>{translate("sizes")}</a1>
          </ul>
          <ul>
            {availableSizes.map((size, index) => (
              <li
                key={size}
                onClick={() => onSelectSize(picture, index)}
                className={classNames({
                  active:
                    picturesList[id].activeSize === index &&
                    picture.id === picturesList[id].id,
                  disabled: !availableSizes.includes(size),
                })}
              >
                {size} см.
              </li>
            ))}
          </ul>
        </div>
        <div className="pizza-block__bottom">
          <div
            style={{ display: picture.cleanPicture ? "brhbfhr" : "none" }}
            className="pizza-block__price"
          >
            {picture.activeSize === 0
              ? "20 BYN"
              : picture.activeSize === 1
              ? "25 BYN"
              : "30 BYN"}
          </div>
          <button
            style={{ display: picture.cleanPicture ? "brhbfhr" : "none" }}
            className="button1 button--outline button--add"
            onClick={() => addToCart(picture)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>{translate("addToCart")}</span>
          </button>
          <br style={{ display: picture.cleanPicture ? "brhbfhr" : "none" }} />
          <br style={{ display: picture.cleanPicture ? "brhbfhr" : "none" }} />
          <button
            className="button1 button--outline button--add"
            onClick={() => colorizePicture(picture)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
            <span style={{ marginRight: "13px" }}>{translate("coloring")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="content">
        <div className="container">
          <h2 className="content__title">{translate("myPictures")}</h2>
          <div className="content__items">
            {picturesList ? (
              picturesList.map((picture, index) => {
                return <ImageItem picture={picture} id={index} />;
              })
            ) : (
              <h1>{translate("loadPictures")}</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myimage;
