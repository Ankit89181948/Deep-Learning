import { useState } from 'react';

const LanguageResult = () => {
  // Example result data
  const result = {
    language: "Spanish",
    confidence: 92.3,
    probabilities: {
      spanish: 0.923,
      english: 0.045,
      french: 0.015,
      portuguese: 0.012,
      italian: 0.005
    },
    processing_time: 0.35
  };

  const [expanded, setExpanded] = useState(false);

  // Sort languages by probability
  const sortedLanguages = Object.entries(result.probabilities)
    .sort((a, b) => b[1] - a[1]);

  const topLanguage = sortedLanguages[0];
  const otherLanguages = sortedLanguages.slice(1, expanded ? sortedLanguages.length : 3);

  // Helper functions
  const getLanguageFlag = (language) => {
    const flags = {
      english: '🇬🇧',
      spanish: '🇪🇸',
      french: '🇫🇷',
      german: '🇩🇪',
      portuguese: '🇵🇹',
      italian: '🇮🇹'
    };
    return flags[language.toLowerCase()] || '🌐';
  };

  const getLanguageNativeName = (language) => {
    const names = {
      spanish: 'Español',
      english: 'English',
      french: 'Français',
      german: 'Deutsch',
      portuguese: 'Português',
      italian: 'Italiano'
    };
    return names[language.toLowerCase()] || language;
  };

  const getLanguageFact = (language) => {
    const facts = {
      spanish: "Spanish is the official language in 21 countries, making it the second most widely spoken language by native speakers.",
      english: "English has the largest vocabulary of any language, with over 1 million words.",
      french: "About 45% of modern English words come from French due to the Norman conquest.",
      portuguese: "Portuguese is the fastest-growing European language after English.",
      italian: "Italian is considered the closest living language to Latin in terms of vocabulary."
    };
    return facts[language.toLowerCase()] || `The ${language} language has unique characteristics.`;
  };

  return (
    <div className="w-full h-full ">
  
      <div >
        {/* Card with responsive padding */}
        <div className="bg-gray-900  border border-gray-700 shadow-lg w-full h-full">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-5 border-b border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
              Language Detection Result
            </h2>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6">
            {/* Primary Result - Responsive flex layout */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              {/* Flag Circle - Size adjusts for mobile */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-500 to-red-600 flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                {getLanguageFlag(result.language)}
              </div>
              
              {/* Language Info */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {result.language}
                </h2>
                <p className="text-gray-400 mb-2 sm:mb-3">
                  {getLanguageNativeName(result.language)}
                </p>
                <div className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  {result.confidence.toFixed(1)}% confidence
                </div>
              </div>
            </div>

            {/* Confidence Breakdown */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">
                Confidence Breakdown
              </h3>
              
              {/* Top Language */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-300 text-sm sm:text-base">
                    {topLanguage[0].charAt(0).toUpperCase() + topLanguage[0].slice(1)}
                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      Top Match
                    </span>
                  </span>
                  <span className="text-blue-200 text-xs sm:text-sm">
                    {(topLanguage[1] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500" 
                    style={{ width: `${topLanguage[1] * 100}%` }}
                  />
                </div>
              </div>

              {/* Other Languages */}
              {otherLanguages.map(([lang, prob]) => (
                <div key={lang} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300 text-sm sm:text-base">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="h-full rounded-full bg-gray-600" 
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                </div>
              ))}

              {sortedLanguages.length > 4 && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 mt-1"
                >
                  {expanded ? '▲ Show Less' : '▼ Show More'}
                </button>
              )}
            </div>

            {/* Fun Fact */}
            <div className="p-3 sm:p-4 bg-gray-800/30 rounded-xl border border-gray-700 mb-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-yellow-500/20 p-1.5 sm:p-2 rounded-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-300 text-sm sm:text-base mb-1">Did you know?</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {getLanguageFact(result.language)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900/50 p-3 sm:p-4 border-t border-gray-700 text-center text-xs text-gray-500">
            Analyzed in {result.processing_time} seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageResult;