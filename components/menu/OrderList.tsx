import { useState, useEffect } from "react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  totalPrice: number;
}

export default function OrderList({ tableId }: { tableId: string }) {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const matchedKeys = Object.keys(localStorage).filter((key) =>
      key.endsWith(`_t${tableId}`)
    );

    if (matchedKeys.length > 0) {
      const lastKey = matchedKeys[matchedKeys.length - 1];
      const storedOrders = localStorage.getItem(lastKey);

      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch (e) {
          console.error("로컬스토리지 파싱 오류:", e);
          setOrders([]);
        }
      }
    }
  }, [tableId]);

  if (orders.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg shadow">
        주문 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
      <h2 className="text-lg font-bold mb-3">주문 내역</h2>
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order.id} className="flex justify-between text-sm">
            <span>
              {order.name} x {order.quantity}
            </span>
            <span>{order.totalPrice.toLocaleString()}원</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
