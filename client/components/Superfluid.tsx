import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SuperfluidWidget, {
  EventListeners,
  PaymentOption,
} from "@superfluid-finance/widget";
import { useCallback, useMemo, useState } from "react";
import { WidgetProps, ProductDetails } from "@superfluid-finance/widget";

export default function Superfluid() {
  const paymentDetails: WidgetProps["paymentDetails"] = {
    paymentOptions: [
      {
        receiverAddress: "0xf26ce9749f29e61c25d0333bce2301cb2dfd3a22",
        chainId: 420,
        superToken: {
          address: "0xE01F8743677Da897F4e7De9073b57Bf034FC2433",
        },
        flowRate: {
          amountEther: "1",
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
  let data = {
    productDetails: {
      name: "Pweethy",
      description: "Start Payment of 3.4% of Total loan  amount",
      imageURI: "",
    },
    paymentDetails: {
      paymentOptions: [
        {
          receiverAddress: "0xf26ce9749f29e61c25d0333bce2301cb2dfd3a22",
          chainId: 5,
          superToken: {
            address: "0x8ae68021f6170e5a766be613cea0d75236ecca9a",
          },
          flowRate: {
            amountEther: "1",
            period: "month",
          },
        },
      ],
    },
    type: "page",
    theme: {
      typography: {
        fontFamily: "'Noto Sans', 'sans-serif'",
      },
      palette: {
        mode: "light",
        primary: {
          main: "rgb(29, 178, 39)",
        },
        secondary: {
          main: "rgb(255, 255, 255)",
        },
      },
      shape: {
        borderRadius: 20,
      },
      components: {
        MuiStepIcon: {
          styleOverrides: {
            text: {
              fill: "rgb(255, 255, 255)",
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
    },
  };
  const [initialChainId, setInitialChainId] = useState<number | undefined>();
  const onPaymentOptionUpdate = useCallback<
    Required<EventListeners>["onPaymentOptionUpdate"]
  >(
    (paymentOption?: PaymentOption) =>
      setInitialChainId(paymentOption?.chainId),
    [setInitialChainId]
  );
  const eventListeners = useMemo<EventListeners>(
    () => ({ onPaymentOptionUpdate }),
    [onPaymentOptionUpdate]
  );

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
                type="drawer"
                walletManager={walletManager}
                eventListeners={eventListeners}
              >
                {({ openModal }) => (
                  <button onClick={() => openModal()}>Pay Stream</button>
                )}
              </SuperfluidWidget>
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
