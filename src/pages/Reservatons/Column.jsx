import { CellAction } from "./CellAction";
import StatusBadge from "@/components/StatusBadge";

export const columns = [
  {
    accessorKey: "customer", 
    header: "Customer Name",
    cell: ({ row }) => row.original.customer?.firstName || "N/A",
  },
  {
    accessorKey: "customer.lastName",
    header: "Last Name",
  },
  {
    accessorKey: "customer.phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "numberOfGuests",
    header: "Guests",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.date);
      if (isNaN(createdDate)) return "Invalid Date";
      const date = createdDate.getDate().toString().padStart(2, "0");
      const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
      const year = createdDate.getFullYear();
      return `${date}-${month}-${year}`;
    }
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        <StatusBadge status={row.original.status}/> 
      </div>
    )
},
  {
    accessorKey: "message",
    header: "Message",
    // cell: ({ row }) => {
    //   const message = row.original.message; //  
    //   return message.length > 50 ? <div>{message.substring(0, 50) + '...'}</div> : <div>{message}</div>;
    // }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
