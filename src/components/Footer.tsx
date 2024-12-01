export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </footer>
  );
}
