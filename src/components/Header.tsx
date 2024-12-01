import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Masafumi Oyamada</Link>
        </div>
        <ul className="flex gap-6">
          <li><Link href="#publications" className="hover:text-gray-600 dark:hover:text-gray-300">Publications</Link></li>
          <li><Link href="#news" className="hover:text-gray-600 dark:hover:text-gray-300">News</Link></li>
          <li><Link href="#contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}
