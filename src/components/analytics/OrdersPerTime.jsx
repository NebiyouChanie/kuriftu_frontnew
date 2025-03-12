import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()); // Last 5 years

const OrdersByTimeAndType = () => {
    const [timePeriod, setTimePeriod] = useState("week");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              console.log('Requesting with params:', { timePeriod, selectedMonth, selectedYear });
              
              const response = await axios.get(`${BASE_URL}/analytics/orders-by-time`, {
                  params: { timePeriod, selectedMonth, selectedYear },
              });
  
              console.log('API Response:', response.data);
              setData(response.data);
          } catch (error) {
              console.error('Error fetching orders:', error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchData();
  }, [timePeriod, selectedMonth, selectedYear]);
  
    return (
        <div className="p-4">
            <Card className="md:col-span-2 bg-[#eefff5] mb-4">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#049146]">Order Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-md font-normal text-gray-700">
                    Track the number of orders by week, month, and year.
                    </p>
                </CardContent>
            </Card>
            <div className="flex gap-4 mb-4 items-center">
                <Select onValueChange={setTimePeriod} defaultValue={timePeriod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                </Select>

                {timePeriod === "month" && (
                    <Select onValueChange={setSelectedMonth} defaultValue={selectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {(timePeriod === "month" || timePeriod === "year") && (
                    <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {loading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill=" #16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default OrdersByTimeAndType;