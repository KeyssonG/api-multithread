import React from 'react';

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
}

const CustomPopup: React.FC<CustomPopupProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'error' 
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'error':
        return {
          icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
              <path d="M15 9L9 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          bgColor: '#fef2f2',
          borderColor: '#dc2626'
        };
      case 'success':
        return {
          icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2"/>
              <path d="M9 12L11 14L15 10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          bgColor: '#f0fdf4',
          borderColor: '#16a34a'
        };
      case 'warning':
        return {
          icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#ea580c" strokeWidth="2"/>
              <path d="M12 8V12" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          bgColor: '#fff7ed',
          borderColor: '#ea580c'
        };
      case 'info':
        return {
          icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/>
              <path d="M12 16V12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          bgColor: '#eff6ff',
          borderColor: '#2563eb'
        };
      default:
        return {
          icon: null,
          bgColor: '#ffffff',
          borderColor: '#e5e7eb'
        };
    }
  };

  const { icon, bgColor, borderColor } = getIconAndColor();

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: bgColor,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'popupSlideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div style={{ marginBottom: '16px' }}>
            {icon}
          </div>
        )}
        
        <h2 
          style={{
            margin: '0 0 12px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}
        >
          {title}
        </h2>
        
        <p 
          style={{
            margin: '0 0 24px 0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.5'
          }}
        >
          {message}
        </p>
        
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#1e293b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            minWidth: '120px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0f172a';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1e293b';
          }}
        >
          Entendi
        </button>
      </div>
      
      <style>{`
        @keyframes popupSlideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomPopup;
