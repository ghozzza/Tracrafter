export interface TokenOption {
  name: string;
  address: string;
  logo: string;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  {
    name: "WETH",
    address: "0x3A6c69259bC97E0912C7a678ca5331A93d2bfA46",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    name: "WBTC",
    address: "0x197E528D15aD6d6B51672Fc3D11FCCcdEedE6cD2",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "USDC",
    address: "0x373e1981F97607B4073Ee8bB23e3810CdAAAD1f8",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
];
