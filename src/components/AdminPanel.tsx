import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, ImagePlus, Video, X, Plus, Trash2 } from 'lucide-react';

type GalleryItem = {
  id: number;
  src: string;
  label: string;
  type: 'image' | 'video';
  custom?: boolean;
  temporary?: boolean;
};

interface Props {
  items: GalleryItem[];
  onAddItem: (item: GalleryItem) => void;
  onRemoveItem: (id: number) => void;
}

const PASSWORD = '1111';

export default function AdminPanel({ items, onAddItem, onRemoveItem }: Props) {
  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      setPasscode('');
      setError('');
      setUnlocked(false);
      setLabel('');
      setUrl('');
      setFile(null);
    }
  }, [open]);

  const handleUnlock = () => {
    if (passcode.trim() === PASSWORD) {
      setUnlocked(true);
      setError('');
      setPasscode('');
    } else {
      setError('Wrong code — use 1111.');
    }
  };

  const handleAddRemote = () => {
    if (!url.trim()) {
      setError('Add a valid URL first.');
      return;
    }
    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    onAddItem({
      id: nextId,
      src: url.trim(),
      label: label.trim() || (type === 'video' ? 'New Video' : 'New Photo'),
      type,
      custom: true,
    });
    setUrl('');
    setLabel('');
    setError('Added successfully.');
  };

  const handleUploadFile = () => {
    if (!file) {
      setError('Choose a photo or video file first.');
      return;
    }
    const url = URL.createObjectURL(file);
    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
    onAddItem({
      id: nextId,
      src: url,
      label: label.trim() || file.name,
      type: fileType,
      custom: true,
      temporary: true,
    });
    setFile(null);
    setLabel('');
    setError('Uploaded successfully.');
  };

  const buttonText = unlocked ? 'Close admin panel' : 'Open admin panel';

  const customItems = useMemo(
    () => items.filter((item) => item.custom),
    [items],
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-black/80 border border-white/10 px-4 py-3 text-white shadow-2xl backdrop-blur-xl hover:bg-white/10 transition"
      >
        <Lock size={16} />
        Admin
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#060606]/95 shadow-2xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>

              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-3 mb-6">
                  <div className="text-sm uppercase tracking-[0.4em] text-red-400">Ria's Admin</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Add photos or videos</h2>
                  <p className="text-sm text-white/70">
                    Unlock with code <span className="font-semibold text-white">1111</span> to add new items from your phone.
                  </p>
                </div>

                {!unlocked ? (
                  <div className="space-y-4">
                    <label className="block text-sm text-white/70">Admin code</label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-red-500"
                      placeholder="Enter 1111"
                    />
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 transition"
                    >
                      <Lock size={16} /> Unlock
                    </button>
                    {error && <p className="text-sm text-red-300">{error}</p>}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-red-400">
                          <ImagePlus size={16} /> Add photo
                        </div>
                        <label className="block text-sm text-white/70">Image URL</label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                            setType('image');
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none focus:border-red-500"
                          placeholder="https://..."
                        />
                        <label className="block text-sm text-white/70">Label</label>
                        <input
                          type="text"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none focus:border-red-500"
                          placeholder="Sweet Memory"
                        />
                        <button
                          type="button"
                          onClick={handleAddRemote}
                          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 transition"
                        >
                          Add Image
                        </button>
                      </div>

                      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-red-400">
                          <Video size={16} /> Add video
                        </div>
                        <label className="block text-sm text-white/70">Video URL or file</label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                            setType('video');
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none focus:border-red-500"
                          placeholder="https://..."
                        />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            setFile(e.target.files?.[0] || null);
                            setType('image');
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none file:cursor-pointer file:rounded-full file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleUploadFile}
                          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 transition"
                        >
                          Upload File
                        </button>
                        <p className="text-xs text-white/50">Choose a photo or video file from your phone.</p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.4em] text-red-400">Custom items</p>
                          <p className="text-xs text-white/50">Manage added photos and videos.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUnlocked(false);
                            setPasscode('');
                            setError('');
                          }}
                          className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/5"
                        >
                          Logout
                        </button>
                      </div>

                      {customItems.length === 0 ? (
                        <p className="text-sm text-white/50">No custom items yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {customItems.map((item) => (
                            <div key={item.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/70 p-4">
                              <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                                <span>{item.label}</span>
                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-white/80 hover:bg-white/10"
                                >
                                  <Trash2 size={14} /> Remove
                                </button>
                              </div>
                              <div className="text-xs text-white/50">{item.type.toUpperCase()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {error && <p className="text-sm text-red-300">{error}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
