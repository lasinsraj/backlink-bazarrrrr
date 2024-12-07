import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrderTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer Email</TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Keywords</TableHead>
        <TableHead>Target URL</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Attachment</TableHead>
      </TableRow>
    </TableHeader>
  );
};