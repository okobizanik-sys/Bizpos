export const createBarcode = (
  productId: number,
  colorId: number,
  sizeId: number
) => {
  const productCode = String(productId).padStart(2, "0");
  const colorCode = String(colorId).padStart(2, "0");
  const sizeCode = String(sizeId).padStart(2, "0");
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const timeSuffix = String(Date.now()).slice(-4);
  const newBarcode = `${productCode}${colorCode}${sizeCode}${timeSuffix}${randomDigits}`;

  return newBarcode;
};
