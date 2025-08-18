import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Intro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center relative overflow-hidden">
      
      {/* Animated Background Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.15, 0.08, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-[400px] h-[400px] rounded-full bg-orange-500/15 blur-3xl"
      />
      
      {/* Floating Dots */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-4 h-4 rounded-full bg-orange-400/40"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          x: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-32 right-32 w-3 h-3 rounded-full bg-orange-500/30"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center p-12 rounded-3xl backdrop-blur-sm bg-white/80 shadow-2xl border border-orange-100/50 max-w-lg"
        style={{
          boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05)'
        }}
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-6xl font-extrabold tracking-tight text-gray-800 drop-shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          KORE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 text-gray-600 text-lg leading-relaxed"
        >
          Experience food ordering like never before —  
          <span className="font-semibold text-orange-600"> fast</span>,  
          <span className="font-semibold text-orange-500"> stylish</span>, and  
          <span className="font-semibold text-orange-700"> simple</span>.
        </motion.p>

        <motion.button
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0px 10px 30px rgba(234, 88, 12, 0.3)" 
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="mt-8 inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 border border-orange-400/20"
        >
          <span className="mr-2">🚀</span>
          Get Started
        </motion.button>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-60"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 opacity-50"
        />
      </motion.div>

      {/* Additional Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-16 w-6 h-6 bg-orange-300/40 transform rotate-45"
      />
      <motion.div
        animate={{ 
          y: [0, 25, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-40 right-24 w-5 h-5 bg-orange-400/30 rounded-full"
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn { from { transform: scale(0.9); } to { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.2); opacity: 0.2; } }
        @keyframes float-reverse { 0%, 100% { transform: scale(1.1); opacity: 0.15; } 50% { transform: scale(0.9); opacity: 0.08; } }
        @keyframes bob { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
        @keyframes bob-reverse { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(15px) translateX(-15px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes float-shape { 0%, 100% { transform: translateY(0) rotate(45deg); } 50% { transform: translateY(-30px) rotate(225deg); } }
        @keyframes float-circle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(25px); } }
      `}</style>
    </div>
  );
};

export default Intro;