import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
// import ipfs from './ipfs'
import "./App.css";

const IPFS = require('ipfs-http-client')

const ipfs = IPFS({
    host:'ipfs.infura.io',
    port : 5001,
    protocol : 'https'
})


class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    buffer : null,
    ipfsHash : ''
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile = (event) =>{
    event.preventDefault();
    
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend =() => {
      this.setState({
        buffer : Buffer(reader.result)
      })
      console.log("buffer : ", this.state.buffer)
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const results = await ipfs.add(this.state.buffer)
    this.setState({ipfsHash : results[0].hash})
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>IPFS FILE UPLOAD</h1>
        <p>This image is stored on IPFS and Ethereum blockchain</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
