import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  Users, 
  Trophy, 
  GamepadIcon, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalPlayers: number;
  totalTournaments: number;
  totalGames: number;
  pendingPayments: number;
  verifiedPayments: number;
  upcomingTournaments: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlayers: 0,
    totalTournaments: 0,
    totalGames: 0,
    pendingPayments: 0,
    verifiedPayments: 0,
    upcomingTournaments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch registrations
      const registrationsSnapshot = await getDocs(collection(db, 'registrations'));
      const registrations = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch tournaments
      const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'));
      const tournaments = tournamentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch games
      const gamesSnapshot = await getDocs(collection(db, 'games'));
      const games = gamesSnapshot.docs;

      // Calculate stats
      const pendingPayments = registrations.filter(r => r.paymentStatus === 'pending').length;
      const verifiedPayments = registrations.filter(r => r.paymentStatus === 'verified').length;
      const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').length;

      // Get recent registrations (last 5)
      const recent = registrations
        .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
                      new Date(a.createdAt?.toDate?.() || a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalPlayers: registrations.length,
        totalTournaments: tournaments.length,
        totalGames: games.length,
        pendingPayments,
        verifiedPayments,
        upcomingTournaments,
      });

      setRecentRegistrations(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Players',
      value: stats.totalPlayers,
      icon: Users,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/10',
      borderColor: 'border-neon-blue/30',
    },
    {
      title: 'Active Tournaments',
      value: stats.totalTournaments,
      icon: Trophy,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30',
    },
    {
      title: 'Games Available',
      value: stats.totalGames,
      icon: GamepadIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingTournaments,
      icon: Calendar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/30',
    },
    {
      title: 'Verified Payments',
      value: stats.verifiedPayments,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron font-bold mb-2 text-white">
            Admin Dashboard
          </h1>
          <p className="text-light-gray">
            Welcome back! Here's what's happening with your tournaments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 glass-effect hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-gray text-sm mb-1">{stat.title}</p>
                  <p className={`text-3xl font-orbitron font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="game-card rounded-lg p-6">
            <h2 className="text-2xl font-orbitron font-bold mb-6 text-white">
              Recent Registrations
            </h2>
            
            {recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {recentRegistrations.map((reg, index) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-4 bg-dark-gray rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{reg.name}</p>
                      <p className="text-sm text-light-gray">{reg.game} - {reg.tournament}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reg.paymentStatus === 'verified'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {reg.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-light-gray text-center py-8">
                No registrations yet
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="game-card rounded-lg p-6">
            <h2 className="text-2xl font-orbitron font-bold mb-6 text-white">
              Quick Actions
            </h2>
            
            <div className="space-y-4">
              <button className="w-full btn-neon text-left px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5" />
                  <span>Add New Tournament</span>
                </div>
              </button>
              
              <button className="w-full btn-neon-purple text-left px-4 py-3">
                <div className="flex items-center space-x-3">
                  <GamepadIcon className="w-5 h-5" />
                  <span>Manage Games</span>
                </div>
              </button>
              
              <button className="w-full bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 text-left px-4 py-3 rounded-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify Payments</span>
                </div>
              </button>
              
              <button className="w-full bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/30 text-left px-4 py-3 rounded-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5" />
                  <span>View Analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;