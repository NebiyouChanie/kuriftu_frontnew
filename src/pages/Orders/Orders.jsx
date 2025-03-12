import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";  
import { BASE_URL } from "../../lib/utils";

function Reservation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/orders`);
        const responseJson = await response.json();

        if (!responseJson.data) {
          setData([]);  
        } else {
          setData(responseJson.data);
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const flattenedData = data.map((order) => ({
    ...order,
    name: order.customerInfo?.name || "Unknown",
    lastName: order.customerInfo?.lastName || "Unknown",
    phoneNumber: order.customerInfo?.phoneNumber || "N/A",
    subcity: order.customerInfo?.subcity || "N/A",
    area: order.customerInfo?.area || "N/A",
  }));

  return (
    <div>
      <div className="p-6">
        {loading ? (
          //Skeleton Table  
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((column, index) => (
                  <th key={index} className="p-3 border">
                    <Skeleton className="h-6 w-full" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(15)
                .fill()
                .map((_, rowIndex) => (
                  <tr key={rowIndex} className="border">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-3 border">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <DataTable columns={columns} data={flattenedData} searchKey="name" />
        )}
      </div>
    </div>
  );
}

export default Reservation;
