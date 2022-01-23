import './App.css';
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers'
import World from './artifacts/contracts/World.sol/World.json'
import Box from './PerlinNoise';

// Update with the contract address logged out to the CLI when it was deployed 
const worldAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

const provider = new ethers.providers.Web3Provider(window.ethereum)

function App() {
  // store seed in local state
  const [seed, setSeedValue] = useState()
  const [parcelX, setParcelX] = useState()
  const [parcelY, setParcelY] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current seed value
  async function fetchSeed() {
    if (typeof window.ethereum !== 'undefined') {
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
    const signer = provider.getSigner()
    const contract = new ethers.Contract(worldAddress, World.abi, signer)
    if (!seed) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const transaction = await contract.setSeed(seed)
      await transaction.wait()
      fetchSeed()
    }
  }

  async function mintParcel() {
    const signer = provider.getSigner()
    const contract = new ethers.Contract(worldAddress, World.abi, signer)    
    if (typeof window.ethereum !== 'undefined') {
      const nf = (await contract.noise(parseInt(parcelX),parseInt(parcelY))).toNumber() / 65536;
      console.log('nf: ', nf)
      await requestAccount()
      const options = {value: ethers.utils.parseEther("1.0")}
      const transaction = await contract.mintParcel(parseInt(parcelX),parseInt(parcelY), options)
      await transaction.wait()
    }    
  }

  const canvasRef = useRef(null);

  async function generateNoiseMatrix() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 20;
    canvas.height = 20;

    const scale = 2**13;
    const offsetx = 0;
    const offsety = 0;

    const signer = provider.getSigner()
    const contract = new ethers.Contract(worldAddress, World.abi, signer)    
    if (typeof window.ethereum !== 'undefined') {
      ctx.clearRect(0,0,canvas.width,canvas.height);

      var r = [];
      for (let i = 0; i<canvas.width; i++){
        let t = [];
        console.log(i)
        for (let j = 0; j<canvas.height; j++) {
          let nf = (await contract.noise(scale*i+offsetx,scale*j+offsety)).toNumber() / 65536;
          let nf2 = 0.5*((await contract.noise(2*scale*i+offsetx,2*scale*j+offsety)).toNumber() / 65536);
          let nf3 = 0.25*((await contract.noise(4*scale*i+offsetx,4*scale*j+offsety)).toNumber() / 65536);
          let e = (nf+nf2+nf3)/1.75
          let v = ((e*Math.sqrt(2)+1)/2)*255 // range of perlin noise is [-sqrt(N/4),sqrt(N/4)], convert to [0,1]
          var color = "rgb("+v+","+v+","+v+")";
          ctx.fillStyle = color;
          ctx.fillRect(i,j,1,1);
          t.push(nf)
        }
        r.push(t)
      }
      console.log('result: ', r)
    }        
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchSeed}>Fetch seed</button>
        <button onClick={setSeed}>Set seed</button>
        <input onChange={e => setSeedValue(e.target.value)} placeholder="Set seed" />
        <button onClick={mintParcel}>Mint parcel</button>
        <input onChange={e => setParcelX(e.target.value)} placeholder="Parcel x coord" />
        <input onChange={e => setParcelY(e.target.value)} placeholder="Parcel y coord" />
        <button onClick={generateNoiseMatrix}>Generate noise solidity</button>
        <canvas id="canvas" ref={canvasRef} style={{backgroundColor:'white'}}></canvas>
        <Box />
      </header>
    </div>
  );
}

export default App;
