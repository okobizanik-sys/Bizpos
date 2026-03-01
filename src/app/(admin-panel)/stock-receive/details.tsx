// import React from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { makeProductCode } from "@/utils/helpers";
// import { confirmation } from "@/components/modals/confirm-modal";
// import { useToast } from "@/components/ui/use-toast";
// import { receiveChallanAction } from "./action";

// interface Prop {
//   items: Prisma.ChallanItemGetPayload<{
//     include: { product: true };
//   }>[];
//   status: ChallanStatus;
//   challanId: bigint;
// }

// export const ReceiveDetails: React.FC<Prop> = ({
//   items,
//   status,
//   challanId,
// }) => {
//   const { toast } = useToast();

//   const [sheetOpen, setSheetOpen] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);

//   const handleReceiveChallan = async () => {
//     if (await confirmation("Are you sure you want to receive this challan?")) {
//       setLoading(true);
//       try {
//         const done = await receiveChallanAction(challanId);
//         setSheetOpen(false);
//         if (done) window.location.reload();
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message,
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
//       <SheetTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent
//         className="sm:max-w-[750px] overflow-y-auto"
//         onOpenAutoFocus={(e) => e.preventDefault()}
//       >
//         <SheetHeader>
//           <SheetTitle>Challan Items</SheetTitle>
//         </SheetHeader>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>#</TableHead>
//               <TableHead>Barcode</TableHead>
//               <TableHead>Product ID</TableHead>
//               <TableHead>Product Name</TableHead>
//               <TableHead>Variant</TableHead>
//               <TableHead>Qty</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {items.map((item, index) => (
//               <TableRow key={item.id}>
//                 <TableCell className="py-2">{index + 1}</TableCell>
//                 <TableCell className="py-2">{item.barcode}</TableCell>
//                 <TableCell className="py-2">
//                   {makeProductCode(item.product.id)}
//                 </TableCell>
//                 <TableCell className="py-2">{item.product.name}</TableCell>
//                 <TableCell className="py-2">{item.variant}</TableCell>
//                 <TableCell className="py-2">{item.quantity}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <SheetFooter className="absolute bottom-0 right-0 m-4">
//           <Button
//             disabled={status === ChallanStatus.RECEIVED}
//             variant="default"
//             onClick={handleReceiveChallan}
//             loading={loading}
//           >
//             Receive Stock
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };
