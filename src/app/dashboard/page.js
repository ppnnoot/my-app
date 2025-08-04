"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomSidebar } from '@/components/sidebar';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  TrendingUp,
  DollarSign,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Truck,
  Star,
  Shield,
  FileText,
  Briefcase
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [driverAssignments, setDriverAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for dashboard
  useEffect(() => {
    setTimeout(() => {
      setBookings([
        {
          id: 'KV-123456',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+66-123-456-789',
          serviceType: 'Hourly Service',
          pickupLocation: 'Bangkok Airport',
          dropoffLocation: 'Sukhumvit Area',
          date: '2024-01-15',
          time: '14:00',
          passengers: 4,
          amount: 2000,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: '2024-01-10T10:30:00Z'
        },
        {
          id: 'KV-123457',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          customerPhone: '+66-987-654-321',
          serviceType: 'Daily Service',
          pickupLocation: 'Suvarnabhumi Airport',
          dropoffLocation: 'Silom Area',
          date: '2024-01-16',
          time: '09:00',
          passengers: 6,
          amount: 8000,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-01-11T14:20:00Z'
        },
        {
          id: 'KV-123458',
          customerName: 'Mike Chen',
          customerEmail: 'mike@example.com',
          customerPhone: '+66-555-123-456',
          serviceType: 'Hourly Service',
          pickupLocation: 'Don Mueang Airport',
          dropoffLocation: 'Chatuchak Area',
          date: '2024-01-17',
          time: '16:30',
          passengers: 3,
          amount: 1500,
          status: 'completed',
          paymentStatus: 'paid',
          createdAt: '2024-01-12T08:45:00Z'
        }
      ]);

      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+66-123-456-789',
          role: 'customer',
          status: 'active',
          joinDate: '2024-01-01'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+66-987-654-321',
          role: 'customer',
          status: 'active',
          joinDate: '2024-01-05'
        },
        {
          id: 3,
          name: 'Mike Chen',
          email: 'mike@example.com',
          phone: '+66-555-123-456',
          role: 'customer',
          status: 'inactive',
          joinDate: '2024-01-10'
        }
      ]);

      setDrivers([
        {
          id: 1,
          name: 'Somchai Srisai',
          phone: '+66-123-456-789',
          license: 'DL-123456',
          status: 'active',
          rating: 4.8,
          totalTrips: 156
        },
        {
          id: 2,
          name: 'Prasert Wong',
          phone: '+66-987-654-321',
          license: 'DL-789012',
          status: 'active',
          rating: 4.9,
          totalTrips: 203
        },
        {
          id: 3,
          name: 'Somsak Lee',
          phone: '+66-555-123-456',
          license: 'DL-345678',
          status: 'offline',
          rating: 4.7,
          totalTrips: 89
        }
      ]);

      setVehicles([
        {
          id: 1,
          plateNumber: 'กข-1234',
          model: 'Toyota Hiace',
          capacity: 12,
          status: 'available',
          lastMaintenance: '2024-01-10'
        },
        {
          id: 2,
          plateNumber: 'กข-5678',
          model: 'Mercedes Sprinter',
          capacity: 15,
          status: 'in-use',
          lastMaintenance: '2024-01-08'
        },
        {
          id: 3,
          plateNumber: 'กข-9012',
          model: 'Ford Transit',
          capacity: 10,
          status: 'maintenance',
          lastMaintenance: '2024-01-15'
        }
      ]);

      setDriverAssignments([
        {
          id: 1,
          driverName: 'Somchai Srisai',
          vehicleModel: 'Toyota Hiace',
          plateNumber: 'กข-1234',
          assignmentDate: '2024-01-15',
          status: 'active',
          currentTrip: 'KV-123456'
        },
        {
          id: 2,
          driverName: 'Prasert Wong',
          vehicleModel: 'Mercedes Sprinter',
          plateNumber: 'กข-5678',
          assignmentDate: '2024-01-14',
          status: 'active',
          currentTrip: 'KV-123457'
        },
        {
          id: 3,
          driverName: 'Somsak Lee',
          vehicleModel: 'Ford Transit',
          plateNumber: 'กข-9012',
          assignmentDate: '2024-01-13',
          status: 'inactive',
          currentTrip: null
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalBookings: 156,
    totalRevenue: 125000,
    pendingBookings: 8,
    completedBookings: 142,
    averageRating: 4.8,
    monthlyGrowth: 12.5
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getUserStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDriverStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-use': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <CustomSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <SidebarInset>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage your {activeTab} and monitor performance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">฿{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingBookings}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}/5.0</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.serviceType} - {booking.date}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Growth</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{stats.monthlyGrowth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Completed Trips</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {stats.completedBookings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {stats.averageRating}/5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Content */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search bookings..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      New Booking
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Booking ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Service</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Payment</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{booking.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{booking.customerEmail}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{booking.serviceType}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-gray-900 dark:text-white">{booking.date}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{booking.time}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">฿{booking.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* Users Content */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search users..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thecla>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Phone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Join Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thecla>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{user.email}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{user.phone}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-gray-900 dark:text-white">{user.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{user.joinDate}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Drivers Content */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search drivers..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Driver
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Driver</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Phone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">License</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rating</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Trips</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((driver) => (
                        <tr key={driver.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{driver.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{driver.phone}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{driver.license}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDriverStatusColor(driver.status)}`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-gray-900 dark:text-white">{driver.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{driver.totalTrips}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Content */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search vehicles..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Vehicle
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Vehicle</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Plate Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Model</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Capacity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Last Maintenance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{vehicle.model}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{vehicle.plateNumber}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{vehicle.model}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{vehicle.capacity} seats</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{vehicle.lastMaintenance}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Driver Assignments Content */}
          {activeTab === 'driver-assignments' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search assignments..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      New Assignment
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Driver</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Vehicle</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Plate Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Assignment Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Current Trip</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverAssignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{assignment.driverName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{assignment.vehicleModel}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{assignment.plateNumber}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">{assignment.assignmentDate}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">
                              {assignment.currentTrip || 'No active trip'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
} 