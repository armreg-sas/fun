# Farkle Multiplayer Setup Guide

## Overview
The multiplayer version allows two players on different devices to play Farkle together in real-time using peer-to-peer connections.

## How to Play

### Player 1 (Host):
1. Open `farkle-multiplayer.html` in your browser
2. Enter your name
3. Click "Create New Game"
4. Share the generated link or game code with your friend
5. Wait for them to join
6. Start playing when they connect!

### Player 2 (Guest):
1. Click the link your friend sent you, OR
2. Open `farkle-multiplayer.html` in your browser
3. Enter your name
4. Click "Join Game"
5. Enter the 6-character game code
6. Click "Join Game"
7. Start playing!

## Technical Details

### Technology Used
- **PeerJS**: Provides peer-to-peer WebRTC connections
- **No Backend Required**: Direct browser-to-browser communication
- **Free to Use**: No server costs or setup needed

### Features
- Real-time game synchronization
- Turn-based gameplay
- Automatic reconnection handling
- Victory animations and confetti
- Mobile-friendly responsive design

### Browser Requirements
- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (for initial peer connection)

## Troubleshooting

### Connection Issues
- Make sure both players have internet access
- Try refreshing the page and creating a new game
- Check that JavaScript is enabled in your browser
- Ensure you're not behind a restrictive firewall

### Game Code Not Working
- Game codes are case-insensitive
- Codes expire if the host leaves
- Make sure you're entering the exact 6-character code

### Disconnection During Game
- If connection is lost, the game will alert both players
- You'll need to create a new game to continue

## Game Rules
Same as the single-player version:
- Roll all 6 dice to start
- Click dice to keep scoring combinations
- Single 1s = 100 pts, Single 5s = 50 pts
- Three of a kind = value × 100 (except 1s = 1000)
- Three pairs = 1500 pts
- Straight (1-2-3-4-5-6) = 1500 pts
- Bank points to save them, or keep rolling
- Farkle (no scoring dice) = lose turn points
- First to 10,000 wins!

## Files
- `farkle-multi.html` - Single player vs bot version
- `farkle-multiplayer.html` - Multiplayer version (this file)
- `MULTIPLAYER_README.md` - This documentation

Enjoy playing Farkle with your friends! 🎲✨
