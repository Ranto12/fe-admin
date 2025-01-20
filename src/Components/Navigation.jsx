import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import '../App.css'

const Navigation = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Admin Oak Galery</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Navigation;
