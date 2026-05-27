import { motion } from 'framer-motion';

type Props = {
  onBack: () => void;
};

const pics = [
  '/images/18.jpeg',
  '/images/20.jpeg',
  '/images/21.jpeg',
  '/images/22.jpeg',
  '/images/23.jpeg',
];

export default function BirthdayPage({ onBack }: Props) {
  return (
    <section className="relative min-h-screen bg-black py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.12),_transparent_25%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-16">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="block text-sm tracking-[0.4em] text-red-500 uppercase mb-2">
              Birthday Gallery
            </span>

            <h1 className="font-bebas text-5xl md:text-6xl text-white">
              Happy 18th 🎂
            </h1>

            <p className="mt-3 text-white/60 max-w-xl">
              A collection of memories, smiles, and moments that made everything beautiful.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-red-600 px-5 py-3 text-xs tracking-[0.25em] uppercase text-red-200 hover:bg-red-600/10 transition-colors duration-200"
          >
            Back
          </motion.button>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {pics.map((p, i) => (
            <motion.div
              key={p}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl overflow-hidden bg-zinc-900 p-1"
            >
              <img
                src={p}
                alt={`Birthday ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          ))}
        </div>

        {/* Birthday Book */}
        <div className="mb-12">
          <h2 className="text-white text-2xl mb-4">
            Birthday Book 💖
          </h2>

          <div className="rounded-xl overflow-hidden border border-white/5 bg-[#070707] p-8">
            <div className="flex flex-col items-center justify-center h-[300px] rounded-xl bg-black/40 border border-white/10">
              
              <p className="text-white/60 mb-6 text-center max-w-md">
                A special birthday memory book made with love ✨
              </p>

              <a
                href="https://acrobat.adobe.com/id/urn:aaid:sc:AP:d8f06abd-769c-4b40-9bc2-f94d37e94e36"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-red-600 px-6 py-3 text-sm tracking-[0.2em] uppercase text-red-200 hover:bg-red-600/10 transition-colors duration-200"
              >
                🎂 Open Birthday Book
              </a>
            </div>
          </div>
        </div>

        {/* More Moments */}
        <div className="mt-12">
          <h2 className="text-white text-2xl mb-4">
            More Moments
          </h2>

          <a
            href="https://drive.google.com/drive/folders/1Lt8Cs4YKWYCrfPBD3dOwh3d0F3x3Wchg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-red-600 px-6 py-3 text-sm tracking-[0.2em] uppercase text-red-200 hover:bg-red-600/10 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>

            Open Google Drive Folder
          </a>
        </div>
      </div>
    </section>
  );
}