import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-left: 150px;
`;

const ReestablishPassword = () => {
  const auth = getAuth();

  const [email, setEmail] = useState();

  function handleChange(event) {
    setEmail(event.target.value);
  }

  const reestablishPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(localStorage.getItem("language") === "ru-ru" ? "Сообщение с восстановлением отправлено на почту" : "Recovery message sent to email");
      })
      .catch((error) => {
        alert(localStorage.getItem("language") === "ru-ru" ? "Указанной почты не найдено" : "The specified mail was not found");
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Восстановление пароля</Title>
        <div style={{  display: "flex", flexWrap: "wrap"}}>
          <Agreement>
            Для восстановления пароля введите адрес электронной почты.
          </Agreement>
          <div className="form-fields">
            <div className="form-field">
              <input
                style={{ minWidth: "540px" }}
                type="email"
                placeholder="Почта"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <Button onClick={reestablishPassword}>
            Восстановить пароль
          </Button>
        </div>
      </Wrapper>
    </Container>
  );
};

export default ReestablishPassword;
