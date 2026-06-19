export interface DashboardKpiResponse {
  totalUsers: number;
  usersGrowthPercentage: number;
  newUsersThisWeek: number;
  dailySales: number;
  salesGrowthPercentage: number;
  onlineSales: number;
  storeSales: number;
  onlineUsers: number;
  totalActiveUsers: number;
  lastRegisteredUser: string;
  todayComplaints: number;
  weeklyComplaints: number;
}

export interface DashboardChartResponse {
  monthlySales: number[];
  monthlyOrders: number[];
}
