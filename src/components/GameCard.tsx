import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Play } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    image: string;
    logo: string;
    category: string;
    players: string;
    tournaments: string;
  };
  onGameSelect: (gameId: string) => void;
  onViewTournaments: (gameName: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameSelect, onViewTournaments }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        
        {/* Game Logo */}
        <div className="absolute top-4 left-4">
          <div className="relative">
            <img 
              src={game.logo} 
              alt={`${game.name} logo`}
              className="w-12 h-12 rounded-lg object-cover border-2 border-white/30 bg-white/10 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {game.category}
          </span>
        </div>

        {/* Game Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
            {game.name}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">{game.description}</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center text-gray-400">
              <Users className="w-4 h-4 mr-1 text-blue-400" />
              <span className="text-white font-medium">{game.players}</span>
            </span>
            <span className="flex items-center text-gray-400">
              <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
              <span className="text-white font-medium">{game.tournaments}</span>
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => onViewTournaments(game.name)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium hover:shadow-lg"
          >
            View Tournaments
          </button>
          <button 
            onClick={() => onGameSelect(game.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 hover:shadow-lg"
          >
            <Play className="w-4 h-4" />
            <span>Join Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;