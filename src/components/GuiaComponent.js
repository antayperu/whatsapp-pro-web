import React from 'react';

const GuiaComponent = () => {
  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          WhatsApp Pro Sender
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Automatiza el envío masivo de mensajes personalizados por WhatsApp
        </p>
      </div>

      {/* URL Box */}
      <div style={{ 
        background: '#e8f4fd',
        border: '2px solid #3182ce',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#2c5282', marginBottom: '0.5rem' }}>
          🚀 Ya estás en la aplicación
        </h3>
        <p style={{ color: '#3182ce', fontSize: '1.1rem', fontWeight: '600' }}>
          Usa la navegación superior para acceder a todas las funciones
        </p>
      </div>

      {/* Qué es */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          🎯 ¿Qué es WhatsApp Pro Sender?
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Una aplicación web profesional desarrollada por <strong>Antay Peru</strong> que automatiza 
          el envío masivo de mensajes personalizados por WhatsApp. Ideal para empresas que desean 
          comunicarse eficientemente con sus clientes.
        </p>
        
        <div style={{ 
          background: '#f0fff4',
          borderLeft: '4px solid #25D366',
          padding: '1rem',
          margin: '1rem 0'
        }}>
          <strong>Beneficio principal:</strong> Envía mensajes personalizados a cientos de clientes 
          automáticamente, mientras te dedicas a otras tareas importantes de tu negocio.
        </div>
      </div>

      {/* Primeros Pasos */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          🚀 Primeros Pasos
        </h2>
        
        <div style={{ counterReset: 'step-counter' }}>
          {[
            {
              title: "Conecta tu WhatsApp",
              content: "Si aún no lo has hecho, haz click en 'Conectar WhatsApp' en el header y escanea el código QR con tu WhatsApp móvil. Una vez conectado, permaneces logueado automáticamente."
            },
            {
              title: "Importa tus Contactos", 
              content: "Ve a '👥 Contactos' → '📥 Importar Excel' y sube tu archivo con la estructura: Nombre | Teléfono | Mensaje"
            },
            {
              title: "Configura tu Campaña",
              content: "Ve a '💬 Mensajes', selecciona contactos, elige velocidad y genera tu helper automático."
            }
          ].map((step, index) => (
            <div key={index} style={{ 
              counterIncrement: 'step-counter',
              marginBottom: '1.5rem',
              paddingLeft: '3rem',
              position: 'relative'
            }}>
              <div style={{
                content: `"${index + 1}"`,
                position: 'absolute',
                left: '0',
                top: '0',
                background: '#25D366',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ lineHeight: '1.6' }}>{step.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Características */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          ✨ Características Principales
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          margin: '1rem 0'
        }}>
          {[
            {
              icon: "🤖",
              title: "Completamente Automático",
              description: "Sin intervención manual durante el envío. Funciona mientras haces otras tareas."
            },
            {
              icon: "🔒", 
              title: "Seguro y Confiable",
              description: "No almacena tus datos. Usa tu WhatsApp personal sin riesgo de bloqueo."
            },
            {
              icon: "👤",
              title: "Mensajes Personalizados", 
              description: "Cada mensaje incluye el nombre del cliente automáticamente."
            },
            {
              icon: "📊",
              title: "Fácil de Usar",
              description: "Interface intuitiva sin conocimientos técnicos requeridos."
            }
          ].map((feature, index) => (
            <div key={index} style={{ 
              background: '#f7fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
              <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{feature.title}</h4>
              <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Casos de Uso */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          💡 Casos de Uso Ideales
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {[
            {
              icon: "🛍️",
              title: "Retail y Comercio",
              items: ["Promociones y descuentos", "Nuevos productos", "Recordatorios de pagos"]
            },
            {
              icon: "💼", 
              title: "Servicios Profesionales",
              items: ["Recordatorios de citas", "Seguimiento de clientes", "Ofertas personalizadas"]
            },
            {
              icon: "🍕",
              title: "Restaurantes",
              items: ["Promociones del día", "Confirmación de pedidos", "Programas de fidelización"]
            },
            {
              icon: "🏥",
              title: "Servicios de Salud", 
              items: ["Recordatorios de citas", "Campañas de prevención", "Seguimiento post-consulta"]
            }
          ].map((useCase, index) => (
            <div key={index} style={{ 
              background: '#f7fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{useCase.icon}</div>
              <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{useCase.title}</h4>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {useCase.items.map((item, i) => (
                  <li key={i} style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          📋 Requisitos Técnicos
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>✅</span>
            <strong>Para usar la aplicación web:</strong>
          </div>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Navegador web (Google Chrome recomendado)</li>
            <li>WhatsApp instalado en tu móvil</li>
            <li>Conexión a internet</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>✅</span>
            <strong>Para envío automático:</strong>
          </div>
          <ul style={{ marginLeft: '2rem' }}>
            <li>Python instalado (descarga gratis de python.org)</li>
            <li>Google Chrome instalado</li>
          </ul>
        </div>
        
        <div style={{ 
          background: '#fffbf0',
          borderLeft: '4px solid #f6ad55',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <strong>Nota:</strong> Si no tienes Python, la aplicación te guía para instalarlo fácilmente.
        </div>
      </div>

      {/* Resolución de Problemas */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginBottom: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#25D366',
          borderBottom: '2px solid #25D366',
          paddingBottom: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          🔧 Resolución de Problemas
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Si no se conecta WhatsApp:</h4>
          <ul style={{ paddingLeft: '1rem' }}>
            <li>Verifica que tu móvil tenga internet</li>
            <li>Asegúrate de escanear el QR completamente</li>
            <li>Usa Google Chrome en lugar de otros navegadores</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Si el archivo automático no funciona:</h4>
          <ul style={{ paddingLeft: '1rem' }}>
            <li>Descarga Python de python.org/downloads</li>
            <li>Durante instalación marca "Add Python to PATH"</li>
            <li>Reinicia tu computadora después de instalar</li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Si los mensajes no se envían:</h4>
          <ul style={{ paddingLeft: '1rem' }}>
            <li>Verifica que los números tengan código de país (+51 para Perú)</li>
            <li>Revisa que WhatsApp Web funcione en tu navegador</li>
            <li>Intenta con velocidad más lenta</li>
          </ul>
        </div>
      </div>

      {/* Contacto */}
      <div style={{ 
        background: '#25D366',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>📞 Soporte Técnico</h3>
        <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> cortega@antayperu.com</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>WhatsApp:</strong> +51 921 566 036</p>
        <p><strong>Horarios:</strong> Lunes a Viernes 9am - 6pm</p>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        marginTop: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Desarrollado con ❤️ por <strong>Antay Peru</strong><br/>
          Automatizando la comunicación empresarial desde 2025
        </p>
      </div>
    </div>
  );
};

export default GuiaComponent;