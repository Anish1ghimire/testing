import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trophy, Users, Calendar, Clock, Star, Play, ArrowRight } from 'lucide-react';
import GameCard from '../components/GameCard';

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
  category: string;
  players: string;
  tournaments: string;
}

interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  status: string;
  maxPlayers: number;
  registeredPlayers: number;
  entryFee: string;
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const navigate = useNavigate();

  // Enhanced games data with more details
  const defaultGames = [
    {
      id: 'bgmi',
      name: 'BGMI',
      description: 'Battlegrounds Mobile India - The ultimate battle royale experience with 100 players fighting for survival',
      image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'Battle Royale',
      players: '2.5M+',
      tournaments: '15 Active'
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      description: 'PlayerUnknown\'s Battlegrounds - Survive and be the last one standing in this intense battle royale',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'Battle Royale',
      players: '3.2M+',
      tournaments: '12 Active'
    },
    {
      id: 'freefire',
      name: 'Free Fire',
      description: 'Fast-paced 10-minute battle royale game with unique characters and special abilities',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'Battle Royale',
      players: '1.8M+',
      tournaments: '8 Active'
    },
    {
      id: 'valorant',
      name: 'Valorant',
      description: 'Tactical 5v5 first-person shooter with unique agent abilities and strategic gameplay',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'FPS',
      players: '1.2M+',
      tournaments: '6 Active'
    },
    {
      id: 'codm',
      name: 'Call of Duty Mobile',
      description: 'Action-packed mobile FPS with multiple game modes including Battle Royale and Multiplayer',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'FPS',
      players: '900K+',
      tournaments: '5 Active'
    },
    {
      id: 'minecraft',
      name: 'Minecraft',
      description: 'Creative building and survival game with endless possibilities and competitive building contests',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      logo: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      category: 'Sandbox',
      players: '500K+',
      tournaments: '3 Active'
    }
  ];

  // Enhanced tournaments data
  const defaultTournaments = [
    {
      id: 'bgmi-championship',
      title: 'BGMI Championship 2025',
      game: 'BGMI',
      date: '2025-02-15',
      prize: '₹5,00,000',
      status: 'upcoming',
      maxPlayers: 100,
      registeredPlayers: 67,
      entryFee: '₹500'
    },
    {
      id: 'pubg-pro-league',
      title: 'PUBG Mobile Pro League',
      game: 'PUBG Mobile',
      date: '2025-02-20',
      prize: '₹3,00,000',
      status: 'upcoming',
      maxPlayers: 80,
      registeredPlayers: 45,
      entryFee: '₹300'
    },
    {
      id: 'freefire-masters',
      title: 'Free Fire Masters',
      game: 'Free Fire',
      date: '2025-02-25',
      prize: '₹2,00,000',
      status: 'upcoming',
      maxPlayers: 60,
      registeredPlayers: 38,
      entryFee: '₹200'
    },
    {
      id: 'valorant-invitational',
      title: 'Valorant Invitational',
      game: 'Valorant',
      date: '2025-03-01',
      prize: '₹4,00,000',
      status: 'upcoming',
      maxPlayers: 40,
      registeredPlayers: 28,
      entryFee: '₹400'
    },
    {
      id: 'codm-tournament',
      title: 'COD Mobile Championship',
      game: 'Call of Duty Mobile',
      date: '2025-03-05',
      prize: '₹2,50,000',
      status: 'upcoming',
      maxPlayers: 64,
      registeredPlayers: 41,
      entryFee: '₹250'
    },
    {
      id: 'minecraft-build',
      title: 'Minecraft Build Battle',
      game: 'Minecraft',
      date: '2025-03-10',
      prize: '₹1,00,000',
      status: 'upcoming',
      maxPlayers: 32,
      registeredPlayers: 15,
      entryFee: '₹150'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from Firebase, fallback to default data
        const gamesSnapshot = await getDocs(collection(db, 'games'));
        const gamesData = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];

        const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'));
        const tournamentsData = tournamentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tournament[];

        // Use Firebase data if available, otherwise use default data
        setGames(gamesData.length > 0 ? gamesData : defaultGames);
        setTournaments(tournamentsData.length > 0 ? tournamentsData : defaultTournaments);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use default data on error
        setGames(defaultGames);
        setTournaments(defaultTournaments);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTournaments = selectedGame === 'all' 
    ? tournaments 
    : tournaments.filter(t => t.game.toLowerCase() === selectedGame.toLowerCase());

  const gameCategories = ['all', ...Array.from(new Set(games.map(g => g.name)))];

  const handleGameSelect = (gameId: string) => {
    navigate(`/register/${gameId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Choose Your <span className="text-blue-400">Battlefield</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Compete in India's most popular games and win amazing prizes. 
            Join thousands of players in epic tournaments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold text-blue-400">50+</span>
              <p className="text-sm text-gray-300">Active Tournaments</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold text-green-400">₹50L+</span>
              <p className="text-sm text-gray-300">Total Prize Pool</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold text-purple-400">10K+</span>
              <p className="text-sm text-gray-300">Active Players</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Filter */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {gameCategories.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedGame === game
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {game === 'all' ? 'All Games' : game}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Available Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onGameSelect={handleGameSelect}
                onViewTournaments={setSelectedGame}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {selectedGame === 'all' ? 'All Tournaments' : `${selectedGame} Tournaments`}
            </h2>
            <p className="text-gray-400 text-lg">
              Join these exciting tournaments and compete for amazing prizes
            </p>
          </div>

          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-gray-800 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {tournament.title}
                      </h3>
                      <p className="text-blue-400 font-medium">{tournament.game}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-green-600 text-white'
                        : tournament.status === 'live'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">Prize Pool</span>
                      </div>
                      <span className="font-bold text-yellow-400 text-lg">{tournament.prize}</span>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Date</span>
                      </div>
                      <span className="text-white font-medium">
                        {new Date(tournament.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Players</span>
                      </div>
                      <span className="text-white font-medium">
                        {tournament.registeredPlayers}/{tournament.maxPlayers}
                      </span>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">Entry Fee</span>
                      </div>
                      <span className="text-purple-400 font-bold">{tournament.entryFee}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link 
                      to={`/register/${tournament.game.toLowerCase().replace(' ', '')}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 text-center font-medium flex items-center justify-center space-x-2"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg">No tournaments available for {selectedGame === 'all' ? 'any games' : selectedGame}</p>
              <p className="text-sm">Check back soon for new tournaments!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Games;