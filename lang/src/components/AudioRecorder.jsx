import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import RecordRTC from 'recordrtc';
import Navbar from './Navbar';
import HomeSection from './HomeSection';
import AboutSection from './AboutSection';
import LanguagesSection from './LanguageSection';
import ContactSection from './ContactSection';

export default function AudioRecorder() {
  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  
  // Result and loading state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);
  const sectionsRef = useRef({
    home: useRef(null),
    about: useRef(null),
    languages: useRef(null),
    contact: useRef(null)
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      clearInterval(timerRef.current);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = sectionsRef.current[sectionId]?.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setResult(null);
      setAudioBlob(null);
      setAudioUrl('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        sampleRate: 16000,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        timeSlice: 100,
        ondataavailable: function(blob) {
          // Optional: handle chunks if needed
        }
      });
      
      recorderRef.current.startRecording();
      setRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError('Microphone access denied or not available');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    return new Promise(resolve => {
      if (recorderRef.current && recording) {
        clearInterval(timerRef.current);
        
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          setRecording(false);
          
          // Stop all tracks in the stream
          recorderRef.current.stream.getTracks().forEach(track => track.stop());
          resolve();
        });
      }
    });
  };

  const handleFileUpload = (event) => {
    setError(null);
    setResult(null);
    
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    try {
      setLoading(true);
      setError(null);
      
      let audioFile;
      
      if (audioBlob instanceof Blob) {
        // RecordRTC already gives us a WAV file
        audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      } else {
        audioFile = audioBlob;
      }

      const formData = new FormData();
      formData.append('file', audioFile);

      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.prediction) {
        setResult(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Prediction error:', error);
      let errorMessage = 'Failed to identify language';
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.statusText;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Home Section */}
      <div ref={sectionsRef.current.home} className="w-full max-w-4xl">
        <HomeSection 
          recording={recording}
          recordingTime={recordingTime}
          loading={loading}
          error={error}
          result={result}
          audioUrl={audioUrl}
          audioBlob={audioBlob}
          isHovering={isHovering}
          startRecording={startRecording}
          stopRecording={stopRecording}
          triggerFileInput={triggerFileInput}
          handleSubmit={handleSubmit}
          resetRecording={resetRecording}
          setIsHovering={setIsHovering}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />
      </div>

      {/* About Section */}
      <div ref={sectionsRef.current.about} className="w-full py-20 max-w-4xl">
        <AboutSection />
      </div>

      {/* Languages Section */}
      <div ref={sectionsRef.current.languages} className="w-full py-20 max-w-4xl">
        <LanguagesSection />
      </div>

      {/* Contact Section */}
      <div ref={sectionsRef.current.contact} className="w-full py-20 max-w-4xl">
        <ContactSection />
      </div>
    </div>
  );
}