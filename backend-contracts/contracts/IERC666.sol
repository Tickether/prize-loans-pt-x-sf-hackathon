//SPDX-License-Identifier: UNLICENSED
//Code by @0xGeeLoko

pragma solidity ^0.8.4;

interface IERC666 {

    // Logged when the user of an NFT is changed or expires is changed
    /// @notice Emitted when the `borrower` of an NFT or the `expires` of the `borrower` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateBorrower(uint256 indexed tokenId, address indexed borrower, uint256 collateralAmount, uint256 loanAmount, uint256 loanInterestAmount, uint256 loanPayableAmount, address loanPayableAddress, uint64 expires);
/*
    /// @notice set the borrower and expires of an NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param borrower  The new borrower of the NFT
    /// @param expires  UNIX timestamp, The new borrower could use the NFT before expires
    function setBorrower(uint256 tokenId, address borrower, uint64 expires) external;
*/
    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no borrower or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function liquidaterOfCollateral(uint256 tokenId) external view returns(address);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no borrower
    /// @param tokenId The NFT to get the user expires for
    /// @return The borrower expires for this NFT
    function loanExpires(uint256 tokenId) external view returns(uint256);

    
}