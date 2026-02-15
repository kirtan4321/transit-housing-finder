// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const CAMPUS_OPTIONS = [
//   { value: "keele", label: "Keele Campus" },
//   { value: "markham", label: "Markham Campus" },
//   { value: "glendon", label: "Glendon Campus" },
// ] as const;

// const MAX_MINUTES_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

// export function SearchByTime() {
//   const router = useRouter();
//   const [campus, setCampus] = useState<string>("keele");
//   const [maxMinutes, setMaxMinutes] = useState<number>(25);

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     router.push(`/search?campus=${campus}&max=${maxMinutes}`);
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end"
//     >
//       <div className="flex flex-1 flex-col gap-2">
//         <label htmlFor="campus" className="text-sm font-medium text-gray-700">
//           Campus
//         </label>
//         <select
//           id="campus"
//           value={campus}
//           onChange={(e) => setCampus(e.target.value)}
//           className="rounded-md border-2 border-york-blue/30 bg-york-blue/5 px-3 py-2 text-gray-900 transition-colors focus:border-york-red focus:outline-none focus:ring-1 focus:ring-york-red"
//         >
//           {CAMPUS_OPTIONS.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex flex-1 flex-col gap-2">
//         <label htmlFor="maxMinutes" className="text-sm font-medium text-gray-700">
//           Max time to campus
//         </label>
//         <select
//           id="maxMinutes"
//           value={maxMinutes}
//           onChange={(e) => setMaxMinutes(Number(e.target.value))}
//           className="rounded-md border-2 border-york-blue/30 bg-york-blue/5 px-3 py-2 text-gray-900 transition-colors focus:border-york-red focus:outline-none focus:ring-1 focus:ring-york-red"
//         >
//           {MAX_MINUTES_OPTIONS.map((m) => (
//             <option key={m} value={m}>
//               Under {m} mins
//             </option>
//           ))}
//         </select>
//       </div>
//       <button
//         type="submit"
//         className="rounded-md bg-york-red px-4 py-2 font-medium text-white transition-colors hover:bg-york-red/90 focus:outline-none focus:ring-2 focus:ring-york-red focus:ring-offset-2 active:bg-york-red/80 active:scale-[0.98]"
//       >
//         Search
//       </button>
//     </form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CAMPUS_OPTIONS = [
  { value: "keele", label: "Keele Campus" },
  { value: "markham", label: "Markham Campus" },
  { value: "glendon", label: "Glendon Campus" },
] as const;

const MAX_MINUTES_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function SearchByTime() {
  const router = useRouter();
  const [campus, setCampus] = useState<string>("keele");
  const [maxMinutes, setMaxMinutes] = useState<number>(25);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?campus=${campus}&max=${maxMinutes}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      /* 1. Added rounded-2xl and a subtle border for a softer look */
      className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:flex-row sm:items-end"
    >
      <div className="flex flex-1 flex-col gap-2 text-left">
        <label htmlFor="campus" className="text-sm font-semibold text-gray-700 ml-1">
          Campus
        </label>
        <select
          id="campus"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          /* 2. Changed to rounded-xl, added York Red focus, and cleaned up background */
          className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-50 cursor-pointer"
        >
          {CAMPUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-2 text-left">
        <label htmlFor="maxMinutes" className="text-sm font-semibold text-gray-700 ml-1">
          Max time to campus
        </label>
        <select
          id="maxMinutes"
          value={maxMinutes}
          onChange={(e) => setMaxMinutes(Number(e.target.value))}
          /* 3. Consistency is key: rounded-xl and red focus here too */
          className="rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-50 cursor-pointer"
        >
          {MAX_MINUTES_OPTIONS.map((m) => (
            <option key={m} value={m}>
              Under {m} mins
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        /* 4. Made the button rounded-xl and added a slight hover grow */
        className="rounded-xl bg-red-600 px-8 py-3 font-bold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95"
      >
        Search
      </button>
    </form>
  );
}