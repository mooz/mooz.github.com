'use client';

import { useState } from 'react';
import { SerializablePublication } from '../types';

type PublicationsListProps = {
  publications: SerializablePublication[];
};

export function PublicationsList({ publications }: PublicationsListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'year' | 'type'>('year');

  const filteredPublications = publications.filter(pub =>
    filter === 'all' ? true : pub.type === filter
  );

  const sortedPublications = [...filteredPublications].sort((a, b) =>
    sortBy === 'year' ? b.year - a.year : a.type.localeCompare(b.type)
  );

  return (
    <>
      <div className="flex gap-4 mb-6">
        <select
          className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="journal">Journal Papers</option>
          <option value="conference">Conference Papers</option>
          <option value="workshop">Workshop Papers</option>
          <option value="preprint">Preprints</option>
        </select>

        <select
          className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'year' | 'type')}
        >
          <option value="year">Sort by Year</option>
          <option value="type">Sort by Type</option>
        </select>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 border rounded-lg shadow-inner p-4 bg-gray-50 dark:bg-gray-900">
        {sortedPublications.map((pub, index) => (
          <div key={index} className="p-4 border rounded-lg dark:border-gray-800">
            <a
              href={`https://doi.org/${pub.doi}`}
              className="text-sm hover:underline mt-2 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="font-bold mb-2">{pub.title}</h3>
            </a>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {pub.authors.join(', ')}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {pub.venue}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({pub.year})
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
