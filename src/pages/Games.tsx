import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trophy, Users, Calendar, Clock } from 'lucide-react';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch games
        const gamesSnapshot = await getDocs(collection(db, 'games'));
        const gamesData = gamesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Game[];

        // Fetch tournaments
        const tournamentsSnapshot = await getDocs(collection(db, 'tournaments'));
        const tournamentsData = tournamentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tournament[];

        setGames(gamesData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
            <h1 className="text-5xl font-orbitron font-black mb-4 glow-text">
              Games & Tournaments
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Choose your battlefield and compete with the best players worldwide
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
                    ? 'bg-neon-blue text-dark-bg shadow-lg shadow-neon-blue/50'
                    : 'bg-transparent border border-neon-blue/30 text-neon-blue hover:border-neon-blue'
                }`}
              >
                {game === 'all' ? 'All Games' : game}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      {games.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-orbitron font-bold text-center mb-12 glow-text">
              Available Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="neon-border rounded-lg overflow-hidden glass-effect hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                    <h3 className="text-2xl font-orbitron font-bold text-white">
                      {game.name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-light-gray mb-4">{game.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neon-purple font-medium">
                        {game.category}
                      </span>
                      <button className="text-neon-blue hover:text-white transition-colors duration-300">
                        View Tournaments →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tournaments */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 glow-text">
            {selectedGame === 'all' ? 'All Tournaments' : `${selectedGame} Tournaments`}
          </h2>

          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="neon-border rounded-lg p-6 glass-effect hover:shadow-lg hover:shadow-neon-purple/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-orbitron font-bold text-neon-blue mb-2">
                        {tournament.title}
                      </h3>
                      <p className="text-light-gray">{tournament.game}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-neon-blue/20 text-neon-blue'
                        : tournament.status === 'live'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm text-light-gray">Prize Pool</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neon-purple">{tournament.prize}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neon-purple" />
                      <span className="text-sm text-light-gray">Date</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-sm">
                        {new Date(tournament.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-neon-purple" />
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