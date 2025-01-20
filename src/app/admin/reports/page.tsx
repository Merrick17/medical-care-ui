import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon, Activity, Users, Calendar, DollarSign } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center pt-1 space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">12% increase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <div className="flex items-center pt-1 space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">8% increase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,678</div>
            <div className="flex items-center pt-1 space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">15% increase</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="flex items-center pt-1 space-x-2">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">2 new this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Department Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { dept: 'Cardiology', value: 85, color: 'bg-blue-500' },
              { dept: 'Neurology', value: 75, color: 'bg-purple-500' },
              { dept: 'Orthopedics', value: 90, color: 'bg-green-500' },
              { dept: 'Pediatrics', value: 70, color: 'bg-yellow-500' },
            ].map((dept) => (
              <div key={dept.dept} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dept.dept}</span>
                  <span className="text-muted-foreground">{dept.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div 
                    className={`h-full rounded-full ${dept.color}`} 
                    style={{ width: `${dept.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { text: 'New patient registration', time: '2 minutes ago', color: 'bg-green-500' },
                { text: 'Appointment completed', time: '1 hour ago', color: 'bg-blue-500' },
                { text: 'Payment received', time: '3 hours ago', color: 'bg-purple-500' },
                { text: 'New doctor joined', time: '5 hours ago', color: 'bg-yellow-500' },
                { text: 'System update completed', time: '1 day ago', color: 'bg-pink-500' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-2 h-2 ${activity.color} rounded-full`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 