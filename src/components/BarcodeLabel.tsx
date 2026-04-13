"use client";

import React from "react";
import Barcode from "react-barcode";

export interface BarcodeLabelProps {
  companyName: string;
  productName: string;
  sellingPrice: number;
  mrp?: number;
  barcodeString: string;
  currency?: string;
  logoUrl?: string; // ← new optional prop
}

export function BarcodeLabel({
  companyName,
  productName,
  sellingPrice,
  mrp,
  barcodeString,
  currency = "৳",
  logoUrl,
}: BarcodeLabelProps) {
  return (
    <div className="label-wrapper">
      <div className="label">
        {/* Show logo image if provided, otherwise fall back to text */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            style={{
              maxHeight: "12mm",
              maxWidth: "100%",
              objectFit: "contain",
              marginBottom: "1px",
            }}
          />
        ) : (
          <p className="company">{companyName}</p>
        )}

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
