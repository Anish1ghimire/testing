import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Upload, QrCode, CheckCircle, AlertCircle, Trophy, Calendar, Users, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  name: string;
  image: string;
}

interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  entryFee: string;
  maxPlayers: number;
  registeredPlayers: number;
  qrCodeUrl?: string;
}

const Register: React.FC = () => {
  const { gameId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    team: '',
    tournament: '',
    game: '',
    gameId: '',
    playerLevel: 'beginner',
  });
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Default games data
  const defaultGames = [
    {
      id: 'bgmi',
      name: 'BGMI',
      image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      logo: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      logo: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 'freefire',
      name: 'Free Fire',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      logo: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 'valorant',
      name: 'Valorant',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      logo: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 'callofduty',
      name: 'Call of Duty Mobile',
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      logo: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
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
      entryFee: '₹500',
      maxPlayers: 100,
      registeredPlayers: 67,
      qrCodeUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: 'pubg-pro-league',
      title: 'PUBG Mobile Pro League',
      game: 'PUBG Mobile',
      date: '2025-02-20',
      prize: '₹3,00,000',
      entryFee: '₹300',
      maxPlayers: 80,
      registeredPlayers: 45,
      qrCodeUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: 'freefire-masters',
      title: 'Free Fire Masters',
      game: 'Free Fire',
      date: '2025-02-25',
      prize: '₹2,00,000',
      entryFee: '₹200',
      maxPlayers: 60,
      registeredPlayers: 38,
      qrCodeUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: 'valorant-invitational',
      title: 'Valorant Invitational',
      game: 'Valorant',
      date: '2025-03-01',
      prize: '₹4,00,000',
      entryFee: '₹400',
      maxPlayers: 40,
      registeredPlayers: 28,
      qrCodeUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: 'codm-tournament',
      title: 'COD Mobile Championship',
      game: 'Call of Duty Mobile',
      date: '2025-03-05',
      prize: '₹2,50,000',
      entryFee: '₹250',
      maxPlayers: 64,
      registeredPlayers: 41,
      qrCodeUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    fetchGamesAndTournaments();
  }, []);

  useEffect(() => {
    if (gameId && games.length > 0) {
      const selectedGame = games.find(g => g.id === gameId);
      if (selectedGame) {
        setFormData(prev => ({ 
          ...prev, 
          game: selectedGame.name,
          gameId: selectedGame.id 
        }));
      }
    }
  }, [gameId, games]);

  const fetchGamesAndTournaments = async () => {
    try {
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

      setGames(gamesData.length > 0 ? gamesData : defaultGames);
      setTournaments(tournamentsData.length > 0 ? tournamentsData : defaultTournaments);
    } catch (error) {
      console.error('Error fetching data:', error);
      setGames(defaultGames);
      setTournaments(defaultTournaments);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'tournament') {
      const tournament = tournaments.find(t => t.id === value);
      setSelectedTournament(tournament || null);
      if (tournament) {
        setFormData(prev => ({ ...prev, game: tournament.game }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentScreenshot) {
      toast.error('Please upload payment confirmation screenshot');
      return;
    }

    setLoading(true);

    try {
      // Upload payment screenshot
      const paymentRef = ref(storage, `payments/${Date.now()}_${paymentScreenshot.name}`);
      await uploadBytes(paymentRef, paymentScreenshot);
      const paymentUrl = await getDownloadURL(paymentRef);

      // Save registration to Firestore
      await addDoc(collection(db, 'registrations'), {
        ...formData,
        paymentScreenshotUrl: paymentUrl,
        paymentStatus: 'pending',
        registrationDate: new Date().toISOString(),
        createdAt: new Date(),
      });

      toast.success('Registration submitted successfully!');
      setStep(3);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        team: '',
        tournament: '',
        game: '',
        gameId: '',
        playerLevel: 'beginner',
      });
      setPaymentScreenshot(null);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter(t => 
    formData.game ? t.game === formData.game : true
  );

  const selectedGame = games.find(g => g.id === gameId || g.name === formData.game);

  if (step === 3) {
    return (
      <div className="min-h-screen bg-dark-bg text-white pt-16 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-gray-800 rounded-xl p-8">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">
            Your registration has been submitted successfully. We'll verify your payment and notify you within 24 hours.
          </p>
          <div className="space-y-3">
            <Link
              to="/games"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Browse More Tournaments
            </Link>
            <button
              onClick={() => setStep(1)}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Register Another Player
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/games" className="flex items-center text-blue-400 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Tournament Registration
            </h1>
            <p className="text-xl text-gray-200">
              {selectedGame ? `Join ${selectedGame.name} tournaments` : 'Join the competition and showcase your gaming skills'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 rounded ${step >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-gray-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Player Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Team Name</label>
                      <input
                        type="text"
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        placeholder="Enter your team name (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Select Game *</label>
                      <select
                        name="game"
                        value={formData.game}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                        required
                      >
                        <option value="">Choose a game</option>
                        {games.map(game => (
                          <option key={game.id} value={game.name}>{game.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Player Level</label>
                      <select
                        name="playerLevel"
                        value={formData.playerLevel}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="pro">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">Select Tournament *</label>
                    <select
                      name="tournament"
                      value={formData.tournament}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                      required
                      disabled={!formData.game}
                    >
                      <option value="">Choose a tournament</option>
                      {filteredTournaments.map(tournament => (
                        <option key={tournament.id} value={tournament.id}>
                          {tournament.title} - {tournament.prize}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.game || !formData.tournament}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors duration-300 mt-8 font-medium"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>

              {/* Selected Game Info */}
              {selectedGame && (
                <div className="bg-gray-800 rounded-xl p-6 h-fit">
                  <h3 className="text-xl font-bold mb-4 text-center">Selected Game</h3>
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img 
                        src={selectedGame.logo} 
                        alt={`${selectedGame.name} logo`}
                        className="w-16 h-16 rounded-xl object-cover mx-auto border-2 border-blue-500/30"
                      />
                    </div>
                    <img 
                      src={selectedGame.image} 
                      alt={selectedGame.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="text-lg font-bold text-blue-400">{selectedGame.name}</h4>
                    <p className="text-sm text-gray-400 mt-2">Ready to compete?</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedTournament && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div className="bg-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Payment Confirmation</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Payment Screenshot *
                    </label>
                    <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-screenshot"
                        required
                      />
                      <label htmlFor="payment-screenshot" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-300 mb-2">
                          {paymentScreenshot ? paymentScreenshot.name : 'Click to upload payment screenshot'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-yellow-400 font-medium">Important:</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Make sure your payment screenshot is clear and shows the transaction details. 
                          Your registration will be pending until payment is verified by our admin team.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !paymentScreenshot}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-300"
                    >
                      {loading ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tournament Details & QR Code */}
              <div className="space-y-6">
                {/* Tournament Info */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Tournament Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tournament:</span>
                      <span className="font-medium">{selectedTournament.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game:</span>
                      <span className="font-medium">{selectedTournament.game}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="font-bold text-yellow-400">{selectedTournament.prize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="font-bold text-blue-400">{selectedTournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="font-medium">{new Date(selectedTournament.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Slots:</span>
                      <span className="font-medium">{selectedTournament.registeredPlayers}/{selectedTournament.maxPlayers}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Payment QR Code</h3>
                  {selectedTournament.qrCodeUrl ? (
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <img 
                        src={selectedTournament.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                  ) : (
                    <div className="p-8">
                      <QrCode className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">QR Code not available</p>
                    </div>
                  )}
                  <p className="text-gray-400 mt-4 text-sm">
                    Scan this QR code to pay {selectedTournament.entryFee}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;