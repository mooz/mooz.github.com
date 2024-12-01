import Header from '@/components/Header';
import Profile from '@/components/Profile';
import Publications from '@/components/Publications';
import News from '@/components/News';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Profile />
        <News />
        <div className="bg-gray-50 dark:bg-gray-900">
          <Publications />
        </div>
      </main>
      <Footer />
    </div>
  );
}
