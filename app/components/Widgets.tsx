"use client";

import React, { useState, useEffect } from "react";
import { NEWS_ARTICLES } from "../data/news";

// --- Stock Ticker Sub-component ---
export function StockTicker() {
  const breakingNews = NEWS_ARTICLES.filter(
    (a) => a.isBreaking || a.isLead || a.isTrending
  );

  return (
    <div className="w-full bg-zinc-950 text-white overflow-hidden py-2 border-b border-zinc-800 text-[11px] font-mono select-none">
      <div className="flex items-center">
        {/* Static Prefix Label */}
        <div className="bg-red-700 text-white font-bold px-3 py-0.5 uppercase tracking-wider text-[9px] mr-4 flex-shrink-0 animate-pulse">
          BREAKING NEWS
        </div>
        {/* Scrolling Marquee */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-ticker flex items-center whitespace-nowrap gap-12">
            {/* Render items multiple times for seamless scrolling loop */}
            {[...breakingNews, ...breakingNews, ...breakingNews].map((article, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                <span className="font-semibold text-zinc-100 hover:text-zinc-300 transition">
                  {article.title}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Weather Widget Sub-component ---
const WEATHER_DATA = {
  "Washington D.C.": { temp: "74°F", status: "Sunny", wind: "8 mph", humidity: "45%", forecast: ["76°F Sunny", "78°F Partly Cloudy", "72°F Light Rain"] },
  "New York": { temp: "71°F", status: "Partly Cloudy", wind: "12 mph", humidity: "52%", forecast: ["73°F Cloudy", "70°F Showers", "75°F Sunny"] },
  "Chicago": { temp: "66°F", status: "Windy", wind: "22 mph", humidity: "58%", forecast: ["68°F Partly Cloudy", "64°F Rain", "67°F Sunny"] },
  "San Francisco": { temp: "62°F", status: "Foggy", wind: "14 mph", humidity: "76%", forecast: ["63°F Foggy", "65°F Partly Cloudy", "64°F Sunny"] },
  "Miami": { temp: "84°F", status: "Humid", wind: "10 mph", humidity: "82%", forecast: ["85°F T-Storms", "86°F Partly Cloudy", "84°F Showers"] },
};

export function WeatherWidget() {
  const [city, setCity] = useState<keyof typeof WEATHER_DATA>("Washington D.C.");
  const data = WEATHER_DATA[city];

  return (
    <div className="bg-zinc-50 border border-zinc-200 p-4 rounded text-xs select-none">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-zinc-900 uppercase tracking-wider text-[10px]">National Weather</h3>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as keyof typeof WEATHER_DATA)}
          className="bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[11px] text-zinc-700 cursor-pointer"
        >
          {Object.keys(WEATHER_DATA).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4 bg-white p-2.5 rounded border border-zinc-100">
        <div>
          <div className="text-2xl font-semibold text-zinc-900 tracking-tight">{data.temp}</div>
          <div className="text-zinc-500 font-medium text-[11px] mt-0.5">{data.status}</div>
        </div>
        <div className="text-right text-[11px] text-zinc-500 space-y-0.5">
          <div>Wind: <span className="font-medium text-zinc-700">{data.wind}</span></div>
          <div>Humidity: <span className="font-medium text-zinc-700">{data.humidity}</span></div>
        </div>
      </div>

      <div>
        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">3-Day Forecast</div>
        <div className="grid grid-cols-3 gap-2">
          {data.forecast.map((fc, i) => {
            const days = ["Sat", "Sun", "Mon"];
            const [temp, ...statusArr] = fc.split(" ");
            const status = statusArr.join(" ");
            return (
              <div key={i} className="bg-white border border-zinc-100 p-1.5 rounded text-center">
                <div className="font-semibold text-zinc-500 text-[10px]">{days[i]}</div>
                <div className="font-bold text-zinc-800 my-0.5">{temp}</div>
                <div className="text-zinc-400 text-[9px] truncate">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Daily Mini Crossword Sub-component ---
export function MiniCrossword() {
  // Perfect 4x4 Word Square: BACK, AREA, CELL, KALE
  const solution = [
    ["B", "A", "C", "K"],
    ["A", "R", "E", "A"],
    ["C", "E", "L", "L"],
    ["K", "A", "L", "E"],
  ];

  const cellNumbers: { [key: string]: number } = {
    "0,0": 1,
    "0,1": 2,
    "0,2": 3,
    "0,3": 4,
  };

  const [grid, setGrid] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const [status, setStatus] = useState<"editing" | "correct" | "incorrect">("editing");

  const handleChange = (r: number, c: number, val: string) => {
    setStatus("editing");
    const upper = val.toUpperCase().slice(-1);
    const next = [...grid];
    next[r][c] = upper;
    setGrid(next);

    // Auto-focus next cell
    if (upper !== "") {
      let nextCol = c + 1;
      let nextRow = r;
      if (nextCol > 3) {
        nextCol = 0;
        nextRow = r + 1;
      }
      if (nextRow <= 3) {
        const nextInput = document.getElementById(`cw-${nextRow}-${nextCol}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (e.key === "Backspace" && grid[r][c] === "") {
      let prevCol = c - 1;
      let prevRow = r;
      if (prevCol < 0) {
        prevCol = 3;
        prevRow = r - 1;
      }
      if (prevRow >= 0) {
        const prevInput = document.getElementById(`cw-${prevRow}-${prevCol}`);
        prevInput?.focus();
      }
    }
  };

  const checkSolution = () => {
    let isCorrect = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] !== solution[r][c]) {
          isCorrect = false;
        }
      }
    }
    setStatus(isCorrect ? "correct" : "incorrect");
  };

  const resetGrid = () => {
    setGrid([
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ]);
    setStatus("editing");
  };

  const autofillSolution = () => {
    setGrid(solution);
    setStatus("correct");
  };

  const clues = [
    { num: 1, text: "Opposite of front; spine or rear" },
    { num: 2, text: "Surface measurement; local region" },
    { num: 3, text: "Basic biological unit; prison room" },
    { num: 4, text: "Nutrient-dense leafy green vegetable" },
  ];

  return (
    <div id="crossword" className="bg-zinc-50 border border-zinc-200 p-4 rounded text-xs select-none">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-zinc-900 uppercase tracking-wider text-[10px]">Daily Mini Crossword</h3>
        <span className="text-[10px] text-zinc-400 font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-zinc-100">4 x 4 Perfect Square</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grid Cells */}
        <div className="flex flex-col items-center justify-center bg-white p-3 rounded border border-zinc-100">
          <div className="grid grid-cols-4 gap-1.5 max-w-[160px]">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const num = cellNumbers[`${r},${c}`];
                return (
                  <div key={`${r}-${c}`} className="relative w-9 h-9 border border-zinc-300 bg-white shadow-sm flex items-center justify-center">
                    {num && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-zinc-400 font-mono">
                        {num}
                      </span>
                    )}
                    <input
                      id={`cw-${r}-${c}`}
                      type="text"
                      value={cell}
                      onChange={(e) => handleChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className="w-full h-full text-center text-sm font-bold uppercase text-zinc-800 bg-transparent"
                    />
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 flex gap-2 w-full justify-center">
            <button
              onClick={checkSolution}
              className="bg-zinc-900 text-white text-[10px] font-semibold py-1 px-3 rounded hover:bg-zinc-800 transition cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={resetGrid}
              className="border border-zinc-200 text-zinc-600 text-[10px] font-semibold py-1 px-2.5 rounded hover:bg-zinc-50 transition cursor-pointer bg-white"
            >
              Clear
            </button>
            <button
              onClick={autofillSolution}
              className="text-zinc-400 hover:text-zinc-700 text-[9px] py-1 cursor-pointer underline"
            >
              Show Answer
            </button>
          </div>

          {status === "correct" && (
            <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 animate-bounce">
              🎉 Puzzle Solved Successfully!
            </div>
          )}
          {status === "incorrect" && (
            <div className="mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              ❌ Try again. Check your spelling.
            </div>
          )}
        </div>

        {/* Clues */}
        <div className="space-y-3 pr-1">
          <div>
            <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 mb-1 border-b border-zinc-200 pb-0.5">Across & Down Clues</div>
            <div className="space-y-1.5">
              {clues.map((clue) => (
                <div key={clue.num} className="text-[11px] text-zinc-600 leading-tight">
                  <span className="font-bold text-zinc-800 mr-1">{clue.num}.</span>
                  {clue.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
