import { InvoiceList } from "@/component";
import React from "react";

const History = () => {
  return (
    <section className="bg-customBackground py-10">
      <div className="appMarginX bg-background rounded-lg p-5 space-y-5">
        <h1 className="text-textColor text-sm md:text-lg lg:text-2xl font-medium">
          History
        </h1>
        <p>
         You can find your saved invoiced here.
        </p>
		  <InvoiceList />
		  </div>
    </section>
  );
};

export default History;
