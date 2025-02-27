// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {LendingPoolFactory} from "../src/LendingPoolFactory.sol";
import {LendingPool} from "../src/LendingPool.sol";
import {Position} from "../src/Position.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockPEPE} from "../src/MockPEPE.sol";
import {MockWBTC} from "../src/MockWBTC.sol";
import {MockWETH} from "../src/MockWETH.sol";
import {MockMANTA} from "../src/MockMANTA.sol";
import {PriceFeed} from "../src/PriceFeed.sol";

interface IOracle {
    function getPrice(address _collateral, address _borrow) external view returns (uint256);
    function getPriceTrade(address _tokenFrom, address _tokenTo) external view returns (uint256, uint256);
    function getQuoteDecimal(address _token) external view returns (uint256);
    function priceCollateral(address _token) external view returns (uint256);
}

contract LendingPoolFactoryTest is Test {
    LendingPoolFactory public lendingPoolFactory;
    LendingPool public lendingPool;
    Position public position;
    IOracle public oracle;
    MockUSDC public usdc;
    MockWBTC public wbtc;
    MockWETH public weth;
    MockMANTA public manta;
    MockPEPE public pepe;

    PriceFeed public priceFeed;

    address public owner = makeAddr("owner");

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    bool priceFeedIsActive = false;

    // address wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599; // real weth
    // address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // real weth
    // address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // real usdc
    // address pepe = 0x6982508145454Ce325dDbE47a25d4ec3d2311933; // real pepe

    address router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    address ethUsd = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419; // ETH/USD
    address usdcUsd = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6; // USDC/USD
    // address pepeUsd = 0x4ffC43a60e009B551865A93d232E33Fce9f01507; // SOL/USD

    function setUp() public {
        usdc = new MockUSDC();
        wbtc = new MockWBTC();
        weth = new MockWETH();
        manta = new MockMANTA();
        pepe = new MockPEPE();

        priceFeed = new PriceFeed();
        oracle = IOracle(address(priceFeed));

        vm.startPrank(alice);
        vm.createSelectFork("https://eth-mainnet.g.alchemy.com/v2/npJ88wr-vv5oxDKlp0mQYSfVXfN2nKif", 21843948);
        lendingPoolFactory = new LendingPoolFactory(address(oracle));
        lendingPool = new LendingPool(address(weth), address(usdc), address(oracle), 7e17);
        position = new Position(address(weth), address(usdc));
        vm.stopPrank();

        vm.startPrank(bob);
        lendingPool.createPosition();
        vm.stopPrank();

        // deal(usdc, alice, 10000e6);
        // deal(weth, alice, 1e18);

        // deal(usdc, bob, 2000e6);
        // deal(weth, bob, 2e18);

        usdc.mint(alice, 10000e6);
        weth.mint(alice, 100e18);

        usdc.mint(bob, 2000e6);
        weth.mint(bob, 200e18);

        priceFeed.addPriceManual("WBTC/USD", address(wbtc), 97086.06 * 10 ** 8, 8); // 97086.06
        priceFeed.addPriceManual("USDC/USD", address(usdc), 99999021, 6); //0.99999021
        priceFeed.addPriceManual("WETH/USD", address(weth), 2633.49 * 10 ** 8, 18); // 2633.49000000
        priceFeed.addPriceManual("PEPE/USD", address(pepe), 0.00001023 * 10 ** 8, 18); //0.00001015
        priceFeed.addPriceManual("MANTA/USD", address(manta), 0.405 * 10 ** 8, 18); //0.99999021
    }

    function helper_supply(address _user, address _token, uint256 _amount) public {
        vm.startPrank(_user);
        IERC20(_token).approve(address(lendingPool), _amount);
        lendingPool.supply(_amount);
        vm.stopPrank();
    }

    function helper_supply_borrow() public {
        vm.startPrank(alice);
        IERC20(address(usdc)).approve(address(lendingPool), 1000e6);
        lendingPool.supply(1000e6);
        vm.stopPrank();

        vm.startPrank(bob);
        IERC20(address(weth)).approve(address(lendingPool), 150e18);
        lendingPool.supplyCollateralByPosition(150e18);
        lendingPool.borrowByPosition(500e6);
        vm.warp(block.timestamp + 365 days);
        lendingPool.accrueInterest();
        vm.stopPrank();
    }

    function helper_repay() public {
        helper_supply_borrow();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayByPosition(454e6); // 454 shares setara 499.4
        vm.stopPrank();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 300e6);
        lendingPool.repayByPosition(46e6); // 46 shares setara 50.6
        vm.stopPrank();
    }

    function test_borrow() public {
        // bob borrow 8000 usdc
        uint256 borrowed = 1800e6;

        // alice supply 1000 usdc
        helper_supply(alice, address(usdc), 10000e6);

        vm.startPrank(bob);
        // bob supply 1 WETH as collateral
        IERC20(weth).approve(address(lendingPool), 1e18);
        lendingPool.supplyCollateralByPosition(1e18);

        vm.expectRevert(LendingPool.InsufficientCollateral.selector);
        lendingPool.borrowByPosition(10_000e6);

        // bob borrow usdc
        lendingPool.borrowByPosition(borrowed);

        vm.stopPrank();
    }

    function test_withdraw() public {
        helper_supply(alice, address(usdc), 1000e6);
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdraw(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdraw(10_000e6);

        lendingPool.withdraw(400e6);
        vm.stopPrank();

        console.log("alice balance: ", IERC20(address(usdc)).balanceOf(alice));
    }

    function test_repay() public {
        helper_supply_borrow();

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayByPosition(454e6); // 454 shares setara 499.4
        vm.stopPrank();

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets after repay", lendingPool.totalSupplyAssets()); // no changes
        console.log("total borrow assets after repay", lendingPool.totalBorrowAssets()); // 50.6e6
        console.log("total borrow shares after repay", lendingPool.totalBorrowShares()); // 46e6
        console.log("user borrow shares after repay", lendingPool.userBorrowShares(bob)); // 46e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 300e6);
        lendingPool.repayByPosition(46e6); // 46 shares setara 50.6
        vm.stopPrank();

        console.log("bob balance", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets after repay 2", lendingPool.totalSupplyAssets()); // no changes
        console.log("total borrow assets after repay 2", lendingPool.totalBorrowAssets()); // 0
        console.log("total borrow shares after repay 2", lendingPool.totalBorrowShares()); // 0
        console.log("user borrow shares after repay 2", lendingPool.userBorrowShares(bob)); // 0
    }

    function test_part2_repay() public {
        console.log("----- before borrow");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 0
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 0
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 0
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 0
        console.log("-----");
        helper_supply_borrow();
        console.log("----- after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        console.log("-----");
        console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        console.log("-----");
        lendingPool.swapTokenByPosition(address(usdc), address(weth), 0.1e18);
        console.log("----- weth swap to usdc");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("position usdc IERC20 balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPosition(bob)));
        console.log("-----");

        console.log("----- usdc swap to weth");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("position usdc IERC20 balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPosition(bob)));
        console.log("-----");

        console.log("----- after repay using weth");
        lendingPool.repayWithSelectedToken(45e6, address(weth)); // 45 shares == 49.5 USDC
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("balance of lending pool usdc", IERC20(address(usdc)).balanceOf(lendingPool.addressPosition(bob)));
        console.log("-----");

        uint256 borrowAmount = ((45e6 * lendingPool.totalBorrowAssets()) / lendingPool.totalBorrowShares());
        console.log("borrowAmount: ", borrowAmount);
        console.log("-----");
        console.log("ETH/USDC", helper_tokenCalculator(1e18, address(weth), address(usdc)));
        console.log("-----");
        vm.stopPrank();
    }

    function test_part3_repay() public {
        console.log("----- before borrow");
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 0
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 0
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 0
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 0
        console.log("-----");
        helper_supply_borrow();
        console.log("----- after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        lendingPool.swapTokenByPosition(address(usdc), address(weth), 15e18);
        console.log("----- weth swap to usdc");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc))); // 39502.736731
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(weth));
        console.log("----- repay with weth");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc))); // 39552.236731 harusnya berkurang
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(usdc));
        console.log("----- repay with usdc");
        console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc))); // 39552.236731 harusnya berkurang
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("-----");
        console.log("calculator", lendingPool.tokenCalculator(1e18, address(weth), address(usdc)));
        vm.stopPrank();
    }

    function test_withdraw_withshares() public {
        helper_repay();

        console.log("alice balance before", IERC20(address(usdc)).balanceOf(alice));
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdraw(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdraw(10_000e6);

        lendingPool.withdraw(1000e6); // 1000 shares setara 1050 usdc
        vm.stopPrank();

        console.log("alice balance after", IERC20(address(usdc)).balanceOf(alice));
    }

    function test_swap() public {
        console.log("test price feed PEPE", priceFeed.priceCollateral(address(pepe)));
        console.log("test price feed WETH", priceFeed.priceCollateral(address(weth)));

        vm.startPrank(bob);
        IERC20(address(weth)).approve(address(lendingPool), 1.2e18); // awalnya deal 2 ether, jadi 0,8 ether
        lendingPool.supplyCollateralByPosition(1.2e18);
        vm.stopPrank();

        // berkurang udah bisa supply collateral
        console.log("bob balance weth", IERC20(address(weth)).balanceOf(bob)); // 800000000000000000 = 0,8 ether

        /**
         * @param swapTokenByPosition(toToken, fromToken, amountIn)
         * 1. WETH is collateral token, can be trade
         * 2. USDC is not collateral token, can't be trade
         * 3. USDC can be trade, if collateral token swap to USDC
         */
        vm.startPrank(bob);
        uint256 amountOut2 = lendingPool.swapTokenByPosition(address(pepe), address(weth), 0.1e18);
        console.log("amountOut2", amountOut2); // 51485630508031539802751413
        console.log("-------dapet berapa pepe=====", lendingPool.getTokenBalancesByPosition(address(pepe)));

        vm.expectRevert(LendingPool.TokenNotAvailable.selector);
        uint256 amountOut3 = lendingPool.swapTokenByPosition(address(pepe), address(usdc), 526703156);
        console.log("amountOut3", amountOut3); // 52670315.600000000000000000
        vm.stopPrank();
    }

    function test_web_flow() public {
        vm.startPrank(bob);

        IERC20(address(usdc)).approve(address(lendingPool), 1000e6);
        lendingPool.supply(1000e6);

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Shares", lendingPool.totalSupplyShares());
        console.log("Bob supply Assets", lendingPool.totalSupplyAssets());
        console.log("----------------------------------------------------------------");

        lendingPool.createPosition();
        IERC20(address(weth)).approve(address(lendingPool), 5e18);
        lendingPool.supplyCollateralByPosition(5e18);

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Assets", lendingPool.userCollaterals(bob));
        console.log("----------------------------------------------------------------");

        lendingPool.borrowByPosition(500e6);
        console.log("----------------------------------------------------------------");
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        vm.warp(block.timestamp + 365 days);
        lendingPool.accrueInterest();

        lendingPool.swapTokenByPosition(address(usdc), address(weth), 1e18);

        console.log("----------------------------------------------------------------");
        console.log("Bob usdc", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        lendingPool.repayWithSelectedToken(100e6, address(usdc));

        console.log("----------------------------------------------------------------");
        console.log("Bob usdc", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());

        console.log("collateral", lendingPool.collateralToken());
        console.log("borrow", lendingPool.borrowToken());
        console.log("tokenownerlength", lendingPool.getTokenLengthByPosition());
        console.log("----------------------------------------------------------------");
        vm.warp(block.timestamp + 365 days);

        lendingPool.borrowByPosition(100e6);

        // console.log("Bob usdc", lendingPool.getTokenBalancesByPosition(address(usdc)));
        // console.log("Bob weth", lendingPool.userCollaterals(bob));
        // console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        // console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        vm.warp(block.timestamp + 365 days);
        uint256 borrowAmount = ((100e6 * lendingPool.totalBorrowAssets()) / lendingPool.totalBorrowShares());

        console.log("borrowAmount", borrowAmount);

        lendingPool.repayWithSelectedToken(100e6, address(usdc));
        console.log("----------------------------------------------------------------");
        console.log("Bob usdc", lendingPool.getTokenBalancesByPosition(address(usdc)));
        console.log("----------------------------------------------------------------");
        // lendingPool.borrowByPosition(100e6);

        vm.stopPrank();
    }

    function helper_tokenCalculator(uint256 _amount, address _tokenFrom, address _tokenTo)
        public
        view
        returns (uint256)
    {
        (uint256 _realPrice,) = IOracle(oracle).getPriceTrade(_tokenTo, _tokenFrom);
        uint256 amountOut = _amount * IOracle(oracle).getQuoteDecimal(_tokenTo) / _realPrice;
        return amountOut;
    }

    function helper_swap() public view {
        console.log("Bob's Collateral", lendingPool.userCollaterals(bob)); // 1 ether

        (uint256 pepePrice,) = IOracle(oracle).getPriceTrade(address(pepe), address(usdc));
        (uint256 wbtcPrice,) = IOracle(oracle).getPriceTrade(address(wbtc), address(usdc));

        console.log("-----");
        // console.log("weth/usdc", IOracle(oracle).getPrice(weth, usdc));
        console.log("weth/usd", IOracle(oracle).priceCollateral(address(weth))); // 2633.49000000
        console.log("0.2 weth/usd", 2 * IOracle(oracle).priceCollateral(address(weth)) / 10); // 526.69800000
        console.log(
            "weth/usdc",
            IOracle(oracle).priceCollateral(address(weth)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc))
        ); // 2633.515782
        console.log(
            "0.2 weth/usdc",
            2 * (IOracle(oracle).priceCollateral(address(weth)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc)))
                / 10
        ); // 526703156
        console.log("pepe/usd", IOracle(oracle).priceCollateral(address(pepe))); // 0.00001010
        console.log("usdc/usd", IOracle(oracle).priceCollateral(address(usdc))); // 0.99999021
        console.log(
            "pepe/usdc",
            IOracle(oracle).priceCollateral(address(pepe)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc))
        ); // 0.000010
        console.log("pepe decimal", IOracle(oracle).getQuoteDecimal(address(pepe))); // 1000000000000000000
        console.log(
            "1 eth dapat pepe sejumlah:", 2633515782 * IOracle(oracle).getQuoteDecimal(address(pepe)) / pepePrice
        ); // 263351578.200000000000000000
        console.log(
            "1 eth dapat wbtc sejumlah:", 2633515782 * IOracle(oracle).getQuoteDecimal(address(wbtc)) / wbtcPrice
        ); // 257380254
        console.log("1 eth dapat wbtc sejumlah:", 2633515782 * 1e8 / wbtcPrice); // 0.02712531
        console.log("-----");
        // uint256 totalPepe = priceFeed.priceCollateral(address(pepe)) * amountOut3 / 1e18;
        // console.log("Price of PEPE/USD", totalPepe); // 262.32009831
        // uint256 totalWETH = priceFeed.priceCollateral(address(weth)) * lendingPool.userCollaterals(bob) / 1e18;
        // console.log("Price of WETH/USD", totalWETH); // 3133.57000000
        console.log("-----");
        console.log("-----");
        console.log("-----");
    }
}
