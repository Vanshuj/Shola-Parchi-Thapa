import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useRoomStore } from '@/store/roomStore';
import { useLabelStore } from '@/store/labelStore';
import { usePreferenceStore } from '@/store/preferenceStore';
import { roomApi } from '@/api/roomApi';
import axiosClient from '@/api/axiosClient';
import GameLobby from '@/components/game/GameLobby';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import Icon from '@/components/common/Icon';
export default function LobbyPage() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { userId, username } = useAuth();
    const { room, setRoom, clear: clearRoom } = useRoomStore();
    const { labels, fetch: fetchLabels } = useLabelStore();
    const defaultPrivacy = usePreferenceStore((s) => s.preferences.defaultRoomPrivacy ?? 'private');
    const [userProfile, setUserProfile] = useState(null);
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [roomError, setRoomError] = useState(null);
    const [joinError, setJoinError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [isPrivate, setIsPrivate] = useState(defaultPrivacy === 'private');
    const { register, handleSubmit, reset: resetJoinForm } = useForm();
    // Load user profile and custom parchis
    useEffect(() => {
        axiosClient
            .get('/users/me')
            .then((r) => setUserProfile(r.data))
            .catch((err) => console.error('Could not fetch user profile:', err));
        if (!labels) {
            fetchLabels();
        }
    }, [fetchLabels, labels]);
    // Sync room data if code is present in URL
    const refreshRoom = useCallback(async () => {
        if (!code)
            return;
        try {
            const res = await roomApi.get(code);
            setRoom(res);
            setRoomError(null);
            if (res.status === 'ACTIVE' && res.gameId) {
                navigate(`/game/${res.gameId}`);
            }
        }
        catch (err) {
            console.error('Failed to get room:', err);
            setRoomError(err?.response?.data?.message ?? 'Baithak room not found or has expired.');
        }
        finally {
            setLoadingRoom(false);
        }
    }, [code, navigate, setRoom]);
    useEffect(() => {
        if (code) {
            setLoadingRoom(true);
            // Ensure the visiting player is seated in the room
            roomApi.join(code).catch(() => {}).finally(() => {
                refreshRoom();
            });
            const interval = setInterval(refreshRoom, 2000);
            return () => clearInterval(interval);
        }
        else {
            clearRoom();
        }
    }, [code, refreshRoom, clearRoom]);
    async function handleCreateRoom() {
        setCreating(true);
        setJoinError(null);
        try {
            const newRoom = await roomApi.create(4, isPrivate);
            setRoom(newRoom);
            navigate(`/lobby/${newRoom.roomCode}`);
        }
        catch (err) {
            setJoinError(err?.response?.data?.message ?? 'Failed to create room. Please try again.');
        }
        finally {
            setCreating(false);
        }
    }
    async function handleJoinRoom(values) {
        const rawCode = values.code.trim().toUpperCase();
        if (!rawCode)
            return;
        setJoinError(null);
        try {
            const joinedRoom = await roomApi.join(rawCode);
            setRoom(joinedRoom);
            resetJoinForm();
            navigate(`/lobby/${rawCode}`);
        }
        catch (err) {
            setJoinError(err?.response?.data?.message ?? 'Could not join room. Check the code and try again.');
        }
    }
    async function handleStartGame() {
        if (!code)
            return;
        try {
            const { gameId } = await roomApi.start(code);
            navigate(`/game/${gameId}`);
        }
        catch (err) {
            setRoomError(err?.response?.data?.message ?? 'Could not start game. Need at least 2 players.');
        }
    }
    async function handleLeaveRoom() {
        if (code) {
            try {
                await roomApi.leave(code);
            }
            catch (err) {
                console.warn('Error leaving room:', err);
            }
        }
        clearRoom();
        navigate('/lobby');
    }
    // --- Active Room Lobby View ---
    if (code) {
        if (loadingRoom && !room) {
            return (<div className="max-w-4xl mx-auto px-space-md py-space-xl text-center">
          <Loader label="Opening Baithak doors…"/>
        </div>);
        }
        if (roomError) {
            return (<div className="max-w-xl mx-auto px-space-md py-space-xl text-center">
          <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-lg border border-outline-variant">
            <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-space-md">
              <Icon name="meeting_room" size={32}/>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              Room Unavailable
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              {roomError}
            </p>
            <Button onClick={() => navigate('/lobby')} variant="primary">
              <Icon name="arrow_back" size={18}/> Return to Lobby Hub
            </Button>
          </div>
        </div>);
        }
        if (room) {
            return (<div className="max-w-5xl mx-auto px-space-md lg:px-margin py-space-lg">
          {/* Breadcrumb / Top Bar */}
          <div className="mb-space-md flex items-center justify-between">
            <button type="button" onClick={handleLeaveRoom} className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="arrow_back" size={18}/> Back to Lobby Hub
            </button>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
              Solah Parchi Baithak Table
            </span>
          </div>

          <GameLobby room={room} isHost={room.hostUserId === userId} onStart={handleStartGame} onLeave={handleLeaveRoom}/>

          {/* Quick Deck Preview Banner */}
          {labels && (<div className="mt-space-lg rounded-xl bg-surface-container-low border border-outline-variant p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                  <Icon name="style" size={20}/>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm font-bold text-on-surface block">
                    Your Parchis for this Match
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {Object.values(labels).join(' • ')}
                  </span>
                </div>
              </div>
              <Link to="/customize" className="px-space-md py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold transition-colors flex items-center gap-1">
                <Icon name="edit" size={14}/> Edit Parchis
              </Link>
            </div>)}
        </div>);
        }
    }
    // --- Main Unified Lobby & Dashboard Hub ---
    const wins = userProfile?.wins ?? 0;
    const losses = userProfile?.losses ?? 0;
    const totalGames = wins + losses;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    return (<div className="max-w-6xl mx-auto px-space-md lg:px-margin py-space-xl">
      {/* Header Profile Section */}
      <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-space-lg lg:p-space-xl shadow-sm mb-space-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-display-md text-headline-lg flex items-center justify-center font-bold shadow-md ring-4 ring-primary-container">
              {username ? username.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="inline-block px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] uppercase font-bold tracking-wider">
                  Baithak Player
                </span>
                <span className="text-secondary font-bold text-label-sm">&bull; Solah Parchi</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-0.5">
                Namaste, {username || 'Khiladi'}!
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Welcome to your game parlor. Host a room, enter with a code, or sharpen your chits.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-space-sm sm:gap-space-md bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-inner">
            <div className="text-center px-space-xs">
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-bold flex items-center justify-center gap-1">
                <Icon name="military_tech" size={14} className="text-secondary"/> Elo
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-primary block mt-0.5">
                {userProfile ? userProfile.eloRating : '1000'}
              </span>
            </div>
            <div className="text-center px-space-xs border-x border-outline-variant">
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-bold block">
                Win Rate
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-secondary block mt-0.5">
                {winRate}%
              </span>
            </div>
            <div className="text-center px-space-xs">
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-bold block">
                Record
              </span>
              <span className="font-headline-sm text-title-md font-bold text-on-surface block mt-0.5">
                {wins}W / {losses}L
              </span>
            </div>
          </div>
        </div>
      </div>

      {joinError && (<div className="mb-space-lg rounded-xl bg-error-container text-on-error-container px-space-md py-space-sm flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <Icon name="error" size={20}/>
            <span className="font-body-md text-body-md font-medium">{joinError}</span>
          </div>
          <button type="button" onClick={() => setJoinError(null)} className="font-bold text-label-sm underline">
            Dismiss
          </button>
        </div>)}

      {/* Main Room Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-xl">
        {/* Card 1: Start a New Baithak */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-space-lg shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                <Icon name="chair" size={26}/>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-secondary font-bold">
                Standard 4-Player
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              Start a New Baithak
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Create a fresh 4-player game table. Invite your family or friends by sharing the 4-digit room passcode.
            </p>

            <div className="rounded-xl bg-surface-container-lowest p-space-sm mb-space-md flex items-center justify-between border border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                <Icon name={isPrivate ? "lock" : "public"} size={18} className="text-secondary"/>
                Room Privacy:
              </span>
              <div className="flex gap-1">
                <button type="button" onClick={() => setIsPrivate(true)} className={`px-space-sm py-1 rounded-lg text-label-sm font-bold transition-colors ${isPrivate
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  Private (Code)
                </button>
                <button type="button" onClick={() => setIsPrivate(false)} className={`px-space-sm py-1 rounded-lg text-label-sm font-bold transition-colors ${!isPrivate
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  Public
                </button>
              </div>
            </div>
          </div>

          <Button onClick={handleCreateRoom} disabled={creating} className="w-full flex items-center justify-center gap-space-xs py-3">
            <Icon name="add_circle" size={20}/>
            {creating ? 'Setting up Table…' : 'Create Baithak Room'}
          </Button>
        </div>

        {/* Card 2: Join with Passcode */}
        <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-space-lg shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                <Icon name="key" size={26}/>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-secondary font-bold">
                Instant Entry
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              Join with Passcode
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
              Got a passcode from a friend via WhatsApp or chat? Enter the room code below to take your seat at the carpet.
            </p>

            <form onSubmit={handleSubmit(handleJoinRoom)} className="space-y-space-md">
              <Input aria-label="Room code" placeholder="e.g. ABC123" {...register('code')} className="text-center font-mono font-bold tracking-widest text-title-md uppercase py-2.5"/>
              <Button type="submit" variant="secondary" className="w-full flex items-center justify-center gap-space-xs py-3">
                <Icon name="login" size={20}/> Join Baithak Table
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Secondary Cards: Custom Parchis Preview & Game Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Parchis Preview Card */}
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-space-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-bold text-secondary flex items-center gap-1">
                <Icon name="stylus_note" size={16}/> Stationery Guild
              </span>
              <span className="text-[11px] text-on-surface-variant">4 Identities</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface mb-1">
              Your Customized Parchis
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Chit titles are 100% private to your screen. Opponents only see numbered folded paper.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mb-space-md">
              {labels ? (Object.entries(labels).map(([k, val], i) => (<div key={k} className="rounded-lg bg-surface-container-low p-space-xs text-center border border-outline-variant/60">
                    <span className="text-[10px] text-secondary font-bold block uppercase">
                      Suit {i + 1}
                    </span>
                    <span className="font-label-md text-label-sm text-primary font-bold truncate block">
                      {val}
                    </span>
                  </div>))) : (<div className="col-span-4 text-center py-2 text-on-surface-variant font-body-sm">
                  Loading deck labels…
                </div>)}
            </div>
          </div>
          <Link to="/customize" className="inline-flex items-center justify-center gap-1 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors">
            <Icon name="palette" size={16}/> Customize Chit Labels
          </Link>
        </div>

        {/* Rules & Help Card */}
        <div className="rounded-xl bg-surface-container-lowest border border-outline-variant p-space-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-sm text-label-sm uppercase font-bold text-secondary flex items-center gap-1">
                <Icon name="menu_book" size={16}/> Verandah Playbook
              </span>
              <span className="text-[11px] text-on-surface-variant">Quick Guide</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface mb-1">
              Rules &amp; Floor Slap Rhythm
            </h3>
            <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-1.5 mb-space-md list-disc list-inside">
              <li>Pass 1 chit clockwise to your left neighbor every turn.</li>
              <li>Collect 4 identical chits of any single identity suit.</li>
              <li>Slap the center carpet (THAP!) as fast as possible.</li>
              <li>Last hand down on the pile takes the forfeit penalty!</li>
            </ul>
          </div>
          <div className="flex gap-space-sm">
            <Link to="/rules" className="flex-1 inline-flex items-center justify-center gap-1 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors">
              <Icon name="help_outline" size={16}/> Complete Rules
            </Link>
            <Link to="/leaderboard" className="flex-1 inline-flex items-center justify-center gap-1 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors">
              <Icon name="leaderboard" size={16}/> Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
