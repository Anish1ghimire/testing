import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trophy, Users, Calendar, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-dark-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 glow-text animate-pulse-neon">
              REPLIX
              <span className="block text-3xl md:text-4xl text-neon-purple mt-2">
                ESPORTS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-light-gray mb-8 max-w-2xl mx-auto">
              Join the ultimate gaming arena. Compete in premier tournaments, 
              showcase your skills, and claim your victory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-neon text-lg px-8 py-4 inline-flex items-center space-x-2">
                <Play size={20} />
                <span>Join Tournament</span>
              </Link>
              <Link to="/games" className="btn-neon-purple text-lg px-8 py-4 inline-flex items-center space-x-2">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-gradient rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-dark-bg" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">100+</h3>
              <p className="text-light-gray">Active Tournaments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-gradient rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-dark-bg" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">5000+</h3>
              <p className="text-light-gray">Registered Players</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-gradient rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-dark-bg" />
              </div>
              <h3 className="text-3xl font-orbitron font-bold text-neon-blue mb-2">24/7</h3>
              <p className="text-light-gray">Gaming Action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4 glow-text">
              Upcoming Tournaments
            </h2>
            <p className="text-light-gray text-lg">
              Don't miss out on these exciting competitions
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-blue"></div>
            </div>
          ) : tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="neon-border rounded-lg p-6 glass-effect hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300">
                  <h3 className="text-xl font-orbitron font-bold text-neon-blue mb-2">
                    {tournament.title}
                  </h3>
                  <p className="text-light-gray mb-4">{tournament.game}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-light-gray">Prize Pool</span>
                    <span className="text-neon-purple font-bold">{tournament.prize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-light-gray">Date</span>
                    <span className="text-white">{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-light-gray">
              <p>No upcoming tournaments at the moment. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/games" className="btn-neon inline-flex items-center space-x-2">
              <span>View All Tournaments</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-orbitron font-bold mb-4 glow-text">
              Featured Games
            </h2>
            <p className="text-light-gray text-lg">
              Compete in your favorite games
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {['Valorant', 'BGMI', 'PUBG', 'FreeFire', 'Minecraft'].map((game, index) => (
              <div
                key={game}
                className="aspect-square neon-border rounded-lg glass-effect flex items-center justify-center hover:shadow-lg hover:shadow-neon-purple/20 transition-all duration-300 cursor-pointer group"
              >
                <span className="font-orbitron font-bold text-white group-hover:text-neon-blue transition-colors duration-300">
                  {game}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;