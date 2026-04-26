import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { moduloService } from '../services/moduloService';
import type { UserModuloResponseDTO } from '../types/modulo';
import CustomPopup from './CustomPopup';

interface UserModuloListProps {
  onNavigateToForm?: () => void;
}

const UserModuloList: React.FC<UserModuloListProps> = ({ onNavigateToForm }) => {
  const { token } = useAuth();

  const [userModulos, setUserModulos] = useState<UserModuloResponseDTO[]>([]);
  const [filteredData, setFilteredData] = useState<UserModuloResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [popupConfig, setPopupConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    const carregarUserModulos = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const data = await moduloService.getUserModulos(token);
        setUserModulos(data || []);
        setFilteredData(data || []);
      } catch (error: any) {
        console.error('Erro ao carregar vínculos:', error);
        setPopupConfig({
          isOpen: true,
          title: 'Erro ao Carregar',
          message: error.message || 'Erro ao buscar vínculos de usuários e módulos.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarUserModulos();
  }, [token]);

  useEffect(() => {
    const filtered = userModulos.filter(item =>
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.moduloName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, userModulos]);

  const handleRemove = async (userId: number, moduloId: number) => {
    if (!token) return;

    try {
      await moduloService.removerVinculoUsuarioModulo(userId, moduloId, token);
      
      setPopupConfig({
        isOpen: true,
        title: 'Sucesso',
        message: 'Vínculo removido com sucesso!',
        type: 'success'
      });
      
      // Recarregar os dados
      const data = await moduloService.getUserModulos(token);
      setUserModulos(data || []);
      setFilteredData(data || []);
    } catch (error: any) {
      console.error('Erro ao remover vínculo:', error);
      setPopupConfig({
        isOpen: true,
        title: 'Erro ao Remover',
        message: error.response?.data?.message || error.message || 'Erro ao remover vínculo.',
        type: 'error'
      });
    }
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', backgroundColor: 'white', padding: '8px', borderRadius: '14px', width: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <button
          style={{
            padding: '12px 25px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#1a237e',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          📋 Consultar Vínculos
        </button>
        <button
          onClick={onNavigateToForm}
          style={{
            padding: '12px 25px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#666',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          🔗 Novo Vínculo
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 380px)', minHeight: '400px' }}>

        {/* LEFT PANEL: Search and Filters */}
        <section style={{ width: '350px', backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '1rem', fontWeight: '700' }}>
              Vínculos de Usuários
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Pesquise abaixo para encontrar os módulos vinculados a determinados funcionários de forma rápida.
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '8px' }}>
              FILTRO DE BUSCA
            </p>
            <input
              type="text"
              placeholder="Por nome ou módulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid #ddd',
                outline: 'none',
                fontSize: '0.95rem',
                backgroundColor: '#f8f9fa',
                transition: 'all 0.2s'
              }}
            />
          </div>
        </section>

        {/* RIGHT PANEL: User-Module List */}
        <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          
          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 120px', 
            gap: '1rem', 
            padding: '1rem 0', 
            borderBottom: '2px solid #f0f0f0',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
              USUÁRIO
            </div>
            <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
              MÓDULO
            </div>
            <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px', textAlign: 'center' }}>
              AÇÕES
            </div>
          </div>

          {/* Table Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                Carregando...
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                {searchTerm ? 'Nenhum resultado encontrado para a busca.' : 'Nenhum vínculo encontrado.'}
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div 
                  key={`${item.userId}-${item.moduloId}-${index}`}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 120px', 
                    gap: '1rem', 
                    padding: '1.2rem 0',
                    borderBottom: '1px solid #f8f8f8',
                    alignItems: 'center'
                  }}
                >
                  {/* User Column */}
                  <div>
                    <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                      {item.userName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>
                      ID: {item.userId}
                    </div>
                  </div>

                  {/* Module Column */}
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      border: '1px solid #bbdefb'
                    }}>
                      {item.moduloName}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleRemove(item.userId, item.moduloId)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#ff5252',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff1744';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff5252';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupConfig.isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />

    </div>
  );
};

export default UserModuloList;
