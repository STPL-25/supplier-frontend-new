
const CustomDialog = ({ 
  isOpen, 
  onClose, 
  children, 
  position, 
  isDragging, 
  onMouseDown,
  title,
  className = "" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl absolute ${className}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
        onMouseDown={onMouseDown}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 dialog-header" style={{ cursor: 'grab' }}>
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;