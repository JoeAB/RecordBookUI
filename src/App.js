import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { searchData, getSearchResult } from './contractAccess/MdParcelDataAccess';
import { getTempData } from './dataProvider/tempDataProvider';
import { mintRealEstateNFT } from './contractAccess/RealEstateNftAccess';
import './App.css';


function App() {

  const [streetAddress, setStreetAddress] = useState("");
  const [initialAssessedValue, setInitialAssessedValue] = useState(null);
  const [calledOnce, setCalledOnce] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultProvider, setDefaultProvider] = useState(null);
  const [improvements, setImprovements] = useState(null);
  const [finalValue, setFinalValue] = useState(null);

  function handleAddressChanged(e) {
    setStreetAddress(e.target.value);
  }

  async function handleSearch() {
    let searchResponse = await getSearchResult();
    searchResponse.forEach(element => {
      var splitLabel = element.split(":");
      if(splitLabel[0].toLocaleLowerCase() === streetAddress.toLocaleLowerCase()){
        setInitialAssessedValue(Number(splitLabel[1]));
        mintRealEstateNFT(splitLabel[0], "MD", initialAssessedValue, defaultAccount);
      }
    });
  }

  async function lookup() {
    await handleSearch();
    //value not on chain, need to add it
    if(initialAssessedValue == null){
      await searchData(streetAddress, defaultAccount);
      alert("Value needed to be populated on chain. Please check again in a few minutes and the status should be updated");
    } else {
        const improvementArray = getTempData();
        setImprovements(improvementArray);
        const sumOfValues = improvementArray.reduce((accumulator, currentValue) => {
          // Check if the "Value" property exists in the current object
          if ('Value' in currentValue) {
            // Add the current value to the accumulator
            return accumulator + currentValue.Value;
          } else {
            // If "Value" property is missing, return accumulator unchanged
            return accumulator;
          }
        }, initialAssessedValue);
        setFinalValue(sumOfValues);
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
        setDefaultProvider(provider);
    }
 }

  if(!calledOnce){
    setUpWallet();
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col><p>Below you will be able to enter an address for a property in Maryland and get back information relate dto current valuation based on government valuation and improvements made the past year.</p></Col>
        </Row>
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
        { improvements != null &&  improvements.map((item) =>
                (
                  <Row>
                    <Col>{item.Title}: {item.Value}</Col>
                  </Row>
                ))
        }
        { finalValue != null && 
          <Row>
            <Col>
              Final Assessed Value: {finalValue}
            </Col>
          </Row>
        }
      </Container>
    </div>
  );
}

export default App;