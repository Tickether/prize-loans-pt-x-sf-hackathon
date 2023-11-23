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
        uint256 loanAmountPaid;
        address loanPayableAddress;
        uint64 loanDate; // unix timestamp, loan start
        uint64 loanExpiry; // unix timestamp, loan end
    }

    bool public loansIsActive = false;
    
    uint256 public totalLoanSupply;

    address public collateralToken = 0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4; //PWeeeTHy
    address public loanToken = 0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64; //WeTH
    address public interestToken = 0xE01F8743677Da897F4e7De9073b57Bf034FC2433; //eTHX
    address public erc6651Implementation = 0x55266d75D1a14E4572138116aF39863Ed6596E7F;//param: implementation (address) - 

    
    mapping (uint256  => BorrowerInfo) internal _borrowers;
    mapping (uint256  => uint64) internal loanRepayDate;

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


    //loan tracking SBT
    function getLoanTrackenToken() 
    internal
    nonReentrant
    {
        uint256 loanId = totalLoanSupply;
   
        totalLoanSupply += 1;

        _safeMint(address(this), loanId);
        //make TBA for loan deposits - needed to check stream for each loan
        erc6651RegistryContract.createAccount(erc6651Implementation, bytes32(0), 420, address(this), loanId);
    }


    // lox prize tokens and releases loan amount delegates rewards to depositer
    function collateralizedPrizeLoan(uint256 amount) external {
        require(loansIsActive, "PWeeeTHy offline");

        IERC20 collateralTokenContract = IERC20(collateralToken);
        IERC20 loanTokenContract = IERC20(loanToken);

        uint256 loanReservers = loanTokenContract.balanceOf(address(this));
        uint256 _loanAmount = (amount * 900 / 1000);
        
        //timestamp
        uint64 timestamp = uint64(block.timestamp);
        
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
        info.loanAmountPaid = 0;
        info.loanPayableAddress = loanTokenPayableAddress;
        info.loanDate = timestamp;
        info.loanExpiry = 31556926 + timestamp;

        // delegate amount in mapping to borrower 
        collateralTokenContractTWABDelegatooor.createDelegation(address(this), amount, msg.sender, uint96( 31556926 + timestamp));
        
        emit UpdateBorrower(totalLoanSupply - 1, msg.sender, amount, (_loanAmount), 0, loanTokenPayableAddress, timestamp, 31556926 + timestamp);
    }


    function payLoanAmount(uint256 amount, uint256 loanId) external {
        //add you cant pay loan after one year
        //timestamp
        uint64 timestamp = uint64(block.timestamp);

        require(timestamp < _borrowers[loanId].loanExpiry, "too late to pweeeeeeeeeth!"); 
        BorrowerInfo storage info =  _borrowers[loanId];

        require(info.loanAmountPaid + amount < info.loanAmount, "pweeeeeeeeeth!"); 
        
        IERC20 loanTokenContract = IERC20(loanToken);

        bool transferredLoanPayback = loanTokenContract.transferFrom(msg.sender, address(this), amount);
        require(transferredLoanPayback, "failed loan transfer");

        info.loanAmountPaid = info.loanAmountPaid + amount;

        
        if (info.loanAmountPaid >= info.loanAmount) {
            loanRepayDate[loanId] = timestamp;
        }

        emit UpdateBorrower(loanId, info.borrower, info.collateralAmount, info.loanAmount, info.loanAmountPaid, info.loanPayableAddress, info.loanDate, info.loanExpiry);
    }


    // take collateral
    function defaultPrizeCollateral(uint256 loanId) external { 
        //timestamp
        uint64 timestamp = uint64(block.timestamp);
        require(loanRepayDate[loanId] != 0 || _borrowers[loanId].loanExpiry < timestamp, "can't PWeeeTH yet");     
        IERC20 collateralTokenContract = IERC20(collateralToken);
        address liquidatooor = liquidaterOfCollateral(loanId);
        require(msg.sender == liquidatooor, "cant PWeeeTH transfer");  

        //release collateral amount(must be liquidatooor)
        bool transferredLoan = collateralTokenContract.transfer(liquidatooor, _borrowers[loanId].collateralAmount);
        require(transferredLoan, "failed loan transfer");     
    }
    /*
    //bulk liquidatooor 
    function defaultPrizeCollateralBulk(uint256 loanId) external {
    }
    */


    // take stream prof
    function takeLoanProfits(uint256 loanId) external onlyOwner { 
     
        ISuperToken interestTokenContract = ISuperToken(interestToken);
        (/*uint256 lastUpdated*/, /*int96 flowRate*/, uint256 deposit, /*uint256 owedDeposit*/) = flowInfoContract.getFlowInfo(interestTokenContract, _borrowers[loanId].borrower, _borrowers[loanId].loanPayableAddress);
        
        //release interest amount(must be liquidatooor)
        bool takenProfits = interestTokenContract.transfer( msg.sender, deposit );
        require(takenProfits, "failed taking profits"); 

        //alt tranfer from//
        //approval of balance
        //bool approveProfitsTaker = interestTokenContract.approve(address(this), deposit);
        //bool takenProfits = interestTokenContract.transferFrom( _borrowers[loanId].loanPayableAddress, msg.sender, deposit);    
    }
    /*
    //bulk takeprofitooor 
    function takeProfitsBulk(uint256 loanId) external {
    }
    */
    

    // who gets right to collateral after loan repay or expiry
    function liquidaterOfCollateral(uint256 loanId) public view virtual override returns(address){
        
        ISuperToken interestTokenContract = ISuperToken(interestToken);
        (/*uint256 lastUpdated*/,/* int96 flowRate*/, uint256 deposit, /*uint256 owedDeposit*/) = flowInfoContract.getFlowInfo(interestTokenContract, _borrowers[loanId].borrower, _borrowers[loanId].loanPayableAddress);

        uint64 payDate = loanRepayDate[loanId];
        uint256 expectedDeposit;

        if (payDate == 0) {
            return owner();
        } else {
            // check stream paid
            expectedDeposit = /*loanPeriod*/((payDate - _borrowers[loanId].loanDate) - 86400 /*grace period */) * /*loanInterest*/(_borrowers[loanId].loanAmount * 34 / 1000);
            if (deposit >= expectedDeposit) {
                return  _borrowers[loanId].borrower;
            } else {
                return owner();
            }
                
        }
    }

    function loanExpires(uint256 loanId) public view virtual override returns(uint256){
        if( uint256(_borrowers[loanId].loanExpiry) >=  block.timestamp){
            return  _borrowers[loanId].loanExpiry;
        }
        else{
            return uint64(0);
        }
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