import React, { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import NavBar from '@/components/navbar'
import Header from '@/components/header'
import styles from '@/styles/mint.module.css'

function MintPage() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  
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
      <Header />
      <NavBar />
      <div className={styles.mint_container}>
        <img src="/mint-img.png" alt="" />
        <div>
          <h1>Hi, what shall we call you?</h1>
          <input
            type="text"
            placeholder="Enter username"
            className={styles.username_input}
            value={username}
            onChange={(e) =>{
              setUsername(e.target.value)
              setMessage('')
            }
          }
          />
          <button onClick={initializeTransaction} className={styles.mint_btn}>Start Minting</button>
          <h1 style={{textTransform:'capitalize'}}>{message}</h1>
        </div>
      </div>
    </div>
  );
}

export default MintPage;
