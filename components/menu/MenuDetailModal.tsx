"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MenuItem, MenuOption, SelectedOptions } from "@/types/menu";
import { useCart } from "@/context/CartContext";

interface MenuDetailModalProps {
  menu: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  tableId: string;
}

export default function MenuDetailModal({
  menu,
  isOpen,
  onClose,
  restaurantId,
  tableId,
}: MenuDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (menu && isOpen) {
      const initialOptions: SelectedOptions = {};
      let initialTotalPrice = menu.price;

      if (menu.options) {
        menu.options.forEach((optGroup) => {
          if (optGroup.required) {
            const defaultOption = optGroup.items[0];
            initialOptions[optGroup.title] = defaultOption;
            initialTotalPrice += defaultOption.price;
          }
        });
      }

      setSelectedOptions(initialOptions);
      setTotalPrice(initialTotalPrice * quantity);
      setQuantity(1);
    }
  }, [menu, isOpen]);

  useEffect(() => {
    if (menu) {
      let optionTotalPrice = Object.values(selectedOptions).reduce(
        (sum, option) => sum + (option?.price || 0),
        0
      );
      setTotalPrice((menu.price + optionTotalPrice) * quantity);
    }
  }, [selectedOptions, quantity, menu]);

  const handleOptionChange = (optionTitle: string, option: MenuOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTitle]: option,
    }));
  };

  const handleAddToCart = () => {
    if (menu) {
      const optionsForCart: { [key: string]: string } = {};
      Object.entries(selectedOptions).forEach(([title, option]) => {
        optionsForCart[title] = option.name;
      });

      addItem(menu, quantity, optionsForCart);

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }

      const successEl = document.getElementById("cartSuccess");
      if (successEl) {
        successEl.classList.remove("opacity-0", "translate-y-2");
        successEl.classList.add("opacity-100", "translate-y-0");

        setTimeout(() => {
          successEl.classList.add("opacity-0", "translate-y-2");
          successEl.classList.remove("opacity-100", "translate-y-0");
        }, 2000);
      }

      onClose();
    }
  };

  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
      >
        {/* 상단 이미지 */}
        <div className="relative w-full h-[220px] sm:h-[300px]">
          <Image
            src="/images/placeholder.png" // Use placeholder if menu.image is not available
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {menu.badge && (
            <div className="absolute top-4 left-4 bg-primary text-white text-base font-semibold px-4 py-1.5 rounded-full flex items-center gap-2">
              {menu.badge}
            </div>
          )}
        </div>

        {/* 상세 내용 */}
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="font-bold text-2xl text-gray-900">{menu.name}</h3>
          <p className="text-gray-600 mt-1 mb-4">{menu.description}</p>

          <div className="border-t border-gray-200 my-4"></div>

          {menu.options?.map((optGroup, index) => (
            <div key={index} className="mb-5">
              <h4 className="font-semibold text-gray-900 mb-2">
                {optGroup.title}
                {optGroup.required && (
                  <span className="text-error ml-1">*</span>
                )}
              </h4>
              <div className="space-y-2">
                {optGroup.items.map((option, idx) => (
                      <div
                      key={idx}
                      className={`flex items-center p-1 rounded-md cursor-pointer ${
                        selectedOptions[optGroup.title]?.name === option.name
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleOptionChange(optGroup.title, option)}
                    >
                    <input
                      type="radio"
                      id={`${menu.id}-${optGroup.title}-${idx}`}
                      name={`${menu.id}-${optGroup.title}`}
                      checked={selectedOptions[optGroup.title]?.name === option.name}
                      onChange={() => handleOptionChange(optGroup.title, option)}
                      className="appearance-none h-5 w-5 mr-3 rounded-full border-2 border-gray-300 checked:border-orange-500 relative
                        after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2.5 after:h-2.5 after:rounded-full after:bg-orange-500 after:opacity-0 checked:after:opacity-100"
                    />
                    <label
                      htmlFor={`${menu.id}-${optGroup.title}-${idx}`}
                      className="flex-1 text-gray-800 text-sm cursor-pointer"
                    >
                      {option.name}
                    </label>
                    {option.price > 0 && (
                      <span className="text-primary text-sm">
                        +{option.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-gray-200 my-4"></div>

          {/* 수량 선택 */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900">수량</span>
            <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className={`px-3 py-1.5 ${
                  quantity <= 1 ? "text-gray-300" : "text-gray-600"
                }`}
                aria-label="수량 감소"
                disabled={quantity <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="px-4 py-1 font-medium min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-gray-600"
                aria-label="수량 증가"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 하단 주문 금액 + 버튼 */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-lg text-gray-900">
              총 주문금액
            </span>
            <span className="font-bold text-xl text-primary">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-[var(--color-primary)] text-white rounded-lg font-semibold shadow-md hover:bg-secondary transition-colors active:scale-98"
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}
