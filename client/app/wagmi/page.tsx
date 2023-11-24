import React from "react";
import { WriteContract } from "@/wagmi/MintToken";

const page = () => {
  return (
    <div className="flex justify-center max-w-[1000px] h-[100vh] items-center">
      <WriteContract />
    </div>
  );
};

export default page;
