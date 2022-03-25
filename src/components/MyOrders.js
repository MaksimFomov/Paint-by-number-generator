import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/my-image.css";
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuth } from "../firebase";
import translate from "../i18n/translate";

function MyOrders() {
  const currentUser = useAuth();

  const history = useHistory();

  if (currentUser === null) {
    history.push("/authorization");
  }

  const [picturesList, setPicturesList] = useState();


  useEffect(() => {
    const db = getDatabase();
    const pictureRef = ref(db, "orders");
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

  function ImageItem({ picture, id }) {
    return (
      <div className="pizza-block">
        <h4 className="pizza-block__title">{picture.pictureName}</h4>
        <img
          className="pizza-block__image"
          src={picture.pictureImage}
          alt="Pizza"
        />
        <br />
        <br />
        <h6>
          ID заказа: {picture.id}
        </h6>
        <h6>
          Цена заказа: {picture.price} byn
        </h6>
        <h6>
          Количество товаров: {picture.quantity}
        </h6>
        <h6>
          Размер товаров:{" "}
          {picture.size === 0 ? 50 : picture.size === 1 ? 65 : 80} см.
        </h6>
        <h6>
          Дата заказа: {picture.orderDate}
        </h6>
        <div className="swatchHolder">
          <ul>
            {picture.pallete.map((colour, index) => {
              return (
                <li
                  key={colour}
                  style={{
                    backgroundColor: colour,
                  }}
                >
                  {index}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="content">
        <div className="container">
          <h2 className="content__title">{translate("myOrders")}</h2>
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

export default MyOrders;
