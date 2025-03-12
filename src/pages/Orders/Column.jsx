import { CellAction } from "./CellAction";
import StatusBadge from "@/components/StatusBadge";

export const columns = [
  {
    accessorKey: "name",
    header: "First Name",
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "subcity",
    header: "Subcity",
  },
  {
    accessorKey: "area",
    header: "Area",
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <StatusBadge status={row.original.orderStatus} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.createdAt);
      if (isNaN(createdDate)) return "Invalid Date";
      const date = createdDate.getDate().toString().padStart(2, "0");
      const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
      const year = createdDate.getFullYear();
      return `${date}-${month}-${year}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Time",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.createdAt);
      if (isNaN(createdDate)) return "Invalid Date";
      const hour = createdDate.getHours().toString().padStart(2, "0");
      const minute = createdDate.getMinutes().toString().padStart(2, "0");
      return `${hour}${" : "}${minute}`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
