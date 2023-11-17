//SPDX-License-Identifier: UNLICENSED
//Code by @sliponit x @0xGeeLoko

pragma solidity ^0.8.17;
import "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Delegation.sol";
import "./IERC666.sol";

//loan 
//repay

interface ITWAB {
    function createDelegation(address _delegator, uint256 _slot, address _delegatee, uint96 _lockDuration) external view returns (Delegation);
}

interface IFLOW {
    function getFlowInfo(ISuperToken token, address sender, address receiver) external view returns(uint256, int96, uint256, uint256);
}

contract PrizeLoanWrapper is ERC721, IERC666, Ownable, ReentrancyGuard {

    ITWAB collateralTokenContractTWABDelegatooor = ITWAB(0x346Df08b6B0630714C80E65f7beEFcc50b3Fc4Ec); //TWABPWeeeTHy PWeeeTH
    IFLOW flowInfoContract = IFLOW(0xff48668fa670A85e55A7a822b352d5ccF3E7b18C); //interest PWeeeTH flow info

    string public baseTokenURI;
    
    struct BorrowerInfo {
        address borrower;   // address of borrower role
        uint256 collateralAmount;  
        uint256 loanAmount;
        uint256 loanInterestAmount;
        uint256 loanPayableAmount;
        uint64 expires; // unix timestamp, user expires
    }

    bool public loansIsActive = false;
    
    uint256 public totalLoanSupply;

    address public collateralToken = 0xaD91C29732fD148616882D2B50f2D886204E570B; //PWeeeTHy
    address public loanToken = 0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64; //WeTH
    address public interestToken = 0xE01F8743677Da897F4e7De9073b57Bf034FC2433; //eTHX
    
    mapping (uint256  => BorrowerInfo) internal _borrowers;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function flipLoanState() public onlyOwner {
        loansIsActive = !loansIsActive;
    }

    function supplyPrizeLoanLiquidity(uint256 amount) external onlyOwner {
        
    }
    function removePrizeLoanLiquidity(uint256 amount) external onlyOwner {
        
    }
    // lox prize tokens and releases loan amount delegates rewards to depositer
    function collateralizedPrizeLoan(uint256 amount) external {
         require(loansIsActive, "PWeeeTHy offline");
        //tranfers pt tokens
        getLoanTrackenToken();
        IERC20 collateralTokenContract = IERC20(collateralToken);
        IERC20 loanTokenContract = IERC20(loanToken);

        bool transferredCollateral = collateralTokenContract.transferFrom(msg.sender, address(this), amount);
        require(transferredCollateral, "failed collateral transfer"); 

        // timestamp for 30days multiplied by months to expire 
        uint64 loanPeriod = 12 * 2592000; 
        uint64 timestamp = uint64(block.timestamp);
        
        //store loan info //record mapping for uncollateralization
        BorrowerInfo storage info =  _borrowers[totalLoanSupply];
        info.borrower = msg.sender;
        info.collateralAmount = amount;
        info.loanAmount = (amount * 900 / 1000);
        info.loanInterestAmount = (amount * 34 / 1000);
        info.loanPayableAmount = 0;
        info.expires = loanPeriod + timestamp;

        //release loan amount(must be less the contract balance for token)
        bool transferredLoan = loanTokenContract.transferFrom(address(this), msg.sender, amount * 90);
        require(transferredLoan, "failed loan transfer");

        // delegate amount in mapping to borrower 
        collateralTokenContractTWABDelegatooor.createDelegation(address(this),  amount, msg.sender, uint96(loanPeriod + timestamp));
        
        emit UpdateBorrower(totalLoanSupply, msg.sender, amount, (amount * 900 / 1000), (amount * 34 / 1000), 0, loanPeriod + timestamp);
    }


    function payLoanAmount(uint256 amount, uint256 loanId) external {
        BorrowerInfo storage info =  _borrowers[loanId];

        require(info.loanPayableAmount + amount < info.loanAmount, "pweeeeeeeeeth!"); 
        
        IERC20 loanTokenContract = IERC20(loanToken);

        bool transferredLoanPayback = loanTokenContract.transferFrom(msg.sender, address(this), amount);
        require(transferredLoanPayback, "failed loan transfer");

        info.loanPayableAmount = info.loanPayableAmount + amount;

        emit UpdateBorrower(loanId, info.borrower, info.collateralAmount, info.loanInterestAmount, info.loanInterestAmount, info.loanPayableAmount, info.expires);
        
        
    }

    function defaultPrizeCollateral(uint256 loanId) external { 
        IERC20 collateralTokenContract = IERC20(collateralToken);
        address liquidatooor = liquidaterOfCollateral(loanId);
        require(msg.sender == liquidatooor, "cant PWeeeTH transfer");  

        //release collateral amount(must be liquidatooor)
        bool transferredLoan = collateralTokenContract.transferFrom(address(this), liquidatooor, _borrowers[loanId].collateralAmount);
        require(transferredLoan, "failed loan transfer");     
    }

    //bulk liquidatooor 
    function defaultPrizeCollateralBulk(uint256 loanId) external {
    }


    function liquidaterOfCollateral(uint256 loanId) public view virtual override returns(address){
        ISuperToken interestTokenContract = ISuperToken(interestToken);
        if( uint256(_borrowers[loanId].expires) >=  block.timestamp){
            if (_borrowers[loanId].loanAmount >= _borrowers[loanId].loanPayableAmount) {
                // check stream paid
                (/*uint256 lastUpdated*/, /*int96 flowRate*/, uint256 deposit, /*uint256 owedDeposit*/) = flowInfoContract.getFlowInfo(interestTokenContract, _borrowers[loanId].borrower, address(this));
                if (deposit >= _borrowers[loanId].loanInterestAmount) {
                    return  _borrowers[loanId].borrower; 
                } else {
                    return owner();
                } 
            } 
        }
    }

    function loanExpires(uint256 loanId) public view virtual override returns(uint256){
        if( uint256(_borrowers[loanId].expires) >=  block.timestamp){
            return  _borrowers[loanId].expires;
        }
        else{
            return uint256(0);
        }
    }


    function getLoanTrackenToken() 
    internal
    nonReentrant
    {
        uint256 loanId = totalLoanSupply;
   
        totalLoanSupply += 1;

        _safeMint(msg.sender, loanId);
    }

    /// ERC721 related
    /**
     * @dev See {ERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 loanId) public view override returns (string memory) {
        require(_exists(loanId), "nonexistent token");

        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI, ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC666).interfaceId || super.supportsInterface(interfaceId);
    }



    /// @dev allow only minting memberships no transfers
    function _beforeTokenTransfer(
        address from,
        address /* to */,
        uint256 /* firstTokenId */,
        uint256 /* batchSize */
    ) internal virtual override {
        
        require(from == address(0) , "can't transfer token");
        
    }

}