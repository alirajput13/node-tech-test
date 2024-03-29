import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h1>Home</h1>
        <p>This is the home page.</p>
        <nav>
          <ul>
            <li><Link href="/register">Register</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>
  );
}
