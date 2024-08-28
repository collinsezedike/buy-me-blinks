import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

function MintPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  
  const { publicKey, wallet} = useWallet();
  console.log(publicKey , wallet , useWallet())

  const initializeTransaction = async ()=>{
    try {
      const publicKeyString = publicKey?.toBase58()
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
      <h1>Mint Your Username</h1>
      <p>user wallet address is {publicKey?.toBase58()}</p>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={initializeTransaction}>Mint</button>
      <p>{message}</p>
      <p>This:: {JSON.stringify(useWallet())}</p>
    </div>
  );
}

export default MintPage;
