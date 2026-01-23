import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'] 
});


export const metadata = {
  title: "Gamestack",
  description: "Explore and Find through a catalog of games",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
