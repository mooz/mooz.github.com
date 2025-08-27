'use client';

import { SerializableNewsItem } from '../types';

type NewsListProps = {
  newsItems: SerializableNewsItem[];
};

export function NewsList({ newsItems }: NewsListProps) {
  const formatDate = (dateStr: string | Date) => {
    try {
      const dateString = dateStr instanceof Date ? dateStr.toISOString().split('T')[0] : String(dateStr);
      const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid Date';
    }
  };

  const getTypeStyle = (type: string) => {
    const styles = {
      publication: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      award: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      talk: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      product: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      news: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return styles[type as keyof typeof styles] || styles.publication;
  };

  const getBorderStyle = (type: string) => {
    const styles = {
      publication: 'border-blue-500 dark:border-blue-600',
      award: 'border-green-500 dark:border-green-600',
      talk: 'border-purple-500 dark:border-purple-600',
      product: 'border-orange-500 dark:border-orange-600',
      news: 'border-yellow-500 dark:border-yellow-600'
    };
    return styles[type as keyof typeof styles] || styles.publication;
  };

  const parseContent = (content: string) => {
    // First convert markdown links to HTML
    const markdownContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Split content by HTML tags
    const parts = markdownContent.split(/(<a[^>]*>.*?<\/a>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<a')) {
        // Extract href and text from HTML link
        const hrefMatch = part.match(/href="([^"]+)"/);
        const textMatch = part.match(/>([^<]+)</);
        if (hrefMatch && textMatch) {
          return (
            <a
              key={index}
              href={hrefMatch[1]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              {textMatch[1]}
            </a>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4 border rounded-lg shadow-inner p-4 bg-gray-50 dark:bg-gray-900">
      {newsItems.map((item, index) => (
        <div key={index} className={`border-l-4 pl-4 ${getBorderStyle(item.type || 'event')}`}>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {formatDate(item.date)}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {parseContent(item.content)}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${getTypeStyle(item.type || 'event')}`}>
              {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Event'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
