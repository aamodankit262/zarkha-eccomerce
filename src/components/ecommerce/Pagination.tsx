import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white">
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-orange-500 disabled:text-gray-400"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 text-sm rounded-md border ${
            currentPage === page
              ? "border-orange-500 text-orange-500 font-semibold"
              : "border-transparent text-gray-700 hover:border-orange-500 hover:text-orange-500"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-orange-500 disabled:text-gray-400"
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
