import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL } from "@/lib/utils";

const TopLocations = () => {
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/analytics/most-ordered-locations`);
        const responseJson = await response.json();

        if (responseJson.success) {
          setTableData(responseJson.data.tableData);
          setChartData(responseJson.data.chartData);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Summary Card */}
      <Card className="md:col-span-2 bg-[#f1f3fc]">
        <CardHeader>
          <CardTitle className="text-base font-bold text-[#8884d8]">Most Ordered Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : tableData.length > 0 ? (
            <p className="text-md font-normal text-gray-700">
              Most orders come from <span className="text-[#8884d8]">{tableData[0].subcity}</span> ({tableData[0].area}).
            </p>
          ) : (
            <p className="text-gray-600">No data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#d1d6f4] text-gray-700">
                  <TableHead>Subcity</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((loc, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-800">{loc.subcity}</TableCell>
                    <TableCell className="text-gray-700">{loc.area}</TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">{loc.totalOrders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Order Distribution by Subcity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="subcity" tick={{ fill: "#4B5563" }} />
                <YAxis tick={{ fill: "#4B5563" }} />
                <Tooltip />
                <Bar dataKey="totalOrders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopLocations;