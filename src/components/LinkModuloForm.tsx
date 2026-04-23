import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { funcionarioService } from '../services/funcionarioService';
import { moduloService } from '../services/moduloService';
import type { FuncionarioConsulta } from '../types/funcionario';
import type { CompanyModuloDTO } from '../types/modulo';

interface LinkModuloFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const LinkModuloForm: React.FC<LinkModuloFormProps> = ({ onSuccess, onError }) => {
  const { token } = useAuth();

  const [funcionarios, setFuncionarios] = useState<FuncionarioConsulta[]>([]);
  const [modulos, setModulos] = useState<CompanyModuloDTO[]>([]);

  const [loadingDados, setLoadingDados] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedModulo, setSelectedModulo] = useState<CompanyModuloDTO | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioConsulta | null>(null);

  const [searchModulo, setSearchModulo] = useState('');

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [departamentos, setDepartamentos] = useState<{ nomeDepartamento: string }[]>([]);

  useEffect(() => {
    const carregarModulosEDepartamentos = async () => {
      if (!token) return;

      setLoadingDados(true);
      try {
        const mods = await moduloService.getModulosByCompany(token);
        setModulos(mods || []);

        const { default: DepartmentService } = await import('../services/DepartmentService');
        const depts = await DepartmentService.listarDepartamentos(token);
        setDepartamentos(depts || []);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoadingDados(false);
      }
    };

    carregarModulosEDepartamentos();
  }, [token]);

  const buscarFuncionarios = async () => {
    if (!token) return;
    setLoadingDados(true);
    try {
      let data = [];
      const finalDataInicio = dataInicio || '2000-01-01';
      const finalDataFim = dataFim || new Date().toISOString().split('T')[0];

      if (departamentoSelecionado === "") {
        data = await funcionarioService.buscarFuncionariosTodosDepartamentos(finalDataInicio, finalDataFim, token);
      } else {
        data = await funcionarioService.buscarFuncionariosPorDepartamento(departamentoSelecionado, finalDataInicio, finalDataFim, token);
      }
      setFuncionarios(data || []);
      if (data && data.length === 0) {
        alert('Nenhum funcionário encontrado para os filtros informados.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      alert(error.message || 'Erro ao buscar funcionários.');
    } finally {
      setLoadingDados(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedModulo || !selectedFuncionario) return;

    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    setLoadingSubmit(true);
    try {
      await moduloService.vincularUsuarioModulo({
        userId: selectedFuncionario.id,
        moduloId: selectedModulo.moduloId
      }, token);

      alert('Módulo vinculado com sucesso ao funcionário!');
      setSelectedFuncionario(null);
      setSelectedModulo(null);
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao vincular:', error);
      const msg = error.response?.data?.message || 'Erro inesperado ao vincular módulo.';
      onError?.(msg);
      alert(msg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const filteredModulos = modulos.filter(m =>
    m.moduloName.toLowerCase().includes(searchModulo.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', backgroundColor: 'white', padding: '8px', borderRadius: '14px', width: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <button
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
          📋 Consultar Vínculos
        </button>
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
          🔗 Novo Vínculo
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 380px)', minHeight: '400px' }}>

        {/* LEFT PANEL: Módulos Disponíveis */}
        <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '1rem', fontWeight: '700' }}>Módulos Disponíveis</h2>
            <input
              type="text"
              placeholder="Pesquisar módulo..."
              value={searchModulo}
              onChange={(e) => setSearchModulo(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', padding: '10px', alignContent: 'start' }}>
            {loadingDados && modulos.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Carregando...</p>
            ) : filteredModulos.map(modulo => (
              <div
                key={modulo.moduloId}
                onClick={() => setSelectedModulo(modulo)}
                style={{
                  padding: '1.2rem',
                  borderRadius: '14px',
                  border: '2px solid',
                  borderColor: selectedModulo?.moduloId === modulo.moduloId ? '#1976d2' : '#f0f0f0',
                  backgroundColor: selectedModulo?.moduloId === modulo.moduloId ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedModulo?.moduloId === modulo.moduloId ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <span style={{ fontWeight: '700', color: selectedModulo?.moduloId === modulo.moduloId ? '#1976d2' : '#333' }}>{modulo.moduloName}</span>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999' }}>ID {modulo.moduloId}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL: Configurar Gestão */}
        <section style={{ width: '450px', backgroundColor: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '2rem', fontWeight: '700' }}>Configurar Gestão</h2>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#1976d2', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>1. Módulo</p>
              {selectedModulo ? (
                <div style={{ padding: '1.2rem', backgroundColor: '#e3f2fd', borderRadius: '12px', border: '1px solid #1976d2', color: '#1a237e', fontWeight: '700' }}>
                  {selectedModulo.moduloName}
                </div>
              ) : <div style={{ padding: '1.2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd', color: '#aaa', textAlign: 'center' }}>Selecione um módulo</div>}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#2e7d32', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>2. Funcionário</p>
              {selectedFuncionario ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', backgroundColor: '#e8f5e9', borderRadius: '12px', border: '1px solid #2e7d32', color: '#1b5e20', fontWeight: '700' }}>
                  {selectedFuncionario.nome}
                  <button onClick={() => setSelectedFuncionario(null)} style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <button
                  disabled={!selectedModulo || loadingSubmit}
                  onClick={() => setIsEmployeeModalOpen(true)}
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '2px solid #2e7d32', backgroundColor: 'white', color: '#2e7d32', fontWeight: '700', cursor: selectedModulo ? 'pointer' : 'not-allowed' }}
                >
                  Selecionar Funcionário
                </button>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <button
              disabled={!selectedModulo || !selectedFuncionario || loadingSubmit}
              style={{ width: '100%', padding: '1.2rem', borderRadius: '14px', border: 'none', backgroundColor: (selectedModulo && selectedFuncionario && !loadingSubmit) ? '#1a237e' : '#cfd8dc', color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}
              onClick={handleConfirm}
            >
              {loadingSubmit ? 'Vinculando...' : 'Confirmar Vinculação'}
            </button>
          </div>
        </section>
      </div>

      {/* Employee Selection Modal */}
      {isEmployeeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(5px)', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: '85vh', animation: 'modalFadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1a237e', fontWeight: '700' }}>Selecionar Funcionário</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} style={{ background: '#f0f0f0', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333', cursor: 'pointer' }}
                value={departamentoSelecionado}
                onChange={e => setDepartamentoSelecionado(e.target.value)}
              >
                <option value="">Todos os Departamentos</option>
                {departamentos.map((dept, idx) => (
                  <option key={idx} value={dept.nomeDepartamento}>{dept.nomeDepartamento}</option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600', marginBottom: '4px', marginLeft: '4px' }}>Data Início</span>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333' }}
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                  />
                </div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600', marginBottom: '4px', marginLeft: '4px' }}>Data Fim</span>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333' }}
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={buscarFuncionarios}
                disabled={loadingDados}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                {loadingDados ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {funcionarios.length > 0 ? funcionarios.map(f => (
                    <tr key={f.id} onClick={() => { setSelectedFuncionario(f); setIsEmployeeModalOpen(false); }} style={{ cursor: 'pointer', borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: '600', color: '#1a237e' }}>{f.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{f.departamento} • ID: {f.id}</div>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECIONAR</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        {loadingDados ? 'Carregando...' : 'Nenhum funcionário encontrado.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <style>{`
            @keyframes modalFadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}

    </div>
  );
};

export default LinkModuloForm;
