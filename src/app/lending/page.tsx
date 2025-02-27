import React from "react";
import LendingPool from "./_components/create-pool";
import MintMockWBTC from "./_components/mint";

function PageLending() {
  return (
    <div>
      <LendingPool />
      <MintMockWBTC />
    </div>
  );
}

export default PageLending;
