# 🚀 NEON NECROPOLIS - Quick Start Guide

## Immediate Play Instructions

### 1. Start the Game (Already Running!)
The dev server is already running on port 3000:
```bash
# The game is live at:
http://localhost:3000
```

### 2. First Time Setup (if needed)
```bash
cd /app/workspace/neon-necropolis
npm install
npm run dev
```

## 🎮 How to Play in 60 Seconds

1. **Open** http://localhost:3000 in your browser
2. **Press SPACE** to start
3. **Move** with WASD or Arrow Keys
4. **Survive** - Your weapons auto-fire!
5. **Level Up** - Press 1, 2, or 3 to choose weapons
6. **Win** - Survive 30 minutes!

## 🎯 Quick Tips

### Movement Strategy
- Keep moving! Zombies home in on your position
- Use diagonal movement (it's normalized, so no speed boost)
- Stay near the center when possible to have escape routes

### Weapon Selection
- **Early Game**: Focus on fire rate (Laser, Lightning)
- **Mid Game**: Get AOE weapons (Tesla, Orbital)
- **Late Game**: Build synergies for massive bonuses

### Synergy Combos (POWERFUL!)
1. 🔥 **Elemental Fury** = Ice + Flamethrower + Lightning
2. ⚡ **Tech Arsenal** = Laser + Tesla + Orbital
3. 💥 **Heavy Artillery** = Missiles + Shotgun

## 📊 Key Stats to Watch

- **Health** (top left) - Don't let it reach zero!
- **XP Bar** (below health) - Fill it to level up
- **Timer** (top center) - Reach 30:00 to win
- **Wave** (top right) - Increases every 2 minutes

## 🧟 Enemy Progression

| Time | New Enemies |
|------|-------------|
| 0:00 | Shambler |
| 2:00 | + Runner |
| 4:00 | + Tank |
| 8:00 | + Exploder, Spitter |
| 14:00 | + Swarm |
| 18:00 | + Brute |
| 22:00 | + Phantom |
| 28:00 | + Necromancer |

## 🐛 Troubleshooting

**Game not loading?**
- Check browser console (F12) for errors
- Verify dev server is running: `npm run dev`
- Clear browser cache and reload

**Performance issues?**
- Close other browser tabs
- The game uses object pooling and spatial hashing for optimization
- Target is 60 FPS on modern browsers

**Can't level up?**
- Press 1, 2, or 3 keys (not mouse clicks for now)
- Make sure you killed enough zombies for XP

## 🎮 Advanced Strategies

### Best First Weapons
1. **Laser** - High DPS, piercing
2. **Shotgun** - Great crowd control
3. **Lightning** - Chain kills

### Synergy Rush Strategy
Pick weapons in this order to activate synergies fast:
1. Start with Pistol (given)
2. Get Lightning (Rapid Assault starter)
3. Get Poison (completes Rapid Assault)
4. Get Laser, Tesla, Orbital (Tech Arsenal)

### Survival Tips
- Don't get cornered - always have an escape route
- Let weapons auto-target - focus on movement
- Prioritize survival over aggressive play
- Wave 15+ is extremely difficult - be prepared!

## 📈 Win Condition

**Survive until timer shows 00:00 (30 minutes)**

You'll see the VICTORY screen with your final stats!

## 🎉 Your First Game Checklist

- [ ] Press SPACE to start
- [ ] Move around with WASD
- [ ] Kill 100 zombies (for first level up)
- [ ] Choose your first weapon upgrade
- [ ] Survive past wave 3
- [ ] Unlock a weapon synergy
- [ ] Reach level 10
- [ ] Survive to victory!

---

**Ready to enter the NEON NECROPOLIS?**

Open http://localhost:3000 and press SPACE!

Good luck, survivor. 🎮⚡
