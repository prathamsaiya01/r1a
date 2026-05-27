import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  onBack: () => void;
};

const galleryImages = [
  '/images/1.1.jpeg',
  '/images/1.2.jpeg',
  '/images/1.3.jpeg',
  '/images/1.4.jpeg',
  '/images/1.5.jpeg',
  '/images/1.6.jpeg',
  '/images/1.7.jpeg',
  '/images/1.8.jpeg',
];

const optionsQuestions = [
  'Who flirts more?',
  'Who is more addicted to their phone?',
  'Who is more likely to start a random fight for attention?',
  'Who would get caught lying first?',
  'Who confessed first?',
  'Who texted first?',
  'Who initiated the first hug?',
  'Who is more possessive?',
  'Who apologizes first?',
  'Who says "I love you" more?',
  'Who is more romantic?',
  'Who gets emotional faster?',
  'Who falls asleep first during calls?',
];

// Words quiz (one-word answers). Edit these questions as needed.
const wordsQuestions = [
  "What’s one thing you admire most about your partner?",
  'How have they changed your life?',
  'What’s your comfort thing about them?',
  "What is Ria’s most used word?",
  'What habit of Pratham annoys Ria the most?',
  'What is Ria’s comfort food?',
  "What’s Pratham’s favorite photo of Ria?(solo)",
  "What’s Ria’s weirdest but cutest habit?",
  'What song describes your relationship?',
  'What changed in Pratham after meeting Ria?',
  "What’s Ria’s favorite thing about Pratham’s personality?",
];

// Hardcoded WhatsApp numbers (international format, no plus or spaces)
const WHATSAPP_RIA = '918779668512';
const WHATSAPP_PRATHAM = '919867822563';

const riaNames = ['ria', 'riuuuuuu', 'riuu', 'Ria'];
const prathamNames = ['pratham', 'Pratham', 'prathuu'];

type User = 'ria' | 'pratham' | null;
type QuizAnswers = {
  ria: (string | null)[];
  pratham: (string | null)[];
};

export default function USPage({ onBack }: Props) {
  const [quizType, setQuizType] = useState<'options' | 'words'>('options');
  const getQuestions = (type: 'options' | 'words') => (type === 'options' ? optionsQuestions : wordsQuestions);
  const questions = getQuestions(quizType);

  const [stage, setStage] = useState<'gallery' | 'namePopup' | 'quiz' | 'results'>('gallery');
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [userNames, setUserNames] = useState({ ria: '', pratham: '' });
  const [nameInput, setNameInput] = useState('');
  const initAnswers = (type: 'options' | 'words') => ({
    ria: new Array(getQuestions(type).length).fill(null),
    pratham: new Array(getQuestions(type).length).fill(null),
  });

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(initAnswers('options'));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [compatibility, setCompatibility] = useState(0);
  const [wordAnswer, setWordAnswer] = useState('');

  const handleNameSubmit = () => {
    if (!nameInput.trim()) return;

    const normalizedInput = nameInput.toLowerCase();
    let user: User = null;

    if (riaNames.some((n) => n.toLowerCase() === normalizedInput)) {
      user = 'ria';
    } else if (prathamNames.some((n) => n.toLowerCase() === normalizedInput)) {
      user = 'pratham';
    }

    if (user) {
      setCurrentUser(user);
      setUserNames((prev) => ({ ...prev, [user]: nameInput }));
      setNameInput('');
      setStage('quiz');
      setCurrentQuestion(0);
    } else {
      alert('Please enter a valid name: Ria (riuuuuuu, riuu) or Pratham (prathuu)');
    }
  };

  const sendWhatsApp = (toNumber: string, text: string) => {
    try {
      const encoded = encodeURIComponent(text);
      const url = `https://wa.me/${toNumber}?text=${encoded}`;
      window.open(url, '_blank');
    } catch (e) {
      // ignore failures silently
    }
  };

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[’'".,!?;:\-()]/g, '')
      .replace(/\s+/g, ' ');

  const levenshtein = (a: string, b: string) => {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1).fill(0);
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  };

  const isSimilar = (aRaw: string | null, bRaw: string | null) => {
    if (aRaw == null || bRaw == null) return false;
    const a = normalize(aRaw);
    const b = normalize(bRaw);
    if (a === b) return true;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    // allow small typos: up to 20% of length, minimum 1
    const threshold = Math.max(1, Math.floor(maxLen * 0.2));
    return dist <= threshold;
  };

  const handleQuizAnswer = (answer: string) => {
    if (!currentUser) return;

    const qList = getQuestions(quizType);
    const newAnswers = { ...quizAnswers };
    newAnswers[currentUser][currentQuestion] = answer;
    setQuizAnswers(newAnswers);

    // send answer to the opposite person's WhatsApp
    const recipient = currentUser === 'ria' ? WHATSAPP_PRATHAM : WHATSAPP_RIA;
    const askerName = userNames[currentUser] || currentUser;
    const message = `Quiz (${quizType}) - ${qList[currentQuestion]}\nAnswer from ${askerName}: ${answer}`;
    sendWhatsApp(recipient, message);

    if (currentQuestion < qList.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if both users have answered all questions for this quiz type
      if (
        newAnswers.ria.every((a) => a !== null) &&
        newAnswers.pratham.every((a) => a !== null)
      ) {
        calculateCompatibility(newAnswers, qList.length);
        setStage('results');
      } else {
        // Switch to other user
        const otherUser = currentUser === 'ria' ? 'pratham' : 'ria';
        setCurrentUser(otherUser);
        setCurrentQuestion(0);
      }
    }
  };

  const calculateCompatibility = (answers: QuizAnswers, totalQuestions: number) => {
    let matches = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const a = answers.ria[i];
      const b = answers.pratham[i];
      if (quizType === 'words') {
        if (isSimilar(a as string | null, b as string | null)) matches++;
      } else {
        if (a === b) matches++;
      }
    }
    const percentage = Math.round((matches / totalQuestions) * 100);
    setCompatibility(percentage);
  };

  const resetQuiz = (toGallery = true) => {
    setCurrentUser(null);
    setUserNames({ ria: '', pratham: '' });
    setNameInput('');
    setQuizAnswers(initAnswers(quizType));
    setCurrentQuestion(0);
    setCompatibility(0);
    if (toGallery) setStage('gallery');
  };

  const startWordsQuiz = () => {
    setQuizType('words');
    setQuizAnswers(initAnswers('words'));
    setCurrentQuestion(0);
    setStage('namePopup');
  };

  return (
    <section className="relative min-h-screen bg-black py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.15),_transparent_25%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* Gallery Stage */}
        {stage === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative max-w-6xl mx-auto px-6 md:px-16"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="block text-sm tracking-[0.4em] text-red-500 uppercase mb-2">Our Story</span>
                <h1 className="font-bebas text-5xl md:text-6xl text-white">Us</h1>
                <p className="mt-3 text-white/60 max-w-xl">Moments we've shared. Ready to test how well you know each other?</p>
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
              {galleryImages.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl overflow-hidden bg-zinc-900 p-1"
                >
                  <img src={src} alt={`Us ${i + 1}`} className="w-full h-48 object-cover rounded-lg" loading="lazy" decoding="async" />
                </motion.div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => setStage('namePopup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-full border-2 border-red-500 bg-red-500/10 px-8 py-4 text-lg font-semibold tracking-[0.15em] uppercase text-red-300 hover:bg-red-500/20 transition-all duration-200"
            >
              Start the Quiz →
            </motion.button>
          </motion.div>
        )}

        {/* Name Popup Stage */}
        {stage === 'namePopup' && (
          <motion.div
            key="namePopup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gradient-to-br from-red-950/40 to-black border border-red-600/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-3xl font-bebas text-white mb-2">Who are you?</h2>
              <p className="text-white/60 text-sm mb-6">Enter your name to begin</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Type your name..."
                autoFocus
                className="w-full bg-black/40 border border-red-600/50 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500 mb-6"
              />
              <p className="text-xs text-white/40 mb-6">
                Valid names: Ria (riuuuuuu, riuu) or Pratham (prathuu)
              </p>
              <div className="flex gap-4">
                <motion.button
                  type="button"
                  onClick={() => setStage('gallery')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleNameSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Quiz Stage */}
        {stage === 'quiz' && currentUser && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative max-w-2xl mx-auto px-6 md:px-16"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-red-400 text-sm tracking-[0.3em] uppercase mb-2">
                    {userNames[currentUser]}'s Turn
                  </p>
                  <h2 className="font-bebas text-3xl text-white">{questions[currentQuestion]}</h2>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {quizType === 'options' ? (
                ['ria', 'pratham'].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleQuizAnswer(option)}
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-xl border-2 p-4 text-left font-semibold text-lg tracking-[0.1em] uppercase transition-all duration-200 ${
                      quizAnswers[currentUser][currentQuestion] === option
                        ? 'border-red-500 bg-red-500/20 text-red-200'
                        : 'border-white/20 bg-white/5 text-white hover:border-red-500/50 hover:bg-red-500/10'
                    }`}
                  >
                    {option === 'ria' ? userNames.ria || 'Ria' : userNames.pratham || 'Pratham'}
                  </motion.button>
                ))
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={wordAnswer}
                    onChange={(e) => setWordAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (wordAnswer.trim()) {
                          handleQuizAnswer(wordAnswer.trim());
                          setWordAnswer('');
                        }
                      }
                    }}
                    rows={4}
                    placeholder="Type your one-word answer here..."
                    className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:border-red-500"
                  />
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (!wordAnswer.trim()) return;
                      handleQuizAnswer(wordAnswer.trim());
                      setWordAnswer('');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full bg-red-600 px-6 py-4 text-lg font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-700 transition-colors"
                  >
                    Submit Answer
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-3xl mx-auto px-6 md:px-16"
          >
            <div className="text-center mb-12">
              <span className="block text-sm tracking-[0.4em] text-red-500 uppercase mb-4">Compatibility</span>
              <h1 className="font-bebas text-6xl md:text-8xl text-white mb-4">
                {compatibility}%
              </h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                You understand each other{' '}
                {compatibility >= 80
                  ? 'SO well! 🔥'
                  : compatibility >= 60
                  ? 'pretty well!'
                  : compatibility >= 40
                  ? 'somewhat! Time to know each other better'
                  : 'not as much! 😄'}
              </p>
            </div>

            {/* Detailed breakdown */}
            <div className="bg-black/40 border border-red-600/30 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Where You Match</h2>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const match = quizType === 'words'
                    ? isSimilar(quizAnswers.ria[i], quizAnswers.pratham[i])
                    : quizAnswers.ria[i] === quizAnswers.pratham[i];
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        match
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <p className="text-white text-sm">
                        <span className={match ? 'text-green-400' : 'text-red-300'}>
                          {match ? '✓' : '✗'}
                        </span>{' '}
                        {q}
                      </p>
                      {!match && (
                        <p className="text-xs text-white/50 mt-2">
                          {userNames.ria}: <span className="font-semibold">{quizAnswers.ria[i]}</span> vs{' '}
                          {userNames.pratham}: <span className="font-semibold">{quizAnswers.pratham[i]}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => onBack()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-full border border-white/20 px-6 py-3 text-sm tracking-[0.2em] uppercase text-white hover:bg-white/5 transition-colors"
              >
                Back to Home
              </motion.button>
              {quizType === 'options' ? (
                <>
                  <motion.button
                    type="button"
                    onClick={startWordsQuiz}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-full bg-yellow-600 px-6 py-3 text-sm font-semibold tracking-[0.2em] uppercase text-white hover:bg-yellow-700 transition-colors"
                  >
                    Take Words Quiz
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => resetQuiz(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold tracking-[0.2em] uppercase text-white hover:bg-red-700 transition-colors"
                  >
                    Retake Quiz
                  </motion.button>
                </>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => resetQuiz(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold tracking-[0.2em] uppercase text-white hover:bg-red-700 transition-colors"
                >
                  Retake Quiz
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
