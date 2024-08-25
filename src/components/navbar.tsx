import { FaTwitter } from "react-icons/fa6"
import styles from '@/styles/Navbar.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
function NavBar(){
  return (
    <nav>
      <h3>BuyMeBlinks</h3>
      <div className={styles.nav_discord_icon}>
        <a href='https://x.com/buymeblinks' target='_blank' rel='noopener noreferrer'>
          <FaTwitter size={25} color={'#001031'} />
        </a>
          <WalletMultiButton 
            style={{
              backgroundColor:'#001031', borderRadius:50, paddingTop:8, 
              paddingRight:16, paddingBottom:8, paddingLeft:16,
            }}
          />
      </div>
    </nav>
  )
}

export default NavBar
 
