export const createBarcode = (
  productId: number,
  colorId: number,
  sizeId: number
) => {
  // const lastSerial = await getBarcodeSerial();

  // const newSerialNumber = lastSerial ? Number(lastSerial.serial) + 1 : 100000;
  const productCode = String(productId).padStart(2, "0");
  const colorCode = String(colorId).padStart(2, "0");
  const sizeCode = String(sizeId).padStart(2, "0");
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  const newBarcode = `${productCode}${colorCode}${sizeCode}`;

  // const orderSerial = {
  //   serial: BigInt(newSerialNumber),
  // };
  // await createBarcodeSerial(orderSerial);

  return newBarcode;
};
