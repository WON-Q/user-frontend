
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const prizes = [
  { label: "꽝", image: "/images/cookie.png" },
  { label: "500 포인트 적립", image: "/images/cookie.png" },
  { label: "500 포안두 적립", image: "/images/cookie.png" },
  { label: "꽝", image: "/images/cookie.png" },
  { label: "꽝", image: "/images/cookie.png" },
  { label: "꽝", image: "/images/cookie.png" },
  { label: "500 포인트 적립립", image: "/images/cookie.png" },
  { label: "꽝", image: "/images/cookie.png" },
];

export default function GameModal({ isOpen, onClose }: GameModalProps) {
  const [gameChances, setGameChances] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedIndex(null);
      setSelectedPrize(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClickPrize = (label: string, index: number) => {
    if (gameChances <= 0 || isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setSelectedPrize(label);
      setGameChances((prev) => prev - 1);
      setIsAnimating(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-[90%] max-w-md shadow-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ×
        </button>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🎮 WonQ뽑기</h2>
          <p className="text-sm text-gray-800 font-semibold mb-1">
            <span className="text-[var(--color-primary)] font-bold bg-[var(--color-primary-light)] px-2 py-1 rounded">우리페이</span>로 결제 시 <span className="text-primary font-bold">게임 기회 1회</span>를 드려요!
          </p>
          <p className="text-xs text-gray-500 italic mb-4">원큐에 뽑아라~ 기회는 단 한번!!</p>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">내 게임 기회</p>
            <p className="text-2xl font-bold text-primary">{gameChances}회</p>
          </div>

          <div className="grid grid-cols-4 gap-3 justify-center items-center mb-6">
            {prizes.map((prize, index) => (
              <div
                key={index}
                onClick={() => handleClickPrize(prize.label, index)}
                className={`cursor-pointer p-2 rounded-lg shadow bg-white border border-gray-200 h-20 flex items-center justify-center transition-transform duration-300 ${
                  isAnimating || gameChances <= 0 ? "pointer-events-none opacity-50" : "hover:scale-105"
                }`}
              >
                {selectedIndex === index && selectedPrize ? (
                  <div className="text-sm font-bold text-black animate-bounce">
                    🎁 {selectedPrize}
                  </div>
                ) : (
                  <img
                    src={prize.image}
                    alt={prize.label}
                    className="w-10 h-10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}