export const goalsTrend = [
  { gw: 'GW26', goals: 28, conceded: 19 },
  { gw: 'GW27', goals: 31, conceded: 22 },
  { gw: 'GW28', goals: 25, conceded: 18 },
  { gw: 'GW29', goals: 35, conceded: 24 },
  { gw: 'GW30', goals: 29, conceded: 20 },
  { gw: 'GW31', goals: 38, conceded: 27 },
  { gw: 'GW32', goals: 33, conceded: 21 },
]

export const standings = [
  { pos: 1, team: 'Liverpool', played: 31, w: 23, d: 5, l: 3, gd: '+47', pts: 74, form: ['W','W','D','W','W'], trend: 'up' },
  { pos: 2, team: 'Arsenal', played: 31, w: 21, d: 6, l: 4, gd: '+38', pts: 69, form: ['W','W','W','D','W'], trend: 'up' },
  { pos: 3, team: 'Man City', played: 31, w: 19, d: 7, l: 5, gd: '+29', pts: 64, form: ['L','W','W','D','W'], trend: 'same' },
  { pos: 4, team: 'Chelsea', played: 31, w: 18, d: 5, l: 8, gd: '+18', pts: 59, form: ['W','L','W','W','L'], trend: 'down' },
  { pos: 5, team: 'Aston Villa', played: 31, w: 16, d: 8, l: 7, gd: '+14', pts: 56, form: ['D','W','L','W','W'], trend: 'up' },
  { pos: 6, team: 'Tottenham', played: 31, w: 15, d: 6, l: 10, gd: '+8', pts: 51, form: ['L','W','W','L','D'], trend: 'down' },
  { pos: 7, team: 'Newcastle', played: 31, w: 14, d: 8, l: 9, gd: '+11', pts: 50, form: ['W','D','W','W','L'], trend: 'same' },
]

export const topScorers = [
  { name: 'M. Salah', team: 'Liverpool', goals: 24, assists: 14, img: 'MS' },
  { name: 'E. Haaland', team: 'Man City', goals: 21, assists: 6, img: 'EH' },
  { name: 'A. Isak', team: 'Newcastle', goals: 18, assists: 5, img: 'AI' },
  { name: 'B. Saka', team: 'Arsenal', goals: 16, assists: 11, img: 'BS' },
  { name: 'C. Palmer', team: 'Chelsea', goals: 15, assists: 13, img: 'CP' },
]

export const fixtures = [
  { home: 'Arsenal', away: 'Liverpool', time: '12:30', date: 'Sat 20 Apr', status: 'upcoming' },
  { home: 'Man City', away: 'Chelsea', time: '15:00', date: 'Sat 20 Apr', status: 'upcoming' },
  { home: 'Tottenham', away: 'Newcastle', time: '17:30', date: 'Sat 20 Apr', status: 'live', score: '1-2', min: '64\'' },
  { home: 'Aston Villa', away: 'Man Utd', time: '14:00', date: 'Sun 21 Apr', status: 'upcoming' },
]

export const radarData = [
  { stat: 'Attack', lfc: 92, afc: 85 },
  { stat: 'Defence', lfc: 88, afc: 82 },
  { stat: 'Possession', lfc: 79, afc: 84 },
  { stat: 'Pressing', lfc: 91, afc: 78 },
  { stat: 'Set Pieces', lfc: 76, afc: 80 },
  { stat: 'Transition', lfc: 88, afc: 75 },
]

export const statCards = [
  { label: 'Total Goals', value: '892', sub: 'GW 1-32', delta: '+12%', up: true },
  { label: 'Avg per Match', value: '2.79', sub: 'This season', delta: '+0.3', up: true },
  { label: 'Live Matches', value: '3', sub: 'Right now', delta: null, live: true },
  { label: 'Cards Issued', value: '1,247', sub: 'Season total', delta: '-8%', up: false },
]

import { User, Bell, Shield, Palette, Globe, BarChart2, Download } from 'lucide-react'

export const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'analytics', label: 'Analytics Prefs', icon: BarChart2 },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'data', label: 'Data & Export', icon: Download },
]

export const favoriteTeams = ['Arsenal', 'Aston Villa', 'Chelsea', 'Everton', 'Liverpool', 'Man City', 'Man Utd', 'Newcastle', 'Tottenham', 'West Ham']
export const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1']
