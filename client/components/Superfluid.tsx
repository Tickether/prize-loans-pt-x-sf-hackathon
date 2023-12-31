"use client";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SuperfluidWidget, {
  WidgetProps,
  ProductDetails,
} from "@superfluid-finance/widget";
import Link from "next/link";
import { ThemeOptions } from "@mui/material";
import { Button } from "@/components/ui/button";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/router";
import { useState } from "react";
export default function Superfluid({
  amount,
  reciver,
}: {
  amount: number;
  reciver: string;
}) {
  console.log(amount.toFixed(15).toString());
  const [flag, setflag] = useState(false);
  const paymentDetails: WidgetProps["paymentDetails"] = {
    paymentOptions: [
      {
        receiverAddress: reciver,
        chainId: 420,
        superToken: {
          address: "0xE01F8743677Da897F4e7De9073b57Bf034FC2433",
        },
        flowRate: {
          amountEther: amount.toFixed(15).toString(),
          period: "month",
        },
      },
    ],
  };

  const productDetails: ProductDetails = {
    name: "Pweethy",
    description: "Start Payment of 3.4% Yearly Interest",
    imageURI: "",
  };
  const thems: ThemeOptions = {
    typography: {
      fontFamily: "'Noto Sans', 'sans-serif'",
    },
    palette: {
      mode: "light",
      primary: {
        main: "rgb(20, 191, 228)",
      },
      secondary: {
        main: "rgb(202, 162, 226)",
      },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiStepIcon: {
        styleOverrides: {
          text: {
            fill: "rgb(202, 162, 226)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  };

  return (
    <>
      <ConnectButton.Custom>
        {({ openConnectModal, connectModalOpen }) => {
          const walletManager = {
            open: async () => openConnectModal(),
            isOpen: connectModalOpen,
          };
          return (
            <>
              {!flag ? (
                <SuperfluidWidget
                  eventListeners={{
                    onSuccess: () => {
                      toast({
                        variant: "success",
                        title:
                          "Your loan is complete! Please check your WETH balance ",
                      });
                      setflag(true);
                    },
                  }}
                  productDetails={productDetails}
                  paymentDetails={paymentDetails}
                  type="dialog"
                  theme={thems}
                  walletManager={walletManager}
                >
                  {({ openModal }) => (
                    <Button
                      className="p-3 w-[70%]"
                      variant="secondary"
                      onClick={(e) => {
                        openModal();
                      }}
                    >
                      Start your interest payment💵
                    </Button>
                  )}
                </SuperfluidWidget>
              ) : (
                <div className="bg-green-400 rounded-2xl font-bold text-black p-3 border-solid border-2  border-white">
                  <Link href="BorrowHistory"> Check your Loan details</Link>
                </div>
              )}
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
