import React, { useEffect, useState } from "react";
import classNames from "classnames";
import "../styles/my-image.css";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { useAuth } from "../firebase";

function Myimage() {
  const currentUser = useAuth();

  const availableSizes = [50, 65, 80];

  const [activeSize, setActiveSize] = useState(0);

  const onSelectSize = (index) => {
    setActiveSize(index);
  };

  const [picturesList, setPicturesList] = useState();

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
    var pictureName = prompt("Введите новое имя");

    if (pictureName) {
      const db = getDatabase();

      const pictureData = {
        userUID: picture.userUID,
        pictureName: pictureName,
        pallete: picture.pallete,
        pictureImage: picture.pictureImage,
      };

      const updates = {};
      updates["/pictures/" + picture.id] = pictureData;

      return update(ref(db), updates);
    }
  }

  function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function ImageItem({ picture }) {
    return (
      <div class="pizza-block">
        <h4 class="pizza-block__title">{picture.pictureName}</h4>
        <button onClick={() => removePicture(picture.id)}>Удалить</button>
        <button onClick={() => editPicture(picture)}>Изменить</button>
        <img
          class="pizza-block__image"
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
        <div class="pizza-block__selector">
          <ul>
            <a1>Размер холста(диагональ)</a1>
          </ul>
          <ul>
            {availableSizes.map((size, index) => (
              <li
                key={size}
                onClick={() => onSelectSize(index)}
                className={classNames({
                  active: activeSize === index,
                  disabled: !availableSizes.includes(size),
                })}
              >
                {size} см.
              </li>
            ))}
          </ul>
        </div>
        <div class="pizza-block__bottom">
          <div class="pizza-block__price">
            {activeSize === 0
              ? "20 BYN"
              : activeSize === 1
              ? "25 BYN"
              : "30 BYN"}
          </div>
          <button class="button1 button--outline button--add">
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
            <span>Добавить в корзину</span>
          </button>
          <br />
          <br />
          <button class="button1 button--outline button--add">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
            <span style={{ marginRight: "13px" }}>Раскрасить</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="wrapper">
      <div class="content">
        <div class="container">
          <h2 class="content__title">Мои картины</h2>
          <div class="content__items">
            {picturesList ? (
              picturesList.map((picture, index) => {
                return <ImageItem picture={picture} key={index} />;
              })
            ) : (
              <h1>Картины загружаются или не найдены</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myimage;
