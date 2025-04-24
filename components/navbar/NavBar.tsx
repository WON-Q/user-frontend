interface NavBarProps {
  storeName: string;
  tableId: string | null;
}

export default function NavBar({ storeName, tableId }: NavBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-4 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-h2-mobile">{storeName}</h1>
          <p className="text-caption text-text-light">
            테이블 {tableId || "N/A"}
          </p>
        </div>
        <div className="flex items-center">
          <button
            className="w-10 h-10 flex items-center justify-center text-text-dark hover:bg-gray-100 rounded-full no-highlight"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}