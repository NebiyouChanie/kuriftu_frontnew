import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // ShadCN Select components
import { BASE_URL } from "@/lib/utils";

const TopLoyalCustomers = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [topN, setTopN] = useState(5);   
  const [loading, setLoading] = useState(false);

  const fetchTopLoyalCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/analytics/top-loyal-customers?topN=${topN}`);
      const data = await response.json();

      if (data.success) {
        setTopCustomers(data.data);
      } else {
        setTopCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching top loyal customers:", error);
      setTopCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLoyalCustomers();
  }, [topN]);  // Fetch again whenever 'topN' changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card className="bg-blue-100 mb-4">
        <CardHeader >
          <CardTitle className="text-blue-700 text-base font-bold">Top Loyal Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="block text-md font-normal text-gray-700">Select Top N Customers</p>
        </CardContent>
        </Card>
          {/* Customers Table */}
        <Card className="pt-6"> 
        <CardContent>
          {/* Dropdown to select top N customers */}
          <div className="mb-4">
            <Select onValueChange={(value) => setTopN(parseInt(value))} defaultValue={topN.toString()}>
              <SelectTrigger className="w-40 px-4 py-2 border rounded-md">
                <SelectValue placeholder="Select Top N" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="20">Top 20</SelectItem>
                <SelectItem value="50">Top 50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table className="w-1/2">
            <TableHeader>
              <TableRow className="bg-blue-200">
                <TableHead>Customer Name</TableHead>
                <TableHead className="text-right">Total Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{customer?.firstName}{" "}{customer?.lastName
                  }</TableCell>
                  <TableCell className="text-right">{customer.totalOrders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopLoyalCustomers;
