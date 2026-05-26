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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.12),_transparent_25%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="block text-sm tracking-[0.4em] text-red-500 uppercase mb-2">Birthday Gallery</span>
            <h1 className="font-bebas text-5xl md:text-6xl text-white">Happy 18th</h1>
            <p className="mt-3 text-white/60 max-w-xl">A collection of moments and a keepsake PDF. Click any image to view full size. The PDF opens inline below.</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {pics.map((p, i) => (
            <motion.div key={p} whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden bg-zinc-900 p-1">
              <img src={p} alt={`Birthday ${i + 1}`} className="w-full h-48 object-cover rounded-lg" loading="lazy" decoding="async" />
            </motion.div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-white text-2xl mb-4">Keepsake PDF</h2>
          <div className="rounded-xl overflow-hidden border border-white/5 bg-[#070707] p-4">
            <p className="text-white/60 mb-4">If you placed a PDF at <code className="bg-white/5 px-1 rounded">/images/birthday-book.pdf</code>, it will be shown below. If not, upload it to the <code className="bg-white/5 px-1 rounded">public/images</code> folder.</p>
            <div className="w-full h-[70vh] bg-black/40">
              <iframe src="/images/birthday-book.pdf" title="Birthday PDF" className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-white text-2xl mb-4">More Moments</h2>
          <a href="https://drive.google.com/drive/folders/1Lt8Cs4YKWYCrfPBD3dOwh3d0F3x3Wchg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-red-600 px-6 py-3 text-sm tracking-[0.2em] uppercase text-red-200 hover:bg-red-600/10 transition-colors duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
            Open Google Drive Folder
          </a>
        </div>
      </div>
    </section>
  );
}
