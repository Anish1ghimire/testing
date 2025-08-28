import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trophy, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  status: string;
}

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const q = query(
          collection(db, 'tournaments'),
          where('status', '==', 'upcoming'),
          orderBy('date', 'asc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const tournamentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tournament[];
        
        setTournaments(tournamentData);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const featuredGames = [
    {
      name: 'BGMI',
      image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      players: '2.5M+',
      tournaments: '15 Active'
    },
    {
      name: 'PUBG Mobile',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      players: '3.2M+',
      tournaments: '12 Active'
    },
    {
      name: 'Free Fire',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      players: '1.8M+',
      tournaments: '8 Active'
    },
    {
      name: 'Valorant',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      players: '1.2M+',
      tournaments: '6 Active'
    }
  ];

  const upcomingEvents = [
    {
      title: 'BGMI Championship 2025',
      date: '2025-02-15',
      prize: '₹5,00,000',
      image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      title: 'PUBG Mobile Pro League',
      date: '2025-02-20',
      prize: '₹3,00,000',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      title: 'Free Fire Masters',
      date: '2025-02-25',
      prize: '₹2,00,000',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden hero-banner min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 text-white">
              REPLIX
              <span className="block text-3xl md:text-4xl text-neon-blue mt-2">
                ESPORTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
              India's Premier Gaming Tournament Platform. Compete with the best, 
              win amazing prizes, and become a champion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-neon text-lg px-8 py-4 inline-flex items-center justify-center space-x-2">
                <Play size={20} />
                <span>Join Tournament</span>
              </Link>
              <Link to="/games" className="btn-neon-purple text-lg px-8 py-4 inline-flex items-center justify-center space-x-2">
                <Trophy size={20} />
                <span>View Games</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">50+</h3>
              <p className="text-light-gray">Active Tournaments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">10K+</h3>
              <p className="text-light-gray">Registered Players</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">₹50L+</h3>
              <p className="text-light-gray">Prize Pool</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">24/7</h3>
              <p className="text-light-gray">Gaming Action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4 text-white">
              Featured Games
            </h2>
            <p className="text-light-gray text-lg">
              Compete in India's most popular mobile games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredGames.map((game, index) => (
              <div
                key={game.name}
                className="game-card rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                      {game.name}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>{game.players} Players</span>
                      <span>{game.tournaments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4 text-white">
              Upcoming Events
            </h2>
            <p className="text-light-gray text-lg">
              Don't miss these exciting tournaments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="game-card rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-neon-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      Upcoming
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    {event.title}
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-light-gray">Prize Pool</span>
                    <span className="text-neon-blue font-bold">{event.prize}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-light-gray">Date</span>
                    <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <Link to="/register" className="w-full btn-neon text-center block">
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/games" className="btn-neon inline-flex items-center space-x-2">
              <span>View All Tournaments</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4 text-white">
              Why Choose Replix Esports?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4">Fair Play</h3>
              <p className="text-light-gray">
                Anti-cheat systems and fair play policies ensure competitive integrity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4">Community</h3>
              <p className="text-light-gray">
                Join thousands of gamers in India's fastest growing esports community
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-4">Rewards</h3>
              <p className="text-light-gray">
                Win cash prizes, gaming gear, and exclusive merchandise
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;