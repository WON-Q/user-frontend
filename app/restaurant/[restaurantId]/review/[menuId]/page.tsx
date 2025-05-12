"use client";

import { useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import ReviewStars from "@/components/review/ReviewStars";

export default function ReviewPage() {
  const restaurantId = "1";
  const tableId = "2";
  const menuId = "1";
  const menuName = "화덕에구운 즉발신선생 ";
  const menuDescription = "[베스트 메뉴] 스테이크 피자";
  const menuImage = "/placeholder.svg?height=80&width=80";

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setReviewText(text);
    setCharacterCount(text.length);
  };

  const handleSubmitReview = () => {
    console.log("Review Submitted:", {
      restaurantId,
      menuId,
      rating,
      reviewText,
    });
    alert("리뷰가 성공적으로 제출되었습니다!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar restaurantId={restaurantId} tableId={tableId} type="back" showOrderListModal={false}>
        내 리뷰목록
      </NavBar>

      <div className="flex-1 px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src={menuImage}
              alt={menuName}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
            <div>
              <h2 className="font-semibold text-lg">{menuName}</h2>
              <p className="text-sm text-gray-500">{menuDescription}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-[var(--color-primary)] font-medium">
            내 리뷰를 통해 주문 발생시 <span className="font-bold">추가 포인트 적립!</span>
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <ReviewStars
            initialRating={rating}
            onChange={(newRating) => setRating(newRating)}
            size="lg"
          />
        </div>
         {rating > 0 && (
  <div className="text-center mb-8">
    <div className="relative inline-block bg-[var(--color-primary-light)] rounded-full px-6 py-3 mx-auto">
      <span className="text-[var(--color-primary)] font-medium text-lg">
        {rating === 1 && "별로예요"}
        {rating === 2 && "그저그래요"}
        {rating === 3 && "괜찮아요"}
        {rating === 4 && "좋아요"}
        {rating === 5 && "맛있어요"}
      </span>

      {/* 이모지 오른쪽 위 표시 */}
      <div className="absolute -top-3 -right-3 text-2xl">
        {rating === 1 && "😞"}
        {rating === 2 && "😐"}
        {rating === 3 && "🙂"}
        {rating === 4 && "😋"}
        {rating === 5 && "🤤"}
      </div>
    </div>
  </div>
)}


        <div className="mb-4">
          <div className="relative">
            <textarea
              placeholder="음식에 대한 솔직한 리뷰를 남겨주세요."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] resize-none"
              value={reviewText}
              onChange={handleReviewTextChange}
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-3 text-gray-500 text-sm">{characterCount} / 1000</div>
          </div>
        </div>

        <button
          onClick={handleSubmitReview}
          disabled={rating === 0}
          className={`w-full py-4 rounded-lg font-medium text-white ${
            rating === 0 ? "bg-gray-300" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
          }`}
        >
          완료
        </button>
      </div>
    </div>
  );
}
