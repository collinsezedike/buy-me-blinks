import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

function MintPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  
  const wallet = useWallet();
  console.log('wallet is ', { wallet : wallet.wallet });

  const initializeTransaction = async ()=>{
      try {
      const response = await fetch(`/api/mint?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          account: wallet
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
  };

  return (
    <div>
      <h1>Mint Your Username</h1>
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
