

// import Link from "next/link";
// import Image from "next/image";

// export function Header() {
//   return (
//     <header className="border-b border-gray-200 bg-white">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
//         <Link href="/" className="flex items-center">
//           <Image
//             src="/logo.png"
//             alt="Right On Stop"
//             width={240}
//             height={48}
//             className="h-[52px] w-auto object-contain sm:h-[62px]"
//             priority
//           />
//         </Link>
//         <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
//           {/* We use a common set of classes for all links to keep it clean */}
//           {["Home", "Search", "Map", "Chat"].map((item) => (
//             <Link
//               key={item}
//               href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
//               className="
//                 px-4 py-2 text-sm font-medium text-gray-600 rounded-full 
//                 transition-all duration-300 ease-in-out
//                 hover:bg-red-60 hover:text-red-600 hover:scale-110 
//                 active:scale-95 sm:text-base
//               "
//             >
//               {item}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </header>
//   );
// }
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Right On Stop"
            width={240}
            height={48}
            className="h-[52px] w-auto object-contain sm:h-[62px]"
            priority
          />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
          {["Home", "Search", "Map", "Chat"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="px-4 py-2 text-sm font-medium rounded-full bg-gray-800 text-white transition-all duration-300 ease-in-out hover:bg-red-600 hover:scale-110 active:scale-95 sm:text-base"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}