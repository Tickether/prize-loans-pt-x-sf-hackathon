export const pweethyABI = [
    {
        inputs: [{ name: "amount", type: "uint256" }],
        name: 'collateralizedPrizeLoan',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: "loanId", type: "uint256" }],
        name: 'defaultPrizeCollateral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: "amount", type: "uint256" }, { name: "loanId", type: "uint256" }],
        name: 'payLoanAmount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ name: "borrower", type: "address" }],
        name: 'getBorrowerLoans',
        outputs: [{ name: "", type: "uint256[]" },],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: "", type: "uint256" }],
        name: 'borrowers',
        outputs: [{ name: "borrower", type: "address" },{ name: "collateralAmount", type: "uint256" },{ name: "loanAmount", type: "uint256" },{ name: "loanAmountPaid", type: "uint256" },{ name: "loanPayableAddress", type: "address" },{ name: "loanDate", type: "uint64" },{ name: "loanExpiry", type: "uint64" }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export const pweethyContractConfig = {
    address: "0x794F778358522d6071Cc5C9a6A2E23a820620708",
    abi: pweethyABI,
  } as const;