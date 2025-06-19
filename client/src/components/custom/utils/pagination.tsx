import { Button } from '@/components/ui/button';
import { PaginationProps } from '@/types/table';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-2">
        {/* Previous Page Button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant="ghost"
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-gray-300/50 text-gray-800 hover:bg-gray-400'
                : 'bg-gray-200/50 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {(i + 1).toString().padStart(2, '0')}
          </Button>
        ))}

        {/* Next Page Button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}