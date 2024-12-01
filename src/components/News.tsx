import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NewsList } from '@/components/NewsList';
import { SerializableNewsItem } from '../types';

export default async function News() {
  const newsFile = await fs.readFile(
    path.join(process.cwd(), 'data/news.md'),
    'utf-8'
  );
  
  const newsItems: SerializableNewsItem[] = newsFile
    .split('$$$')  // $$$で分割
    .map(item => item.trim())
    .filter(item => item.length > 0)  // 空のエントリを除外
    .map(item => {
      const { data, content } = matter(item);
      return {
        date: data.date,
        title: data.title,
        content: content.trim(),
        type: data.type
      };
    })
    .filter(item => item.date && item.title)  // 有効なエントリのみを保持
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="max-w-6xl mx-auto py-4 px-4" id="news">
      <h2 className="text-2xl font-bold mb-6">Recent News</h2>
      <NewsList newsItems={newsItems} />
    </section>
  );
}
