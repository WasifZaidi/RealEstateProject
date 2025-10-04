import { Figtree, Sora, Outfit, Sora,} from "next/font/google";
import localFont from "next/font/local"
export const inter = Sora({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"], // Adjust as needed
  display: "swap",
});

export const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"], // Adjust as needed
  display: "swap",
});
export const ProximaNovaBold = localFont({
  src: [
    {
      path: '../fonts/ProximaNova-Bold.woff2',
    },
    {
      path: '../fonts/ProximaNova-Bold.woff',
    },
  ],
  display: 'swap', 
})
export const ProximaNovaSemiBold = localFont({
  src: [
    {
      path: '../fonts/ProximaNova-SemiBold.woff2',
    },
    {
      path: '../fonts/ProximaNova-SemiBold.woff',
    },
  ],
  display: 'swap', 
})

export const ProximaNovaRegular = localFont({
  src: [
    {
      path: '../fonts/ProximaNova-Regular.woff',
    },
    {
      path: '../fonts/ProximaNova-Regular.woff2',
    },
  ],
  display: 'swap', 
})


