import React, { useState, useEffect } from 'react';
import QRCode from './QRCode';
import ContactManager from './ContactManager';
import MessageComposer from './components/MessageComposer';

function App() {
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, contacts, messages, analytics

  // Verificar si hay sesión guardada
  useEffect(() => {
    const savedSession = localStorage.getItem('whatsapp-session');
    if (savedSession) {
      setIsWhatsAppConnected(true);
      setUser({ name: 'Usuario Demo', phone: '+1234567890' });
    }
  }, []);

  const handleWhatsAppConnection = (connected, userData = null) => {
    setIsWhatsAppConnected(connected);
    setUser(userData);
    if (connected) {
      localStorage.setItem('whatsapp-session', 'connected');
    } else {
      localStorage.removeItem('whatsapp-session');
      setCurrentView('dashboard');
    }
  };

  const renderCurrentView = () => {
    if (!isWhatsAppConnected) {
      return <QRCode onConnection={handleWhatsAppConnection} />;
    }

    switch (currentView) {
      case 'contacts':
        return <ContactManager />;
      case 'messages':
        return <MessageComposer />;
      case 'analytics':
        return <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h2>Analíticas</h2>
          <p>Próximamente...</p>
        </div>;
      default:
        return (
          <div style={{ padding: '1.5rem', maxWidth: '1024px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem', 
              border: '1px solid #e2e8f0', 
              padding: '2rem', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1a202c', 
                marginBottom: '0.5rem' 
              }}>
                ¡WhatsApp Conectado Exitosamente!
              </h2>
              <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                Ahora puedes acceder a todas las funcionalidades
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <button 
                  onClick={() => setCurrentView('contacts')}
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#edf2f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f7fafc'}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
                    Gestión de Contactos
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Importar y organizar contactos
                  </p>
                </button>
                
                <button 
                  onClick={() => setCurrentView('messages')}
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#edf2f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f7fafc'}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
                    Envío de Mensajes
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Crear campañas personalizadas
                  </p>
                </button>
                
                <button 
                  onClick={() => setCurrentView('analytics')}
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#edf2f7'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f7fafc'}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>
                    Analíticas
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Reportes y estadísticas
                  </p>
                </button>
              </div>

              <button
                onClick={() => handleWhatsAppConnection(false)}
                style={{
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
              >
                Desconectar WhatsApp
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 1.5rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>
                WhatsApp Pro Sender
              </h1>
              <span style={{ fontSize: '0.875rem', color: '#718096' }}>Versión Web</span>
            </button>
            
            {/* Navigation */}
            {isWhatsAppConnected && (
              <nav style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentView === 'dashboard' ? '#25D366' : 'transparent',
                    color: currentView === 'dashboard' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('contacts')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentView === 'contacts' ? '#25D366' : 'transparent',
                    color: currentView === 'contacts' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  👥 Contactos
                </button>
                <button
                  onClick={() => setCurrentView('messages')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentView === 'messages' ? '#25D366' : 'transparent',
                    color: currentView === 'messages' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  💬 Mensajes
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentView === 'analytics' ? '#25D366' : 'transparent',
                    color: currentView === 'analytics' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  📈 Analíticas
                </button>
              </nav>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: isWhatsAppConnected ? '#48bb78' : '#f56565' 
            }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {isWhatsAppConnected ? 'Conectado' : 'Desconectado'}
            </span>
            {user && (
              <div style={{ marginLeft: '1rem', textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a202c' }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#718096' }}>{user.phone}</p>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;