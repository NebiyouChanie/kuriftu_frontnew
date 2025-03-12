import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";  
import { BASE_URL } from "../../lib/utils";

function Customers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        const responseJson = await response.json();

        if (!responseJson.data) {
          setData([]); // Fallback
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
          <DataTable columns={columns} data={data} searchKey="firstName" />
        )}
      </div>
    </div>
  );
}

export default Customers;

 