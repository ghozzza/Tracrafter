import { mockUsdc, mockWbtc, mockWeth } from "./addresses";

export interface TokenOption {
  name: string;
  address: string;
  logo: string;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  {
    name: "WETH",
    address: mockWeth,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    name: "WBTC",
    address: mockWbtc,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "USDC",
    address: mockUsdc,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/logo.png",
  },
];
