import React, { useRef, useState } from "react";
import { useAuth, login } from "../../firebase";
import "../../styles/authentification.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import translate from "../../i18n/translate";

const Authorization = () => {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      alert(localStorage.getItem("language") === "ru-ru" ? "Успешная авторизация" : "Successful authorization");
      history.push("/");
    } catch {
      alert(localStorage.getItem("language") === "ru-ru" ? "Проверьте введенные данные!" : "Check the entered data!");
    }
    setLoading(false);
  }

  return (
    <div className="body">
      <div className="main">
        <div className="circle"></div>
        <div className="register-form-container">
          <form action="">
            <h1 className="form-title">{translate("authorization")}</h1>
            <div className="form-fields">
              <div className="form-field">
                <input
                  type="email"
                  placeholder="Почта"
                  required
                  ref={emailRef}
                />
              </div>
              <div className="form-field">
                <input
                  type="password"
                  placeholder="Пароль"
                  required
                  minlength="8"
                  maxlength="128"
                  ref={passwordRef}
                />
              </div>
            </div>
            <div className="form-buttons">
              <Button
                className="button"
                disabled={loading || currentUser != null}
                onClick={handleLogin}
              >
                {translate("logIn")}
              </Button>
              <p>.</p>
              <Button
                className="button"
                onClick={() => history.push("/reset-password")}
              >
                {translate("restorePassword")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
