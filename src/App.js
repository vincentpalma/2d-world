import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import World from './artifacts/contracts/World.sol/World.json'

// Update with the contract address logged out to the CLI when it was deployed 
const worldAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
  // store seed in local state
  const [seed, setSeedValue] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current seed value
  async function fetchSeed() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(worldAddress, World.abi, provider)
      try {
        const data = await contract.getSeed()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setSeed() {
    if (!seed) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(worldAddress, World.abi, signer)
      const transaction = await contract.setSeed(seed)
      await transaction.wait()
      fetchSeed()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchSeed}>Fetch seed</button>
        <button onClick={setSeed}>Set seed</button>
        <input onChange={e => setSeedValue(e.target.value)} placeholder="Set seed" />
      </header>
    </div>
  );
}

export default App;
