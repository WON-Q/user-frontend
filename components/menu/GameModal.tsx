"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import treasureImg from "@/public/images/treasure.png"; // 닫힌 상자

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ isOpen, onClose }: GameModalProps) {
  const [stage, setStage] = useState<"idle" | "fall" | "boom" | "result">("idle");
  const [gameChances, setGameChances] = useState(1);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);

  const startGame = () => {
    if (gameChances <= 0 || stage !== "idle") return;
    setStage("fall");

    setTimeout(() => {
      setStage("boom");
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }, 1000);

    setTimeout(() => {
      setStage("result");
      setSelectedPrize("배달비 할인 5백원 쿠폰");
      setGameChances((prev) => prev - 1);
    }, 2000);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStage("idle");
      setSelectedPrize(null);

      // 바로 시작
      startGame();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative rounded-xl w-[90%] max-w-md shadow-lg overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/treasure-bg.png")' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
        >
          ×
        </button>

        <div className="p-6 text-center min-h-[380px] flex flex-col items-center justify-center relative">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🎁 우리페이 럭키박스</h2>

          {stage === "fall" && (
            <div className="animate-fall mt-10">
              <Image src={treasureImg} alt="Treasure falling" width={120} height={120} />
            </div>
          )}

          {stage === "boom" && (
            <div className="relative w-full h-52 flex items-center justify-center">
              {/* 중심 흰색 플래시 */}
              <div className="absolute w-32 h-32 rounded-full bg-white opacity-70 animate-burst-flash z-20" />

              {/* 퍼지는 투명한 테두리 */}
              <div className="absolute w-60 h-60 rounded-full border-[3px] border-[#ffb6b6] opacity-60 animate-soft-ring z-10" />
            </div>
          )}

          {stage === "result" && selectedPrize && (
            <div className="flex flex-col items-center gap-4 animate-fade-in mt-4">
              <p className="text-blue-600 font-extrabold text-lg">🎉 당첨!</p>
              <p className="text-black font-bold text-xl">{selectedPrize}</p>

              <div className="relative">
                {/* 보물상자 */}
                <Image src={treasureImg} alt="Treasure" width={120} height={120} className="mb-2" />

                {/* 코인 이펙트 (선택적) */}
                <div className="absolute inset-0 flex justify-center items-end -z-10">
                  <div className="w-32 h-32 bg-yellow-100 blur-2xl rounded-full opacity-50 animate-ping" />
                </div>
              </div>

              {/* 쿠폰 형태 */}
              <div className="relative bg-white border-2 border-black w-[260px] py-4 px-6 shadow-md rounded-xl ticket-wrapper">
                <p className="text-center text-sm text-gray-500 mb-1 font-medium">배달비 Only</p>
                <p className="text-center text-4xl font-extrabold text-black tracking-widest">500</p>
                <p className="text-center text-xs mt-1 tracking-wider text-gray-400">DISCOUNT COUPON</p>
              </div>

              <button
                onClick={() => {
                  setStage("idle"); // Reset stage to allow replay
                  onClose();
                }}
                className="mt-4 px-5 py-2 bg-black text-white rounded-full font-semibold text-sm"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-300px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-fall {
          animation: fall 1s ease-out forwards;
        }

        @keyframes explosion {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
        .animate-explosion {
          animation: explosion 0.7s ease-out forwards;
        }

        @keyframes burst-text {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .animate-burst-text {
          animation: burst-text 0.8s ease-in-out forwards;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes flash-effect {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .animate-flash-effect {
          animation: flash-effect 0.7s ease-out forwards;
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ring-pulse {
          animation: ring-pulse 0.7s ease-out forwards;
        }

        @keyframes burst-flash {
          0% {
            transform: scale(0.4);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .animate-burst-flash {
          animation: burst-flash 0.6s ease-out forwards;
        }

        @keyframes soft-ring {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .animate-soft-ring {
          animation: soft-ring 0.8s ease-out forwards;
        }

        .ticket-wrapper {
          position: relative;
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }

        .ticket-wrapper::before,
        .ticket-wrapper::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 20px;
          height: 40px;
          background: #fff;
          border: 2px solid black;
          border-radius: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .ticket-wrapper::before {
          left: -10px;
        }

        .ticket-wrapper::after {
          right: -10px;
        }
      `}</style>
    </div>
  );
}
