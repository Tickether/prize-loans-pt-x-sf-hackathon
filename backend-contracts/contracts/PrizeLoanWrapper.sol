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

interface IERC6551 {
    function createAccount(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId) external view returns(address);
    function account(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId) external view returns(address);
}

contract PrizeLoanWrapper is ERC721, IERC666, Ownable, ReentrancyGuard {

    ITWAB collateralTokenContractTWABDelegatooor = ITWAB(0x346Df08b6B0630714C80E65f7beEFcc50b3Fc4Ec); //TWABPWeeeTHy PWeeeTH
    IFLOW flowInfoContract = IFLOW(0xff48668fa670A85e55A7a822b352d5ccF3E7b18C); //interest PWeeeTH flow info
    IERC6551 erc6651RegistryContract = IERC6551(0x000000006551c19487814612e58FE06813775758); // Create Account 6651 
   
    string public baseTokenURI;
    
    struct BorrowerInfo {
        address borrower;   // address of borrower role
        uint256 collateralAmount;  
        uint256 loanAmount;
        uint256 loanInterestAmount;
        uint256 loanPayableAmount;
        address loanPayableAddress;
        uint64 expires; // unix timestamp, user expires
    }

    bool public loansIsActive = false;
    
    uint256 public totalLoanSupply;

    address public collateralToken = 0xaD91C29732fD148616882D2B50f2D886204E570B; //PWeeeTHy
    address public loanToken = 0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64; //WeTH
    address public interestToken = 0xE01F8743677Da897F4e7De9073b57Bf034FC2433; //eTHX
    address public erc6651Implementation = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;//param: implementation (address) - 

    
    mapping (uint256  => BorrowerInfo) internal _borrowers;

    constructor() ERC721("PWeethy", "PWeeth") {}

    function flipLoanState() public onlyOwner {
        loansIsActive = !loansIsActive;
    }

    function supplyPrizeLoanLiquidity(uint256 amount) external onlyOwner {
        IERC20 loanTokenContract = IERC20(loanToken);
        //release loan amount(must be less the contract balance for token)
        bool loanSupplied = loanTokenContract.transferFrom(msg.sender, address(this), amount);
        require(loanSupplied, "failed loan supply");
    }
    function removePrizeLoanLiquidity(uint256 amount) external onlyOwner {
        IERC20 loanTokenContract = IERC20(loanToken);
        //release loan amount(must be less the contract balance for token)
        bool loanSupplied = loanTokenContract.transfer(msg.sender, amount);
        require(loanSupplied, "failed loan unsupply");
        
    }
    // lox prize tokens and releases loan amount delegates rewards to depositer
    function collateralizedPrizeLoan(uint256 amount) external {
        IERC20 collateralTokenContract = IERC20(collateralToken);
        IERC20 loanTokenContract = IERC20(loanToken);

        uint256 loanReservers = loanTokenContract.balanceOf(address(this));
        uint256 _loanAmount = (amount * 900 / 1000);
        uint256 _loanInterestAmount = (amount * 34 / 1000);

        // timestamp for 30days multiplied by months to expire 
        uint64 loanPeriod = 12 * 2592000; 
        uint64 timestamp = uint64(block.timestamp);
        
        require(loansIsActive, "PWeeeTHy offline");
        require(loanReservers >= _loanAmount, "little PWeeeTHy");
        
        //nft loan tracker with payable wallet erc6551 implementation
        getLoanTrackenToken();
        address loanTokenPayableAddress = erc6651RegistryContract.account(erc6651Implementation, bytes32(0), 420, address(this), totalLoanSupply - 1);
        
        //tranfers pt tokens
        bool transferredCollateral = collateralTokenContract.transferFrom(msg.sender, address(this), amount);
        require(transferredCollateral, "failed collateral transfer"); 

        //release loan amount(must be less the contract balance for token)
        bool transferredLoan = loanTokenContract.transfer(msg.sender, _loanAmount);
        require(transferredLoan, "failed loan transfer");
        
        //store loan info //record mapping for uncollateralization
        BorrowerInfo storage info =  _borrowers[totalLoanSupply - 1];
        info.borrower = msg.sender;
        info.collateralAmount = amount;
        info.loanAmount = _loanAmount;
        info.loanInterestAmount = _loanInterestAmount;
        info.loanPayableAmount = 0;
        info.loanPayableAddress = loanTokenPayableAddress;
        info.expires = loanPeriod + timestamp;

        // delegate amount in mapping to borrower 
        collateralTokenContractTWABDelegatooor.createDelegation(address(this), amount, msg.sender, uint96(loanPeriod + timestamp));
        
        emit UpdateBorrower(totalLoanSupply - 1, msg.sender, amount, (_loanAmount), (_loanInterestAmount), 0, loanTokenPayableAddress, loanPeriod + timestamp);
    }


    function payLoanAmount(uint256 amount, uint256 loanId) external {
        BorrowerInfo storage info =  _borrowers[loanId];

        require(info.loanPayableAmount + amount < info.loanAmount, "pweeeeeeeeeth!"); 
        
        IERC20 loanTokenContract = IERC20(loanToken);

        bool transferredLoanPayback = loanTokenContract.transferFrom(msg.sender, address(this), amount);
        require(transferredLoanPayback, "failed loan transfer");

        info.loanPayableAmount = info.loanPayableAmount + amount;

        emit UpdateBorrower(loanId, info.borrower, info.collateralAmount, info.loanInterestAmount, info.loanInterestAmount, info.loanPayableAmount, info.loanPayableAddress, info.expires);
    }

    function defaultPrizeCollateral(uint256 loanId) external { 
        IERC20 collateralTokenContract = IERC20(collateralToken);
        address liquidatooor = liquidaterOfCollateral(loanId);
        require(msg.sender == liquidatooor, "cant PWeeeTH transfer");  

        //release collateral amount(must be liquidatooor)
        bool transferredLoan = collateralTokenContract.transfer(liquidatooor, _borrowers[loanId].collateralAmount);
        require(transferredLoan, "failed loan transfer");     
    }

    //bulk liquidatooor 
    function defaultPrizeCollateralBulk(uint256 loanId) external {
    }


    function liquidaterOfCollateral(uint256 loanId) public view virtual override returns(address){
        // check stream paid
        ISuperToken interestTokenContract = ISuperToken(interestToken);
        (/*uint256 lastUpdated*/, /*int96 flowRate*/, uint256 deposit, /*uint256 owedDeposit*/) = flowInfoContract.getFlowInfo(interestTokenContract, _borrowers[loanId].borrower, _borrowers[loanId].loanPayableAddress);
        
        if( uint256(_borrowers[loanId].expires) >=  block.timestamp){
            if (_borrowers[loanId].loanAmount >= _borrowers[loanId].loanPayableAmount && deposit >= _borrowers[loanId].loanInterestAmount) {
                return  _borrowers[loanId].borrower; 
            } else {
                return owner();
            }
        } else {
            if (_borrowers[loanId].loanAmount >= _borrowers[loanId].loanPayableAmount && deposit >= _borrowers[loanId].loanInterestAmount) {
                return  _borrowers[loanId].borrower; 
            } else {
                return owner();
            }
        }
    }

    function loanExpires(uint256 loanId) public view virtual override returns(uint256){
        if( uint256(_borrowers[loanId].expires) >=  block.timestamp){
            return  _borrowers[loanId].expires;
        }
        else{
            return uint64(0);
        }
    }


    function getLoanTrackenToken() 
    internal
    nonReentrant
    {
        uint256 loanId = totalLoanSupply;
   
        totalLoanSupply += 1;

        _safeMint(address(this), loanId);
        erc6651RegistryContract.createAccount(erc6651Implementation, bytes32(0), 420, address(this), loanId);
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