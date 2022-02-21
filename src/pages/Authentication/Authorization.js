import React, { useRef, useState } from "react";
import { useAuth, login } from "../../firebase";
import "../../styles/authentification.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

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
      alert("Успешная авторизация");
      history.push("/home");
    } catch {
      alert("Проверьте введенные данные!");
    }
    setLoading(false);
  }

  return (
    <div class="body">
      <div class="main">
        <div class="circle"></div>
        <div class="register-form-container">
          <form action="">
            <h1 class="form-title">Авторизация</h1>
            <div class="form-fields">
              <div class="form-field">
                <input
                  type="email"
                  placeholder="Почта"
                  required
                  ref={emailRef}
                />
              </div>
              <div class="form-field">
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
            <div class="form-buttons">
              <Button
                class="button"
                disabled={loading || currentUser != null}
                onClick={handleLogin}
              >
                Авторизация
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
