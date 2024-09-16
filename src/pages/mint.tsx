import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import NavBar from '@/components/navbar';

function MintPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  
  const { publicKey } = useWallet()
  const publicKeyString = publicKey?.toBase58()

  const initializeTransaction = async ()=>{
    setMessage('')
    if(!publicKey){
      setMessage('please connect you wallet to connect continue')
      return
    }
    try {
      const response = await fetch(`/api/mint?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          account: publicKeyString
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Transaction initialized! Follow this link: ${data.link}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <NavBar />
      <h1>Mint Your Username</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) =>{
          setUsername(e.target.value)
          setMessage('')
        }
      }
        />
      <button onClick={initializeTransaction}>Mint</button>
      <h1>{message}</h1>
        <p>username : {username}</p>
        <p>user wallet address : {publicKeyString}</p>
    </div>
  );
}

export default MintPage;
