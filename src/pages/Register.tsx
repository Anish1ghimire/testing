import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Upload, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  name: string;
}

interface Tournament {
  id: string;
  title: string;
  game: string;
  qrCodeUrl?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team: '',
    tournament: '',
    game: '',
  });
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchGamesAndTournaments();
  }, []);

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

      setGames(gamesData);
      setTournaments(tournamentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load games and tournaments');
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
        team: '',
        tournament: '',
        game: '',
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

  if (step === 3) {
    return (
      <div className="min-h-screen bg-dark-bg text-white pt-16 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl font-orbitron font-bold mb-4">Registration Successful!</h2>
          <p className="text-light-gray mb-6">
            Your registration has been submitted. We'll verify your payment and notify you soon.
          </p>
          <button
            onClick={() => setStep(1)}
            className="btn-neon"
          >
            Register Another Player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-orbitron font-bold mb-4 glow-text">
              Tournament Registration
            </h1>
            <p className="text-light-gray">
              Join the competition and showcase your gaming skills
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-neon-blue text-dark-bg' : 'bg-dark-gray text-light-gray'
              }`}>
                1
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-neon-blue' : 'bg-dark-gray'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-neon-blue text-dark-bg' : 'bg-dark-gray text-light-gray'
              }`}>
                2
              </div>
              <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-neon-blue' : 'bg-dark-gray'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-green-400 text-dark-bg' : 'bg-dark-gray text-light-gray'
              }`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="neon-border rounded-lg p-8 glass-effect">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-center">Player Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full input-neon"
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
                    className="w-full input-neon"
                    placeholder="Enter your email"
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
                    className="w-full input-neon"
                    placeholder="Enter your team name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Game *</label>
                  <select
                    name="game"
                    value={formData.game}
                    onChange={handleInputChange}
                    className="w-full input-neon"
                    required
                  >
                    <option value="">Choose a game</option>
                    {games.map(game => (
                      <option key={game.id} value={game.name}>{game.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Tournament *</label>
                  <select
                    name="tournament"
                    value={formData.tournament}
                    onChange={handleInputChange}
                    className="w-full input-neon"
                    required
                    disabled={!formData.game}
                  >
                    <option value="">Choose a tournament</option>
                    {filteredTournaments.map(tournament => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.game || !formData.tournament}
                className="w-full btn-neon mt-8"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 2 && selectedTournament && (
            <div className="neon-border rounded-lg p-8 glass-effect">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-center">Payment Confirmation</h2>
              
              {selectedTournament.qrCodeUrl ? (
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img 
                      src={selectedTournament.qrCodeUrl} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-light-gray mt-4">
                    Scan this QR code to make payment for {selectedTournament.title}
                  </p>
                </div>
              ) : (
                <div className="text-center mb-8">
                  <QrCode className="w-24 h-24 text-neon-blue mx-auto mb-4" />
                  <p className="text-light-gray">QR Code not available for this tournament</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Payment Screenshot *
                  </label>
                  <div className="border-2 border-dashed border-neon-blue/30 rounded-lg p-6 text-center hover:border-neon-blue/50 transition-colors duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-screenshot"
                      required
                    />
                    <label htmlFor="payment-screenshot" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                      <p className="text-light-gray">
                        {paymentScreenshot ? paymentScreenshot.name : 'Click to upload payment screenshot'}
                      </p>
                      <p className="text-sm text-light-gray/60 mt-1">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </label>
                  </div>
                </div>

                <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-neon-purple font-medium">Important:</p>
                      <p className="text-sm text-light-gray mt-1">
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
                    className="flex-1 bg-dark-gray border border-light-gray/30 text-white px-6 py-3 rounded-lg hover:bg-light-gray/10 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !paymentScreenshot}
                    className="flex-1 btn-neon"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;