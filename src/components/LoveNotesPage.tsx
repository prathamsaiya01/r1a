import { motion } from 'framer-motion';

type LoveNotesPageProps = {
  onBack: () => void;
};

const loveNotes = [
  {
    id: 1,
    title: 'So dobuuuu',
    text: `Scene aisa hai ki i never take phone during matches

So agar break mila beech mein toh i ll try to text, or else around 1 30... warna abhi hiii gooodd nighttt riuuuu🧿💗sorryyy aaj baat nhi huii
Plss website complete karna!!! Ho jayega man laga ke kaarrrrr dabuuu
Takee careeeee, sorryyss thankuu so muchhh🫶missss uuuuuu!!

I ll text u at night and jaldi sojaanaaa

~Pratham`,
  },
  {
    id: 2,
    title: 'RRRRRR   IIIII   AAAAA',
    text: `R    R     I    A     A
RRRRRR     I    AAAAAAA
R   R      I    A     A
R    RR  IIIII  A     A

Heyy Riuuuu
Happiest Birthdayy love❤️🥺🧿🫶🫂to my O2 ->> Air --> Ria
Really grateful to have youu in my lifee
Ur boyyy missess you bohot
From a start to friendship in 3rd Sem to our bond like this is just unbelievable, and for which I m really grateful to God for sending youu

404 not found got me my #1 found

Sorryy bohot chota msg hai, probably not the once to be starred, but I ll write kal ache se..  i wanted to write moree..  but abhi nai likh payaa sorryy babyyy, loveee uuuuu🧿🥺 dont stress out, you have got this okay?! Chill❤️🧿

~ pratuuuu`,
  },
  {
    id: 3,
    title: "Pratham I'm genuinely sorrryyy yaaarrr",
    text: `ajj me tere se bin faltu ka rude thi yaaarrr
Iske liye i don't talk when I'm downnn
I'm sach me sorryyy mere rudeness ke liye in case mene kuch bola hoga toh just kn ki i didn't mean itt

Thankkk uuuuuuuuuuu sooo much yaaarr for being thereeee
Bhaii I can never stop thanking god for putting u into my life yaaarrr🙏❤️🧿
And biggest thankk u to u for bearing with me and staying by me yaarrr even when I'm being a bitch 😭

~ riuuu`,
  },
  {
    id: 4,
    title: 'I\'m greatful bhaiiii',
    text: `itna sehta hai bhai tu roj
And yes I have been manifesting u from the moment tune woh msg bheja tha bhaiii 🤌😭❤️🧿

~ riuuu`,
  },
  {
    id: 5,
    title: 'Note',
    text: `ofccc there are many many messages, so sorry I could find only these many

- apka PS19`,
  },
];

export default function LoveNotesPage({ onBack }: LoveNotesPageProps) {
  return (
    <section className="relative min-h-screen bg-black py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.18),_transparent_25%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-8 md:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="block text-sm tracking-[0.4em] text-red-500 uppercase mb-2">Love Notes</span>
            <h1 className="font-bebas text-5xl md:text-6xl text-white">Messages for Riuuuu</h1>
            <p className="mt-4 max-w-2xl text-white/60 text-sm leading-relaxed">
              A dark red-themed note page with black cards and glowing red borders. Tap back to return to the main story.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="self-start rounded-full border border-red-600 px-5 py-3 text-xs tracking-[0.25em] uppercase text-red-200 hover:bg-red-600/10 transition-colors duration-200"
          >
            Back
          </motion.button>
        </div>

        <div className="grid gap-8">
          {loveNotes.map((note) => (
            <motion.article
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: note.id * 0.08 }}
              className="rounded-[2rem] border border-red-600/80 bg-[#070707] p-8 shadow-[0_0_40px_rgba(229,9,20,0.12)]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 text-white/70">
                  <span className="font-cinzel text-sm uppercase tracking-[0.35em] text-red-400">Message {note.id}</span>
                </div>
                <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
                <p className="whitespace-pre-wrap text-white/70 text-sm leading-relaxed">{note.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
