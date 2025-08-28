import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trophy, Users, Calendar, Clock, Star } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
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
}

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>('all');

  // Default games data
  const defaultGames = [
    {
      id: 'bgmi',
      name: 'BGMI',
      description: 'Battlegrounds Mobile India - The ultimate battle royale experience',
      image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Battle Royale'
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      description: 'PlayerUnknown\'s Battlegrounds - Survive and be the last one standing',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Battle Royale'
    },
    {
      id: 'freefire',
      name: 'Free Fire',
      description: 'Fast-paced battle royale game with unique characters and abilities',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Battle Royale'
    },
    {
      id: 'valorant',
      name: 'Valorant',
      description: 'Tactical first-person shooter with unique agent abilities',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'FPS'
    },
    {
      id: 'minecraft',
      name: 'Minecraft',
      description: 'Creative building and survival game with endless possibilities',
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'Sandbox'
    },
    {
      id: 'codm',
      name: 'Call of Duty Mobile',
      description: 'Action-packed mobile FPS with multiple game modes',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      category: 'FPS'
    }
  ];

  // Default tournaments data
  const defaultTournaments = [
    {
      id: 'bgmi-championship',
      title: 'BGMI Championship 2025',
      game: 'BGMI',
      date: '2025-02-15',
      prize: '₹5,00,000',
      status: 'upcoming',
      maxPlayers: 100,
      registeredPlayers: 67
    },
    {
      id: 'pubg-pro-league',
      title: 'PUBG Mobile Pro League',
      game: 'PUBG Mobile',
      date: '2025-02-20',
      prize: '₹3,00,000',
      status: 'upcoming',
      maxPlayers: 80,
      registeredPlayers: 45
    },
    {
      id: 'freefire-masters',
      title: 'Free Fire Masters',
      game: 'Free Fire',
      date: '2025-02-25',
      prize: '₹2,00,000',
      status: 'upcoming',
      maxPlayers: 60,
      registeredPlayers: 38
    },
    {
      id: 'valorant-invitational',
      title: 'Valorant Invitational',
      game: 'Valorant',
      date: '2025-03-01',
      prize: '₹4,00,000',
      status: 'upcoming',
      maxPlayers: 40,
      registeredPlayers: 28
    },
    {
      id: 'codm-tournament',
      title: 'COD Mobile Championship',
      game: 'Call of Duty Mobile',
      date: '2025-03-05',
      prize: '₹2,50,000',
      status: 'upcoming',
      maxPlayers: 64,
      registeredPlayers: 41
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Header */}
      <section className="py-16 bg-dark-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-orbitron font-black mb-4 text-white">
              Games & Tournaments
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Choose your battlefield and compete with the best players in India
            </p>
          </div>
        </div>
      </section>

      {/* Game Filter */}
      <section className="py-8 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {gameCategories.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedGame === game
                    ? 'bg-neon-blue text-white'
                    : 'bg-transparent border border-gray-600 text-gray-300 hover:border-neon-blue hover:text-neon-blue'
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
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 text-white">
            Available Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-card rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-neon-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      {game.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    {game.name}
                  </h3>
                  <p className="text-light-gray mb-4">{game.description}</p>
                  <button 
                    onClick={() => setSelectedGame(game.name)}
                    className="text-neon-blue hover:text-white transition-colors duration-300 font-medium"
                  >
                    View Tournaments →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 text-white">
            {selectedGame === 'all' ? 'All Tournaments' : `${selectedGame} Tournaments`}
          </h2>

          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="game-card rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                        {tournament.title}
                      </h3>
                      <p className="text-light-gray">{tournament.game}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-neon-blue text-white'
                        : tournament.status === 'live'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-neon-blue" />
                      <span className="text-sm text-light-gray">Prize Pool</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neon-blue">{tournament.prize}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neon-blue" />
                      <span className="text-sm text-light-gray">Date</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-sm">
                        {new Date(tournament.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-neon-blue" />
                      <span className="text-sm text-light-gray">Players</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-sm">
                        {tournament.registeredPlayers || 0}/{tournament.maxPlayers}
                      </span>
                    </div>
                  </div>

                  <button className="w-full btn-neon">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-light-gray">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-neon-blue/50" />
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