import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL } from "@/lib/utils";

const MostOrderedFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/analytics/top-ordered-foods`)
      .then(res => res.json())
      .then(data => {
        setFoods(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching foods:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Summary Card */}
      <Card className="md:col-span-2 bg-[#fff4f4]">
        <CardHeader>
          <CardTitle className="text-[#F97316] text-base font-bold">Most Ordered Foods</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : foods.length > 0 ? (
            <p className="text-md font-normal text-gray-700">
              The most ordered food is <span className="text-[#F97316]">{foods[0].name}</span> ({foods[0].totalOrdered} orders).
            </p>
          ) : (
            <p>No data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Table View */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Ordered Foods</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <Table>
              <TableHeader className="bg-[#feccaa]">
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foods.map((food, index) => (
                  <TableRow key={index}>
                    <TableCell>{food.name}</TableCell>
                    <TableCell className="text-right">{food.totalOrdered}</TableCell>
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
          <CardTitle>Food Order Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={foods}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalOrdered" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MostOrderedFoods;
