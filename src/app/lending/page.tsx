import React from "react";
import LendingPool from "./_components/create-pool";
import USDCBalance from "@/hooks/useTokenBalance";

function PageLending() {
  return (
    <div>
      <LendingPool />
    </div>
  );
}

export default PageLending;
