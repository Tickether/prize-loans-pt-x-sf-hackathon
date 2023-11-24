//SPDX-License-Identifier: UNLICENSED
//Code by @0xGeeLoko

pragma solidity ^0.8.19;

interface IERC666 {

    // Logged when the user of an NFT is changed or expires is changed
    /// @notice Emitted when the `borrower` of an NFT or the `expires` of the `borrower` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateBorrower(uint256 indexed loanId, address indexed borrower, uint256 collateralAmount, uint256 loanAmount, uint256 loanPayableAmount, address loanPayableAddress, uint64 loanDate, uint64 loanExpires);


    /// @notice Get the right Of Collateral address of an Loan
    /// @dev The owner address indicates that there borrower did payback or missed stream 
    /// @param loanId The loan to get the user address for
    /// @return The right Of Collateral address for this Loan
    function liquidaterOfCollateral(uint256 loanId) external view returns(address);
    
}