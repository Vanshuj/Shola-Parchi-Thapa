import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PaperTexture from '@/components/nostalgia/PaperTexture';
import PencilCursor from '@/components/nostalgia/PencilCursor';
import AmbientSoundPlayer from '@/components/nostalgia/AmbientSoundPlayer';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import LobbyPage from '@/pages/LobbyPage';
import CustomizeParchisPage from '@/pages/CustomizeParchisPage';
import GameTablePage from '@/pages/GameTablePage';
import ResultsPage from '@/pages/ResultsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import SettingsPage from '@/pages/SettingsPage';
import RulesPage from '@/pages/RulesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Baithak3DCanvas from '@/components/nostalgia/Baithak3DCanvas';
export default function App() {
    return (<div className="relative flex min-h-screen flex-col bg-surface text-on-surface transition-colors duration-300">
      <Baithak3DCanvas />
      <PaperTexture />
      <PencilCursor />
      <AmbientSoundPlayer />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="/lobby" element={<ProtectedRoute>
                  <LobbyPage />
                </ProtectedRoute>}/>
            <Route path="/lobby/:code" element={<ProtectedRoute>
                  <LobbyPage />
                </ProtectedRoute>}/>
            <Route path="/dashboard" element={<ProtectedRoute>
                  <LobbyPage />
                </ProtectedRoute>}/>
            <Route path="/customize" element={<ProtectedRoute>
                  <CustomizeParchisPage />
                </ProtectedRoute>}/>
            <Route path="/game/:gameId" element={<ProtectedRoute>
                  <GameTablePage />
                </ProtectedRoute>}/>
            <Route path="/results/:gameId" element={<ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>}/>
            <Route path="/leaderboard" element={<LeaderboardPage />}/>
            <Route path="/rules" element={<RulesPage />}/>
            <Route path="/settings" element={<ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>}/>
            <Route path="*" element={<NotFoundPage />}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </div>);
}
