import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const { t } = useTranslation();

  const showInfo = totalCount !== undefined;
  const startItem = showInfo ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = showInfo ? Math.min(currentPage * pageSize, totalCount!) : 0;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {showInfo && (
        <div className="text-sm text-gray-dark">
          {t('common.showing')} {startItem}-{endItem} {t('common.of')} {totalCount} {t('common.results')}
        </div>
      )}

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="input w-20 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        )}

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors duration-300"
          >
            {t('common.previous')}
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 text-sm rounded-sm transition-colors duration-300 ${
                    page === currentPage
                      ? 'bg-gold text-white'
                      : 'border border-border hover:border-gold hover:text-gold'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2 text-gray-medium">
                  {page}
                </span>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold hover:text-gold transition-colors duration-300"
          >
            {t('common.next')}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
