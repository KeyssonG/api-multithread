import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import type { Dashboard } from '../types/dashboard';
import styles from '../styles/Estoque.module.css';

interface Props {
  onError: (msg: string) => void;
}

export default function DashboardEstoque({ onError }: Props) {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .buscarDashboard()
      .then(setDashboard)
      .catch((err: unknown) => onError(err instanceof Error ? err.message : 'Erro ao carregar dashboard'))
      .finally(() => setLoading(false));
  }, [onError]);

  if (loading) {
    return (
      <div className={styles.indicatorGrid}>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: '4px solid #e5e7eb',
              borderTopColor: '#5d6cf6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className={styles.indicatorGrid}>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
          Nenhum dado disponível no momento.
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const cards = [
    {
      label: 'Total de Itens',
      value: dashboard.totalItens,
      color: '#5d6cf6',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
      format: (v: number) => v.toLocaleString('pt-BR'),
    },
    {
      label: 'Estoque Baixo',
      value: dashboard.estoqueBaixo,
      color: '#f59e0b',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      format: (v: number) => v.toLocaleString('pt-BR'),
    },
    {
      label: 'Alertas Críticos',
      value: dashboard.alertasCriticos,
      color: '#ef4444',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      format: (v: number) => v.toLocaleString('pt-BR'),
    },
    {
      label: 'Valor Total do Estoque',
      value: dashboard.valorTotalEstoque,
      color: '#10b981',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      format: (v: number) => formatCurrency(v),
    },
  ];

  return (
    <div className={styles.indicatorGrid}>
      {cards.map((card) => (
        <div key={card.label} className={styles.indicatorCard} style={{ borderTop: `3px solid ${card.color}` }}>
          <div className={styles.indicatorIcon} style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className={styles.indicatorValue}>{card.format(card.value)}</div>
          <div className={styles.indicatorLabel}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
