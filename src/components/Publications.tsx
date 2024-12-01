import { promises as fs } from 'fs';
import path from 'path';
import toml from '@iarna/toml';
import { PublicationsList } from './PublicationsList';
import { Publication, SerializablePublication } from '../types';

type PublicationsData = {
  publications: Publication[];
};

export default async function Publications() {
  const publicationsFile = await fs.readFile(
    path.join(process.cwd(), 'data/publications.toml'),
    'utf-8'
  );
  const data = toml.parse(publicationsFile) as PublicationsData;
  
  // シリアライズ可能なプレーンオブジェクトに変換
  const publications: SerializablePublication[] = data.publications.map(pub => ({
    ...pub,
    type: pub.type
  }));

  return (
    <section className="max-w-6xl mx-auto py-4 px-4" id="publications">
      <h2 className="text-2xl font-bold mb-6">Publications</h2>
      <PublicationsList publications={publications} />
    </section>
  );
}
