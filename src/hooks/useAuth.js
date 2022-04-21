import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { createContext, useContext, useMemo } from "react"

const AuthContext = createContext({
  account: '',
  chainId: undefined,
  connect: () => {},
  disconnect: () => {},
});

const ALL_CHAIN_IDS = [
  1, // MAINNET
  10, // Optimism
  56, // Binance Smart Chain
  137, // Polygon
  250, // Fantom
  42161, // Arbitrum
  43114, // Avalanche
  250, //fantom
  1284, // Moonbeam
  2001, // Milkomeda
];

const injected = new InjectedConnector({
  supportedChainIds: ALL_CHAIN_IDS,
});

export const AuthProvider = ({ children }) => {
  const { activate, deactivate, account, chainId } = useWeb3React();

  const memoedValue = useMemo(
    () => {
      const connect = async () => {
        try {
          await activate(injected);
        } catch (e) {
          console.log('Connection Error:', e);
        }
      };

      const disconnect = () => {
        try {
          deactivate();
        } catch (e) {
          console.log('Connection Error:', e);
        }
      };

      return { connect, disconnect, account, chainId }
    },
    [activate, deactivate, account, chainId]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}