import React, {useState} from 'react';
import { Nav, Form, Button, Modal } from 'react-bootstrap';

export default function Header() {

    const [show,setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [sho,setSho] = useState(false);

    const handleClos = () => setSho(false);
    const handleSho = () => setSho(true);
    return (
        <>
                    
                    <Nav className="mr-auto">
                        <Button variant="outline-primary" className="me-5" onClick={handleShow}>Sign in</Button>
                        <Button variant="outline-primary" className="me-5" onClick={handleSho}>Sign up</Button>
                    </Nav>
                
    
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Вход</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
  <Form.Group className="mb-3" controlId="login">
    <Form.Label>Логин</Form.Label>
    <Form.Control type="email" placeholder="Введите login" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Пароль</Form.Label>
    <Form.Control type="password" placeholder="Введите пароль" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Запомнить меня" />
  </Form.Group>
  <Button variant="info" type="submit">
    Войти
  </Button>
</Form>
</Modal.Body>
</Modal>

<Modal show={sho} onHide={handleClos}>
        <Modal.Header closeButton>
            <Modal.Title>Регистрация</Modal.Title>
        </Modal.Header>
            <Modal.Body>
    <Form>
    <Form.Group className="mb-3" controlId="Login">
    <Form.Label>Логин</Form.Label>
    <Form.Control type="email" placeholder="Придумайте логин" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Email адрес</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
    <Form.Text className="text-muted">
    Мы никогда никому не передадим вашу электронную почту.
    </Form.Text>
  </Form.Group>

  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Пароль</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Запомнить меня" />
  </Form.Group>
  <Button variant="info" type="submit">
    Зарегистрироваться
  </Button>
</Form>
</Modal.Body>
    </Modal>
    </>
);
}