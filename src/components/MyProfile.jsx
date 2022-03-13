import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useAuth } from "../firebase";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useHistory } from "react-router-dom";

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

const Title1 = styled.h1`
  font-size: 16px;
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

const MyProfile = () => {
  const auth = getAuth();
  const history = useHistory();
  const currentUser = useAuth();

  if (currentUser === null) {
    history.push("/authorization");
  }

  const user = auth.currentUser;

  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleChange(event) {
    setLastPassword(event.target.value);
  }

  function handleChange1(event) {
    setNewPassword(event.target.value);
  }

  const resetPassword = () => {
    if (lastPassword !== "" || newPassword !== "") {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        lastPassword
      );

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              alert("Успешная смена пароля");
              setLastPassword("");
              setNewPassword("");
            })
            .catch((error) => {
              alert(error.message);
            });
        })
        .catch((error) => {
          alert("Не верный старый пароль");
        });
    } else {
      alert("Не все поля заполнены");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Мой аккаунт</Title>
        <Title1>Почта: {user?.email}</Title1>
        <Title>Смена пароля</Title>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Agreement>
            Для смены пароля необходимо ввести старый пароль
          </Agreement>
          <div className="form-fields">
            <div className="form-field">
              <input
                style={{ minWidth: "540px" }}
                type="password"
                placeholder="Старый пароль"
                required
                minlength="8"
                maxlength="128"
                onChange={handleChange}
                value={lastPassword}
              />
            </div>
            <div className="form-field">
              <input
                style={{ minWidth: "540px" }}
                type="password"
                placeholder="Новый пароль"
                required
                minlength="8"
                maxlength="128"
                onChange={handleChange1}
                value={newPassword}
              />
            </div>
          </div>
          <Button onClick={() => resetPassword()}>Обновить данные</Button>
        </div>
      </Wrapper>
    </Container>
  );
};

export default MyProfile;
