import React, { useEffect, useState } from "react";
import { FiMinusCircle } from "@react-icons/all-files/fi/FiMinusCircle";
import { FiPlusCircle } from "@react-icons/all-files/fi/FiPlusCircle";
import styled from "styled-components";
import { mobile } from "../responsive";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { useAuth } from "../firebase";
import { useHistory } from "react-router-dom";
import translate from "../i18n/translate";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  width: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 40vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const ButtonDelete = styled.button`
  width: 100%;
  padding: 10px;
  background-color: white;
  color: black;
  font-weight: 500;
  border: 4px solid black;
  border-radius: 25px;
`;

const Cart = () => {
  const currentUser = useAuth();
  const history = useHistory();

  if (currentUser === null) {
    history.push("/authorization");
  }

  const [picturesList, setPicturesList] = useState();

  const [totalPrice, setTotalPrice] = useState();
  const [quantityPictures, setQuantityPictures] = useState();

  useEffect(() => {
    const db = getDatabase();
    const pictureRef = ref(db, "cart");

    onValue(pictureRef, (snapshot) => {
      const pictures = snapshot.val();
      const picturesList = [];
      const totalPrice = [];
      for (let id in pictures) {
        if (pictures[id].userUID === currentUser?.uid) {
          picturesList.push({ id, ...pictures[id] });

          totalPrice.push(pictures[id].price * pictures[id].quantity);
        }
      }
      setPicturesList(picturesList);

      let price = totalPrice.reduce(function (sum, elem) {
        return sum + elem;
      }, 0);
      setTotalPrice(price);
      localStorage.setItem("totalPrice", price);

      setQuantityPictures(totalPrice.length);
    });
  }, [currentUser?.uid]);

  function removePicture(index) {
    const db = getDatabase();
    const pictureRef = ref(db, "cart/" + index);
    set(pictureRef, null);
  }

  function decreaseInQuantity(picture) {
    const db = getDatabase();

    const pictureData = {
      userUID: picture.userUID,
      pictureName: picture.pictureName,
      pallete: picture.pallete,
      pictureImage: picture.pictureImage,
      size: picture.size,
      quantity: picture.quantity === 1 ? picture.quantity : --picture.quantity,
      price: picture.price,
    };

    const updates = {};
    updates["/cart/" + picture.id] = pictureData;

    return update(ref(db), updates);
  }

  function increaseInQuantity(picture) {
    setTotalPrice(totalPrice + picture.price);

    const db = getDatabase();

    const pictureData = {
      userUID: picture.userUID,
      pictureName: picture.pictureName,
      pallete: picture.pallete,
      pictureImage: picture.pictureImage,
      size: picture.size,
      quantity: ++picture.quantity,
      price: picture.price,
    };

    const updates = {};
    updates["/cart/" + picture.id] = pictureData;

    return update(ref(db), updates);
  }

  return (
    <Container>
      <Wrapper>
        <Title>{translate("cart")}</Title>
        <Bottom>
          <Info>
            {picturesList ? (
              picturesList.map((picture) => {
                return (
                  <div>
                    <Product>
                      <ProductDetail>
                        <Image src={picture.pictureImage} />
                        <Details>
                          <ProductName>
                            <b>{translate("name")}:</b> {picture.pictureName}
                          </ProductName>
                          <br />
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {picture.pallete.map((colour) => {
                              return <ProductColor color={colour} />;
                            })}
                          </div>
                          <br />
                          <ProductSize>
                            <b>{translate("size")}:</b>{" "}
                            {picture.size === 0
                              ? 50
                              : picture.size === 1
                              ? 65
                              : 80}{" "}
                            {translate("sm")}.
                          </ProductSize>
                        </Details>
                      </ProductDetail>
                      <PriceDetail>
                        <ProductAmountContainer>
                          <ButtonDelete
                            onClick={() => removePicture(picture.id)}
                          >
                            {translate("delete")}
                          </ButtonDelete>
                        </ProductAmountContainer>
                        <ProductAmountContainer>
                          <FiMinusCircle
                            onClick={() => decreaseInQuantity(picture)}
                          />
                          <ProductAmount>{picture.quantity}</ProductAmount>
                          <FiPlusCircle
                            onClick={() => increaseInQuantity(picture)}
                          />
                        </ProductAmountContainer>
                        <ProductPrice>
                          {picture.price * picture.quantity} BYN
                        </ProductPrice>
                      </PriceDetail>
                    </Product>
                    <br />
                    <Hr />
                    <br />
                  </div>
                );
              })
            ) : (
              <h1>{translate("cartLoading")}</h1>
            )}
          </Info>
          <Summary>
            <SummaryTitle>{translate("order")}</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>{translate("quantityProduct")}</SummaryItemText>
              <SummaryItemPrice>{quantityPictures}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>{translate("totalPrice")}</SummaryItemText>
              <SummaryItemPrice>{totalPrice} BYN</SummaryItemPrice>
            </SummaryItem>
            <Button
              onClick={() =>
                totalPrice !== 0
                  ? history.push("/checkout")
                  : alert(
                      localStorage.getItem("language") === "ru-ru"
                        ? "Корзина пустая"
                        : "Cart is empty"
                    )
              }
            >
              Оплатить
            </Button>
          </Summary>
        </Bottom>
      </Wrapper>
    </Container>
  );
};

export default Cart;
