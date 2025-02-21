export interface TokenOption {
  name: string;
  address: string;
  logo: string;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  {
    name: "WETH",
    address: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    name: "WBTC",
    address: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "USDC",
    address: "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "PEPE",
    address: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0",
    logo: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  },
  {
    name: "MANTA",
    address: "0xe2e80f81589c80cb1d20a7846a350644281e0177",
    logo: "https://s1.coincarp.com/logo/1/mantanetwork.png?style=200&v=1687922197",
  },
];
