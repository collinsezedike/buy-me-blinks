import { Montserrat } from "next/font/google"
import Header from "@/components/header"
import Wallet from "@/components/wallet"

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <div 
    className={montserrat.className}
    >
      <Header />
      <Wallet />
    </div>
  );
}
