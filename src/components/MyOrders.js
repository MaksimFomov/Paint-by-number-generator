import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/my-image.css";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
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

    const pictureRef1 = ref(db, "order");
    onValue(pictureRef1, (snapshot) => {
      const pictures1 = snapshot.val();
      const picturesList1 = [];
      for (let id in pictures1) {
        if (pictures1[id].userUID === currentUser?.uid) {
          picturesList1.push({ id, ...pictures1[id] });
        }
      }

      if(picturesList1.length !== 0){
        const pictureListRef = ref(db, "orders");

        for (let i = 0; i < picturesList1.length; i++) {
          const newPictureRef = push(pictureListRef);
          set(newPictureRef, {
            userUID: currentUser.uid,
            pictureName: picturesList1[i].pictureName,
            pallete: picturesList1[i].pallete,
            pictureImage: picturesList1[i].pictureImage,
            size: picturesList1[i].size,
            quantity: picturesList1[i].quantity,
            price: picturesList1[i].price,
            orderDate: picturesList1[i].orderDate,
          });
        }

        set(pictureRef1, null);
        const pictureRef2 = ref(db, "cart");
        set(pictureRef2, null);
      }
    });

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
          Размер товара:{" "}
          {picture.size === 0 ? 50 : picture.size === 1 ? 65 : 80} см.
        </h6>
        <h6>
          Дата заказа: {picture.orderDate}
        </h6>
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
              <h1>{translate("loadOrders")}</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
