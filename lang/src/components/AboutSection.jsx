import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">About LangDetect</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">Our Technology</h3>
          <p className="text-white/80">
            LangDetect uses advanced machine learning algorithms to analyze and identify languages from audio samples. 
            Our system is trained on thousands of hours of speech data across multiple languages for accurate detection.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">How It Works</h3>
          <p className="text-white/80">
            Simply record your voice or upload an audio file. Our system will process the audio and 
            provide you with the detected language along with a confidence score within seconds.
          </p>
        </div>
      </div>
    </motion.section>
  );
}