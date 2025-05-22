"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation"; // Added useRouter
import { useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import ReviewStars from "@/components/review/ReviewStars";

export default function ReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router

  const restaurantId = params.restaurantId as string;
  const menuId = params.menuId as string;
  const tableId = searchParams.get("tableId") ?? "1";
  const menuName = decodeURIComponent(searchParams.get("name") ?? "메뉴명");
  const menuImage = decodeURIComponent(searchParams.get("image") ?? "/placeholder.svg");

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
      tableId,
      menuId,
      rating,
      reviewText,
    });

    // ✅ 리뷰 완료 상태 저장
    const reviewedKey = `reviewed_${restaurantId}_${tableId}`;
    const reviewedList = JSON.parse(localStorage.getItem(reviewedKey) || "[]") as number[];

    const numericMenuId = parseInt(menuId, 10);
    if (!reviewedList.includes(numericMenuId)) {
      reviewedList.push(numericMenuId);
      localStorage.setItem(reviewedKey, JSON.stringify(reviewedList));
    }

    alert("리뷰가 성공적으로 제출되었습니다!");
    router.push(`/restaurant/${restaurantId}/table/${tableId}/menu`); // Redirect to menu main page
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
              <p className="text-sm text-gray-500">메뉴에 대한 리뷰를 남겨주세요</p>
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
                {["", "별로예요", "그저그래요", "괜찮아요", "좋아요", "맛있어요"][rating]}
              </span>
              <div className="absolute -top-3 -right-3 text-2xl">
                {["", "😞", "😐", "🙂", "😋", "🤤"][rating]}
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
