import { motion } from 'framer-motion';

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Italian', code: 'it' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Russian', code: 'ru' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Chinese', code: 'zh' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Korean', code: 'ko' }
];

export default function LanguagesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-300">Supported Languages</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {languages.map((language) => (
          <motion.div
            key={language.code}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
          >
            <span className="text-lg font-medium text-white">{language.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}