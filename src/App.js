import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { searchData, getSearchResult } from './contractAccess/MdParcelDataAccess';
import './App.css';


function App() {

  const [streetAddress, setStreetAddress] = useState("");
  const [initialAssessedValue, setInitialAssessedValue] = useState(null);
  const [calledOnce, setCalledOnce] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);

  function handleAddressChanged(e) {
    setStreetAddress(e.target.value);
  }

  async function handleSearch() {
    let searchResponse = await getSearchResult();
    searchResponse.forEach(element => {
      var splitLabel = element.split(":");
      if(splitLabel[0].toLocaleLowerCase() === streetAddress.toLocaleLowerCase()){
        setInitialAssessedValue(Number(splitLabel[1]));
      }
    });
  }

  async function lookup() {
    await handleSearch();
    //value not on chain, need to add it
    if(initialAssessedValue){
      await searchData(streetAddress, defaultAccount);
      alert("Value needed to be populated on chain. Please check again in a few minutes and the status should be updated");
    }
  }

  async function setUpWallet(){
    setCalledOnce(true);
    const { ethers } = require("ethers");
    let signer = null;

    let provider;
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
    
    } else {
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner();
        setDefaultAccount(signer);
    }
 }

  if(!calledOnce){
    setUpWallet();
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
          <Button onClick={lookup}>
            Search
          </Button>
        </Row>
        <Row>
          { initialAssessedValue != null && 
            <Col>
              Initial Assessed Value: {initialAssessedValue}
            </Col>
          }
        </Row>
      </Container>
    </div>
  );
}

export default App;