"use client";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SuperfluidWidget, {
  EventListeners,
  PaymentOption,
} from "@superfluid-finance/widget";
import { useCallback, useMemo, useState } from "react";
import { WidgetProps, ProductDetails } from "@superfluid-finance/widget";
import { Button } from "@/components/ui/button";
export default function Superfluid({ amount }: { amount: string }) {
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
  if (amount == "" || amount == "") {
    return;
  }

  const paymentDetails: WidgetProps["paymentDetails"] = {
    paymentOptions: [
      {
        receiverAddress: "0xf26ce9749f29e61c25d0333bce2301cb2dfd3a22",
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
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      openModal();
                    }}
                  >
                    Pay Stream
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
