"use client";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SuperfluidWidget, {
  WidgetProps,
  ProductDetails,
} from "@superfluid-finance/widget";

import { ThemeOptions } from "@mui/material";
import { Button } from "@/components/ui/button";
export default function Superfluid({
  amount,
  reciver,
}: {
  amount: string;
  reciver: string;
}) {
  if (amount == "" || amount == "") {
    return;
  }

  const paymentDetails: WidgetProps["paymentDetails"] = {
    paymentOptions: [
      {
        receiverAddress: reciver,
        chainId: 420,
        superToken: {
          address: "0xE01F8743677Da897F4e7De9073b57Bf034FC2433",
        },
        flowRate: {
          amountEther: amount,
          period: "month",
        },
      },
    ],
  };

  const productDetails: ProductDetails = {
    name: "Pweethy",
    description: "Start Payment of 3.4% of Total loan  amount",
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
              <SuperfluidWidget
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
                    Start your Intrest payment💵
                  </Button>
                )}
              </SuperfluidWidget>
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
