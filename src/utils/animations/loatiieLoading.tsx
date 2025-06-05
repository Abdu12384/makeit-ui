import React from 'react';
import Lottie from 'react-lottie-player';
import animationData from '@/utils/json-files/loadingJson.json'; // Adjust the path if needed

interface LottieAnimationProps {
  visible: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div style={{ width: 400, height: 400 }}>
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default LottieAnimation;
