// MyContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface MyContextProps {
  flagDeposit: boolean;
  setFlagDeposit: Dispatch<SetStateAction<boolean>>;
  txhash: string;
  setTxhash: Dispatch<SetStateAction<string>>;
  flagApprove: boolean;
  setFlagApprove: Dispatch<SetStateAction<boolean>>;
}

const MyContext = createContext<MyContextProps | undefined>(undefined);

interface MyContextProviderProps {
  children: ReactNode;
}

export function MyContextProvider({ children }: MyContextProviderProps) {
  const [flagDeposit, setFlagDeposit] = useState<boolean>(false);
  const [txhash, setTxhash] = useState<string>("");
  const [flagApprove, setFlagApprove] = useState<boolean>(true);

  const contextValue: MyContextProps = {
    flagDeposit,
    flagApprove,
    txhash,
    setTxhash,
    setFlagApprove,

    setFlagDeposit,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}
