import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useAuth } from "../firebase";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useHistory } from "react-router-dom";
import translate from "../i18n/translate";

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
  margin-left: 25px;
  margin-right: 28px;
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
              alert(localStorage.getItem("language") === "ru-ru" ? "Успешная смена пароля" : "Successful password change");
              setLastPassword("");
              setNewPassword("");
            })
            .catch(() => {
              alert(localStorage.getItem("language") === "ru-ru" ? "Ошибка" : "Error");
            });
        })
        .catch((error) => {
          alert(localStorage.getItem("language") === "ru-ru" ? "Не верный старый пароль" : "Wrong old password");
        });
    } else {
      alert(localStorage.getItem("language") === "ru-ru" ? "Не все поля заполнены" : "Not all fields are filled");
    }
  };

  const reestablishPassword = () => {
    sendPasswordResetEmail(auth, currentUser.email)
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
        <Title>{translate("myAccount")}</Title>
        <Title1>{translate("mail")}: {user?.email}</Title1>
        <Title>{translate("editPassword")}</Title>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <Agreement>
            {translate("editPassText")}
          </Agreement>
          <div className="form-fields">
            <div className="form-field">
              <input
                style={{ minWidth: "540px" }}
                type="password"
                placeholder={localStorage.getItem("language") === "ru-ru" ? "Старый пароль" : "Last password"}
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
                placeholder={localStorage.getItem("language") === "ru-ru" ? "Новый пароль" : "New password"}
                required
                minlength="8"
                maxlength="128"
                onChange={handleChange1}
                value={newPassword}
              />
            </div>
          </div>
          <Button onClick={() => resetPassword()}>{translate("updatePassword")}</Button>
          <Button onClick={() => reestablishPassword()}>{translate("restorePassword")}</Button>
        </div>
      </Wrapper>
    </Container>
  );
};

export default MyProfile;
