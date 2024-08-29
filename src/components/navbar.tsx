import { FaTwitter } from "react-icons/fa6"
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from "@solana/wallet-adapter-react"

function NavBar(){
 
  const walletInfo = useWallet()
  return (
    <nav>
      <Link href={'/'} style={{color:'#001031'}}>
      <h3>BuyMeBlinks</h3>
      </Link>
      <div className={styles.nav_link}>
        <a href='https://x.com/buymeblinks' target='_blank' rel='noopener noreferrer'>
          <FaTwitter className={styles.discord_icon} />
        </a>
          <WalletMultiButton 
            style={{
              backgroundColor:'#001031', borderRadius:50, paddingTop:20, 
              paddingRight:30, paddingBottom:20, paddingLeft:30
            }}
          />
      </div>
    </nav>
  )
}

export default NavBar