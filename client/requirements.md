## Packages
framer-motion | Smooth animations for UI elements and number counters
recharts | Financial history charts visualization
lucide-react | Icons for financial metrics (already in base but good to note)
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["'DM Sans'", "sans-serif"],
  display: ["'Outfit'", "sans-serif"],
  mono: ["'Fira Code'", "monospace"],
}

Integration:
- Game logic is primarily client-side (React state/reducers)
- SessionStorage used for persistence
- High scores submitted to backend via /api/scores
