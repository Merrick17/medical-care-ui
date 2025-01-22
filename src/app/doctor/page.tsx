"use client"
import { useEffect, useState } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Activity, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DoctorDashboard() {
  const { doctorStats, doctorAppointments, fetchDoctorStats, fetchDoctorAppointments } = useStore();
  const user = useStore(state => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user?._id) {
        try {
          await Promise.all([
            fetchDoctorStats(),
            fetchDoctorAppointments()
          ]);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user?._id, fetchDoctorStats, fetchDoctorAppointments]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Total Appointments",
      value: doctorStats?.overview?.totalAppointments || 0,
      icon: Calendar,
      description: "All time appointments"
    },
    {
      title: "Confirmed",
      value: doctorStats?.overview?.confirmedAppointments || 0,
      icon: CheckCircle,
      description: "Confirmed appointments"
    },
    {
      title: "Completed",
      value: doctorStats?.overview?.completedAppointments || 0,
      icon: Activity,
      description: "Completed appointments"
    },
    {
      title: "Cancelled",
      value: doctorStats?.overview?.cancelledAppointments || 0,
      icon: XCircle,
      description: "Cancelled appointments"
    }
  ];

  const statusData = [
    { name: 'Confirmed', value: doctorStats?.overview?.confirmedAppointments || 0 },
    { name: 'Completed', value: doctorStats?.overview?.completedAppointments || 0 },
    { name: 'Cancelled', value: doctorStats?.overview?.cancelledAppointments || 0 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Appointments Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Appointments Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={doctorStats?.graphData?.monthly || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={d => `${d._id.month}/${d._id.year}`}
                  tickFormatter={(value) => format(new Date(2024, parseInt(value.split('/')[0]) - 1), 'MMM yy')}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                <Line type="monotone" dataKey="cancelled" stroke="#ff7f7f" name="Cancelled" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Appointments</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorStats?.graphData?.daily || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={d => `${d._id.day}/${d._id.month}`}
                  tickFormatter={(value) => format(new Date(2024, parseInt(value.split('/')[1]) - 1, parseInt(value.split('/')[0])), 'dd MMM')}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Slot Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Time Slot Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorStats?.graphData?.timeSlotDistribution || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="_id"
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold">{doctorStats?.performanceMetrics?.completionRate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Cancellation Rate</p>
              <p className="text-2xl font-bold">{doctorStats?.performanceMetrics?.cancellationRate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Avg. Appointments/Day</p>
              <p className="text-2xl font-bold">{doctorStats?.performanceMetrics?.averageAppointmentsPerDay}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 