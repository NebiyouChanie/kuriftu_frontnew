import { CellAction } from "./CellAction";

export const columns = [
  {
    accessorKey: "firstName", 
    header: "First Name",
    cell: ({ row }) => row.original.firstName || "N/A", // Using firstName directly
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "Since",
    header: "Created At",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.createdAt);
      if (isNaN(createdDate)) return "Invalid Date";
      const date = createdDate.getDate().toString().padStart(2, "0");
      const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
      const year = createdDate.getFullYear();
      return `${date}-${month}-${year}`;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
