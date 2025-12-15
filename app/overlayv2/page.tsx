"use client";
import React, { useEffect, useState } from "react";
import { fetchHeroes } from "@/lib/api";
import { useDraft } from "@/hooks/useDraft";
import { Hero } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function TournamentOverlay() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadHeroes = async () => {
      try {
        const data = await fetchHeroes();
        if (mounted) {
          setHeroes(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading heroes:", err);
        if (mounted) setLoading(false);
      }
    };
    loadHeroes();
    return () => {
      mounted = false;
    };
  }, []);

  const { state, currentDraft, getTeamData } = useDraft(heroes);

  if (loading) {
    return <div className="w-screen h-screen bg-transparent" />;
  }

  const blueTeam = getTeamData("blue");
  const redTeam = getTeamData("red");

  const bluePicks = blueTeam.filter((d) => d.type === "pick");
  const blueBans = blueTeam.filter((d) => d.type === "ban");
  const redPicks = redTeam.filter((d) => d.type === "pick");
  const redBans = redTeam.filter((d) => d.type === "ban");

  return (
    <div className="w-screen h-screen bg-transparent relative overflow-hidden">
      {/* Hero Banner Top */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-black/40 to-transparent overflow-hidden">
        <div className="h-full flex">
          {/* Left heroes - grayscale */}
          <div className="w-1/2 flex">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={`left-${i}`} className="flex-1 opacity-30">
                <img
                  src={`https://via.placeholder.com/100x80?text=Hero${i}`}
                  className="w-full h-full object-cover grayscale"
                  alt=""
                />
              </div>
            ))}
          </div>
          {/* Right heroes - grayscale */}
          <div className="w-1/2 flex">
            {[8, 9, 10, 11, 12, 13, 14].map((i) => (
              <div key={`right-${i}`} className="flex-1 opacity-30">
                <img
                  src={`https://via.placeholder.com/100x80?text=Hero${i}`}
                  className="w-full h-full object-cover grayscale"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="absolute inset-0 flex items-center">
        {/* Blue Team Side */}
        <div className="w-[44%] pl-4 pt-24">
          {/* Blue Team Picks */}
          <div className="flex gap-0.5 mb-2">
            {bluePicks.slice(0, 5).map((draft, idx) => (
              <motion.div
                key={draft.index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative flex-1 aspect-3/4 overflow-hidden border ${
                  draft.isActive
                    ? "border-blue-400 shadow-lg shadow-blue-500/50"
                    : "border-blue-600"
                }`}
              >
                {draft.hero ? (
                  <div className="w-full h-full overflow-hidden bg-black">
                    <img
                      src={draft.hero.image}
                      alt={draft.hero.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150x200?text=" +
                          draft.hero?.name;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-black/0" />
                )}
                {draft.isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500/30"
                    animate={{ opacity: [0.3, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Blue Team Info Bar */}
          <div className="bg-blue-600 flex items-stretch h-20">
            {/* Team Logo Placeholder */}
            <div className="w-20 h-20 bg-gray-900 flex items-center justify-center border-r-2 border-blue-700">
              <div className="text-3xl">🛡️</div>
            </div>

            {/* Team Name */}
            <div className="flex-1 flex items-center px-4 bg-blue-700/50">
              <div className="text-white font-bold text-2xl tracking-wide uppercase">
                {state.teamNames.blue}
              </div>
            </div>

            {/* Blue Bans */}
            <div className="flex gap-1 items-center px-2 bg-blue-800/50">
              {blueBans.map((draft) => (
                <div
                  key={draft.index}
                  className="w-12 h-12 bg-black/60 relative overflow-hidden border border-blue-500"
                >
                  {draft.hero ? (
                    <>
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={draft.hero.image}
                          alt={draft.hero.name}
                          className="w-full h-full object-cover opacity-50 grayscale"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/48?text=X";
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-gray-700 rotate-45" />
                      <div className="w-6 h-0.5 bg-gray-700 -rotate-45 absolute" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="w-[12%] flex flex-col items-center justify-center py-24">
          {/* Center Info Box */}
          <div className=" w-full">
            {/* Main center box */}
            <div className="h-[230px] bg-zinc-700 p-4 ">
              {/* Timer Circle */}
              <div className="flex justify-center item relative">
                  <div className="text-2xl font-bold text-white">
                    {state.timeLeft}
                  
                </div>
                {state.timeLeft <= 10 && (
                  <motion.div
                    className="absolute inset-0  bg-red-500"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>    
            </div>  

              {/* Current Action Indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`action-${currentDraft.team}-${currentDraft.type}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={` px-8 py-3  ${
            currentDraft.team === "blue"
              ? "bg-blue-600 border-blue-400"
              : "bg-red-600 border-red-400"
          }`}
        >
          <div className="text-white font-bold text-lg text-center">
            {currentDraft.team === "blue"
              ? state.teamNames.blue
              : state.teamNames.red}
          </div>
          <div className="text-white/80 text-sm text-center">
            {currentDraft.type === "ban" ? " IS BANNING" : " IS PICKING"}
          </div>
        </motion.div>
      </AnimatePresence>


          </div>

        

          {/* Phase Indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`phase-${currentDraft.phase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 px-4 py-2 bg-black/70 border border-yellow-500/50"
            >
              
              <div className="text-yellow-400 text-xs font-bold text-center">
                PHASE {currentDraft.phase}
              </div>
              <div className="text-white text-xs text-center">
                {currentDraft.type === "ban" ? "BAN PHASE" : "PICK PHASE"}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Red Team Side */}
        <div className="w-[44%] pr-4 pt-24">
          {/* Red Team Picks */}
          <div className="flex gap-0.5 mb-2">
            {redPicks.slice(0, 5).map((draft, idx) => (
              <motion.div
                key={draft.index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative flex-1 aspect-3/4 overflow-hidden border ${
                  draft.isActive
                    ? "border-red-400 shadow-lg shadow-red-500/50"
                    : "border-red-600"
                }`}
              >
                {draft.hero ? (
                  <div className="w-full h-full overflow-hidden bg-black/0 ">
                    <img
                      src={draft.hero.image}
                      alt={draft.hero.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150x200?text=" +
                          draft.hero?.name;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bbg-black/0" />
                )}
                {draft.isActive && (
                  <motion.div
                    className="absolute inset-0 bg-red-500/30"
                    animate={{ opacity: [0.3, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Red Team Info Bar */}
          <div className="bg-red-600 flex items-stretch h-20">
            {/* Red Bans */}
            <div className="flex gap-1 items-center px-2 bg-red-800/50">
              {redBans.map((draft) => (
                <div
                  key={draft.index}
                  className="w-12 h-12 bg-black/60 relative overflow-hidden border border-red-500"
                >
                  {draft.hero ? (
                    <>
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={draft.hero.image}
                          alt={draft.hero.name}
                          className="w-full h-full object-cover opacity-50 grayscale"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/48?text=X";
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-gray-700 rotate-45" />
                      <div className="w-6 h-0.5 bg-gray-700 -rotate-45 absolute" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Team Name */}
            <div className="flex-1 flex items-center justify-end px-4 bg-red-700/50">
              <div className="text-white font-bold text-2xl tracking-wide uppercase">
                {state.teamNames.red}
              </div>
            </div>

            {/* Team Logo Placeholder */}
            <div className="w-20 h-20 bg-gray-900 flex items-center justify-center border-l-2 border-red-700">
              <div className="text-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}