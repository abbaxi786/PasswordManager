import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Password Manager",
  description: "For the storing the passwords and sites in secured way.",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="light" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
