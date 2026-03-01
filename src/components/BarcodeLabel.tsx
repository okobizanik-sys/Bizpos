import React from "react";
import Barcode from "react-barcode";

export interface BarcodeLabelProps {
  companyName: string;
  productName: string;
  sellingPrice: number;
  mrp?: number;
  barcodeString: string;
  currency?: string;
}

/**
 * A thermal-printer-ready label component.
 * Designed for 50mm × 30mm label stock.
 * Import and use styles/print-label.css on the page that contains this component.
 */
export function BarcodeLabel({
  companyName,
  productName,
  sellingPrice,
  mrp,
  barcodeString,
  currency = "৳",
}: BarcodeLabelProps) {
  return (
    <div className="label-wrapper">
      <div className="label">
        <p className="company">{companyName}</p>
        <p className="product-name">{productName}</p>
        <div className="price-row">
          {mrp !== undefined && mrp > sellingPrice && (
            <span className="mrp">
              {currency}
              {mrp.toFixed(2)}
            </span>
          )}
          <span className="sale">
            SALE: {currency}
            {sellingPrice.toFixed(2)}
          </span>
        </div>
        <Barcode
          value={barcodeString}
          format="CODE128"
          width={1.5}
          height={40}
          fontSize={10}
          displayValue={true}
          margin={0}
        />
      </div>
    </div>
  );
}
