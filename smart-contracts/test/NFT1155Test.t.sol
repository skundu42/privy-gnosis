// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NFT1155.sol";

contract NFT1155Test is Test {
    NFT1155 public nft1155;
    address public owner = address(0x123);
    address public recipient = address(0x456);
    uint256 public constant MINT_PRICE = 0.008 ether;

    function setUp() public {
        // Deploy the contract
        nft1155 = new NFT1155("https://api.example.com/metadata/");
        
        // Set the deployer as the contract owner
        nft1155.transferOwnership(owner);
    }

    function testMintingToken() public {
        // Set up the prank and deal ether to recipient for minting
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient); // Start prank for recipient
        
        // Mint 1 token with ID 1
        nft1155.mintTo{value: MINT_PRICE}(recipient, 1, 1);
        
        // Check the token balance of the recipient for tokenId 1
        assertEq(nft1155.balanceOf(recipient, 1), 1);
        
        vm.stopPrank(); // Stop prank after minting
    }

    function testMintingWithInsufficientFunds() public {
        // Set up prank and deal insufficient ether
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient);

        // Expect the MintPriceNotPaid error
        vm.expectRevert(MintPriceNotPaid.selector);
        nft1155.mintTo{value: 0.004 ether}(recipient, 1, 1);
        
        vm.stopPrank();
    }

    function testWithdrawPayments() public {
        // Mint 1 token to add balance to the contract
        vm.deal(recipient, 1 ether);
        vm.startPrank(recipient);
        nft1155.mintTo{value: MINT_PRICE}(recipient, 1, 1);
        vm.stopPrank();

        // Check that the contract balance matches the mint price
        assertEq(address(nft1155).balance, MINT_PRICE);

        // Withdraw the balance as the owner
        vm.prank(owner);
        nft1155.withdrawPayments(payable(owner));

        // Check that the balance of the owner increased and contract balance is 0
        assertEq(address(owner).balance, MINT_PRICE);
        assertEq(address(nft1155).balance, 0);
    }

    function testWithdrawWithoutFunds() public {
        // Attempt to withdraw with zero balance
        vm.prank(owner);
        vm.expectRevert(WithdrawTransfer.selector);
        nft1155.withdrawPayments(payable(owner));
    }

    function testURI() public view {
        // Check that the URI returns the correct value
        string memory expectedURI = "https://api.example.com/metadata/1";
        assertEq(nft1155.uri(1), expectedURI);
    }

    function testSetBaseURI() public {
        // Set a new base URI and test that the change is reflected
        vm.prank(owner);
        nft1155.setBaseURI("https://newbaseuri.com/metadata/");

        string memory expectedURI = "https://newbaseuri.com/metadata/1";
        assertEq(nft1155.uri(1), expectedURI);
    }
}
