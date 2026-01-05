import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  const handleClose = onCancel || onClose || (() => {});

  const variantStyles = {
    danger: 'bg-burgundy text-white hover:bg-burgundy-hover',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    info: 'bg-gold text-white hover:bg-gold-hover',
  };

  const iconColors = {
    danger: 'text-burgundy',
    warning: 'text-yellow-600',
    info: 'text-gold',
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full bg-ivory ${iconColors[variant]} mb-4`}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-dark mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 btn btn-secondary"
          >
            {cancelLabel || t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 btn ${variantStyles[variant]}`}
          >
            {isLoading ? t('common.loading') : confirmLabel || t('common.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
