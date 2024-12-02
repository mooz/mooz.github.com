import Image from 'next/image';

export default function Profile() {
  return (
    <section className="max-w-6xl mx-auto py-4 px-4">
      <div className="grid md:grid-cols-[2fr,3fr] gap-8 items-start">
        <div className="space-y-4">
          <div className="relative w-40 h-40 mx-auto">
            <Image 
              src="/profile.jpg" 
              alt="Masafumi Oyamada"
              width={160}
              height={160}
              className="object-cover rounded-full"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Masafumi Oyamada</h1>
            <h2 className="text-1xl mb-2">小山田 昌史</h2>
            <p className="text-gray-600 dark:text-gray-300">Chief Scientist</p>
            <p className="text-gray-600 dark:text-gray-300">NEC Corporation</p>
            <p className="mt-4"><a href="https://scholar.google.com/citations?hl=en&user=sbmRXxwAAAAJ" className=" text-blue-600 dark:text-blue-400 hover:underline">Google Scholar</a></p>
            <p className="mt-1"> <a href="https://github.com/mooz" className="mr-2 text-blue-600 dark:text-blue-400 hover:underline">GitHub</a></p>
            <p className="mt-1"> <a href="https://x.com/stillpedant" className="mr-2 text-blue-600 dark:text-blue-400 hover:underline">X / Twitter</a></p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">Research Interests</h2>
            <p className="pb-4 text-gray-600 dark:text-gray-300">
            I am a computer scientist based in Tokyo, Japan. I am passionate about maximizing human potential through the power of machines (機械) and knowledge (知識). My current research interests focus on three key areas: developing agentic AI systems that can autonomously interact with their environment 🤖, advancing computer automation to streamline complex workflows ⚡, and exploring methods for LLM self-improvement to enhance AI capabilities 📈.
            </p>
            <p className=" text-gray-600 dark:text-gray-300">
            I am now a Chief Scientist at NEC Corporation, where I lead research initiatives in large language models, data preprocessing automation, and AI systems. Our recent work includes developing novel approaches for LLM self-improvement, optimizing low-resource language model training, and creating intelligent systems for data preprocessing and table understanding. We are particularly focused on making AI systems more efficient, autonomous, and capable of handling complex real-world tasks.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-3">Contact</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">            
              <li>
              <a href="mailto:stillpedant@gmail.com" className="mr-2 text-blue-600 dark:text-blue-400 hover:underline">E-Mail</a>
              </li>              
              <li>
              <p className="text-gray-600 dark:text-gray-300">
              I welcome opportunities for research collaboration and internships in the areas of AI systems, automation, and language models. If you&apos;re interested in working together on cutting-edge AI research, please reach out.
            </p>                
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
