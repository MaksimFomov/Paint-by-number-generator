import React, { useRef, useState } from "react";
import { useAuth, signup } from "../../firebase";
import "../../styles/authentification.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Registration = () => {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  async function handleSignup() {
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
      alert("Успешная регистрация");
      history.push("/home");
    } catch {
      alert("Такой аккаунт уже существует или неправильно введена почта!");
    }
    setLoading(false);
  }

  return (
    <div class="body">
      <div class="main">
        <div class="circle"></div>
        <div class="register-form-container">
          <form action="">
            <h1 class="form-title">Регистрация</h1>
            <div class="form-fields">
              <div class="form-field">
                <input
                  type="text"
                  placeholder="Имя"
                  required
                  pattern="[а-яА-Я]+"
                  title="Имя может содержать только буквы."
                />
              </div>
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
                onClick={handleSignup}
              >
                Регистрация
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
