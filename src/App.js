import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import './App.css';

function App() {

  const [streetAddress, setStreetAddress] = useState('');

  function handleAddressChanged(e) {
    setStreetAddress(e.target.value);
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>Eneter Street Address of Home</Col>
          <Col>
            <input value={streetAddress}
            onChange={handleAddressChanged}></input>
          </Col>
        </Row>
        <Row>
          <Button>
            Search
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default App;
