import React, { useState, useEffect } from 'react';

const QRCode = ({ onConnection }) => {
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('disconnected'); // disconnected, qr, connecting, connected
  const [loading, setLoading] = useState(false);

  // Simular proceso de conexión para desarrollo
  const simulateConnection = () => {
    setLoading(true);
    setStatus('qr');
    
    // Generar QR code simulado (en producción usarías whatsapp-web.js)
    const mockQR = generateMockQR();
    setQrCode(mockQR);
    
    // Simular escaneo después de 10 segundos
    setTimeout(() => {
      setStatus('connecting');
      setTimeout(() => {
        setStatus('connected');
        setLoading(false);
        onConnection(true, {
          name: 'Usuario Demo',
          phone: '+1 234 567 890',
          profilePic: 'https://via.placeholder.com/40'
        });
      }, 2000);
    }, 10000);
  };

  const generateMockQR = () => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" fill="white" stroke="black" stroke-width="2"/>
        <g transform="translate(128,128)">
          ${generateQRPattern()}
        </g>
        <text x="128" y="240" text-anchor="middle" font-size="12" fill="gray">
          Código QR WhatsApp Demo
        </text>
      </svg>
    `)}`;
  };

  const generateQRPattern = () => {
    let pattern = '';
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.5) {
          pattern += `<rect x="${i * 20 - 100}" y="${j * 20 - 100}" width="18" height="18" fill="black"/>`;
        }
      }
    }
    return pattern;
  };

  const initializeWhatsApp = async () => {
    try {
      setLoading(true);
      setStatus('connecting');
      
      // En producción, aquí inicializarías whatsapp-web.js
      simulateConnection();
      
    } catch (error) {
      console.error('Error conectando WhatsApp:', error);
      setStatus('disconnected');
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'qr':
        return '📱 Escanea el código QR desde WhatsApp';
      case 'connecting':
        return '🔄 Conectando...';
      case 'connected':
        return '✅ ¡Conectado exitosamente!';
      default:
        return '📲 Listo para conectar WhatsApp';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return '#d69e2e';
      case 'connected':
        return '#38a169';
      case 'qr':
        return '#3182ce';
      default:
        return '#718096';
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 200px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1.5rem' 
    }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          padding: '2rem', 
          textAlign: 'center' 
        }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              width: '5rem', 
              height: '5rem', 
              backgroundColor: '#25D366', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem auto' 
            }}>
              <span style={{ fontSize: '1.875rem', color: 'white' }}>📱</span>
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1a202c', 
              marginBottom: '0.5rem' 
            }}>
              Conectar WhatsApp
            </h2>
            <p style={{ color: '#718096' }}>
              Conecta tu cuenta de WhatsApp para comenzar
            </p>
          </div>

          {/* Status */}
          <div style={{ 
            marginBottom: '1.5rem', 
            fontWeight: '600', 
            color: getStatusColor() 
          }}>
            {getStatusMessage()}
          </div>

          {/* QR Code */}
          {status === 'qr' && qrCode && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                backgroundColor: '#f7fafc', 
                borderRadius: '0.5rem', 
                padding: '1rem', 
                display: 'inline-block' 
              }}>
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  style={{ width: '12rem', height: '12rem', margin: '0 auto' }}
                />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.75rem' }}>
                Abre WhatsApp → Menú → Dispositivos vinculados → Vincular un dispositivo
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                border: '2px solid #e2e8f0', 
                borderTop: '2px solid #25D366', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite', 
                margin: '0 auto' 
              }}></div>
            </div>
          )}

          {/* Connect Button */}
          {status === 'disconnected' && (
            <button
              onClick={initializeWhatsApp}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#25D366',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#128C7E')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#25D366')}
            >
              {loading ? 'Conectando...' : 'Conectar WhatsApp'}
            </button>
          )}

          {/* Instructions */}
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.75rem' }}>
              📋 Instrucciones:
            </h3>
            <ol style={{ fontSize: '0.875rem', color: '#718096', paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem', 
                  marginRight: '0.5rem', 
                  marginTop: '0.125rem' 
                }}>1</span>
                Abre WhatsApp en tu teléfono
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem', 
                  marginRight: '0.5rem', 
                  marginTop: '0.125rem' 
                }}>2</span>
                Ve a Menú → Dispositivos vinculados
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem', 
                  marginRight: '0.5rem', 
                  marginTop: '0.125rem' 
                }}>3</span>
                Toca "Vincular un dispositivo"
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem', 
                  marginRight: '0.5rem', 
                  marginTop: '0.125rem' 
                }}>4</span>
                Escanea el código QR
              </li>
            </ol>
          </div>

          {/* Security Notice */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '0.75rem', 
            backgroundColor: '#f0fff4', 
            borderRadius: '0.5rem' 
          }}>
            <p style={{ fontSize: '0.75rem', color: '#22543d' }}>
              🔒 <strong>Seguridad:</strong> Tu conexión es completamente segura. 
              No almacenamos tus mensajes ni datos personales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;