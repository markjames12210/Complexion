import Footer from "./components/Footer";
import { WalletProvider } from "./context/WalletContext";
import NavBar from "./components/Navbar/NavBar";
import Core from "./components/Core/Core";
import Round from "./components/Round";
import MyAccount from "./components/MyAccount";
import TxUi from "./components/TxUi/TxUi";

function App() {
  return (
    <div className="main">
      <WalletProvider>
        <TxUi/>
        <div className="relative w-full">
          <NavBar />
          <MyAccount/>
          <Round/>
          <Core/>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
