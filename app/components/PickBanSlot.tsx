import React from 'react';
import { motion } from 'framer-motion';


export type Slot = {
type: 'pick' | 'ban';
team: 'A' | 'B';
index: number;
hero?: any | null;
};


export default function PickBanSlot({ slot, onClear, onClick }: { slot: Slot; onClear: () => void; onClick: () => void; }) {
return (
<motion.div
layout
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
className={`w-36 h-44 p-2 rounded-lg border-2 ${slot.type === 'ban' ? 'border-red-500' : 'border-yellow-400'} bg-linear-to-b from-black/40 to-black/20 flex flex-col items-center justify-between`}
onClick={onClick}
>
<div className="text-xs uppercase tracking-widest text-gray-300">{slot.type.toUpperCase()} {slot.index}</div>
{slot.hero ? (
<div className="flex flex-col items-center">
<img src={slot.hero.portrait} alt={slot.hero.name} className="w-20 h-20 object-cover rounded-md" />
<div className="mt-2 text-white font-semibold">{slot.hero.name}</div>
</div>
) : (
<div className="w-20 h-20 bg-black/30 rounded-md flex items-center justify-center text-gray-400">—</div>
)}
<div className="w-full flex justify-between items-center">
{slot.hero && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="text-xs text-red-400">Clear</button>}
<div className="text-[10px] text-gray-400">Team {slot.team}</div>
</div>
</motion.div>
);
}