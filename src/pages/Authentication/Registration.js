import React, { useRef, useState } from "react";
import { useAuth, signup } from "../../firebase";
import "../../styles/authentification.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import translate from "../../i18n/translate";

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
      alert(localStorage.getItem("language") === "ru-ru" ? "Успешная регистрация" : "Successful registration");
      history.push("/");
    } catch {
      alert(localStorage.getItem("language") === "ru-ru" ? "Такой аккаунт уже существует или неправильно введена почта!" : "Such an account already exists or the mail is entered incorrectly!");
    }
    setLoading(false);
  }

  return (
    <div className="body">
      <div className="main">
        <div className="circle"></div>
        <div className="register-form-container">
          <form action="">
            <h1 className="form-title">{translate("registration")}</h1>
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
                onClick={handleSignup}
              >
                {translate("register")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
