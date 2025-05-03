import { motion, AnimatePresence } from 'framer-motion';

export default function HomeSection({
  recording,
  recordingTime,
  loading,
  error,
  result,
  audioUrl,
  audioBlob,
  isHovering,
  startRecording,
  stopRecording,
  triggerFileInput,
  handleSubmit,
  resetRecording,
  setIsHovering,
  fileInputRef,
  handleFileUpload
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative z-10"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          Language Identifier
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Record your voice or upload an audio file and we'll identify the language with advanced AI analysis
        </p>
      </motion.div>

      <AnimatePresence>
        {recording && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center space-x-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center relative">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-red-300 font-medium">
              Recording: {formatTime(recordingTime)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center space-x-2"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-400"
            />
            <span className="text-purple-300 font-medium">
              Analyzing audio... This may take a moment
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center backdrop-blur-sm"
          >
            <div className="flex justify-center items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 shadow-lg"
          >
            <div className="text-center mb-6">
              <motion.h3 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-2xl font-bold mb-2 text-green-400"
              >
                Language Identified!
              </motion.h3>
              <div className="w-20 h-1 bg-green-500/50 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-sm text-gray-400 mb-1">Language</p>
                <p className="text-2xl font-semibold">{result.prediction}</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-sm text-gray-400 mb-1">Confidence</p>
                <p className="text-2xl font-semibold">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={recording ? stopRecording : startRecording}
          className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-lg ${
            recording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-white/10 hover:bg-white/20 text-white'
          } flex items-center justify-center space-x-2 transition-colors duration-300`}
        >
          {recording ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span>Stop</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Record</span>
            </>
          )}
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={triggerFileInput}
          className="px-6 py-3 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload</span>
        </motion.button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="audio/*"
          className="hidden"
        />

        <AnimatePresence>
          {audioUrl && !loading && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSubmit}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-300"
            >
              {isHovering ? (
                <motion.svg 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </motion.svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
              <span>Identify</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-300">
                {audioBlob instanceof Blob ? 'Your Recording' : 'Uploaded Audio'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetRecording}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center space-x-1 bg-white/5 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </motion.button>
            </div>
            <audio
              controls
              src={audioUrl}
              className="w-full rounded-lg bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}