import React, { useState, useEffect } from 'react';
import whatsappService from '../services/WhatsAppService';
import helperGenerator from '../services/HelperGenerator'; // NUEVO IMPORT

const MessageComposer = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [velocidad, setVelocidad] = useState('Normal (3-5s)');
  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [estadoProceso, setEstadoProceso] = useState('🚀 Listo para enviar');
  
  // Contadores para estadísticas
  const [enviadosCount, setEnviadosCount] = useState(0);
  const [fallidosCount, setFallidosCount] = useState(0);
  const [tiempoInicio, setTiempoInicio] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState('00:00');
  
  // Log de actividad
  const [logMessages, setLogMessages] = useState([]);
  
  // NUEVO: Estado para modo híbrido
  const [modoHibrido, setModoHibrido] = useState(false);
  const [helperGenerado, setHelperGenerado] = useState(null);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (enviando && tiempoInicio > 0) {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [enviando, tiempoInicio]);

  const loadContacts = () => {
    const saved = localStorage.getItem('whatsapp-contacts');
    const allContacts = saved ? JSON.parse(saved) : [];
    
    const pendientes = allContacts.filter(contact => 
      !contact.status || contact.status.toUpperCase() !== 'SI'
    );
    
    setContacts(allContacts);
    setFilteredContacts(pendientes);
    logMessage(`📋 Contactos cargados: ${allContacts.length} total, ${pendientes.length} pendientes`, 'info');
  };

  const logMessage = (mensaje, tipo = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const iconos = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const icono = iconos[tipo] || '📝';
    
    const newMessage = {
      id: Date.now() + Math.random(),
      timestamp,
      message: mensaje,
      type: tipo,
      icon: icono
    };
    
    setLogMessages(prev => [...prev, newMessage]);
  };

  const updateTime = () => {
    if (tiempoInicio > 0) {
      const elapsed = Math.floor((Date.now() - tiempoInicio) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setTiempoTranscurrido(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const previewMessage = () => {
    if (filteredContacts.length === 0) {
      alert('No hay contactos pendientes para previsualizar');
      return;
    }

    const sampleContact = filteredContacts[0];
    const personalizedMessage = sampleContact.message || 'Mensaje personalizado del Excel';
    
    alert(`Vista previa del mensaje:\n\n${personalizedMessage}`);
    logMessage(`👀 Vista previa generada para: ${sampleContact.name}`, 'info');
  };

  // NUEVA FUNCIÓN: Generar Helper Automático
  const generarHelperAutomatico = async () => {
    if (selectedContacts.length === 0) {
      alert('Por favor selecciona al menos un contacto');
      return;
    }

    const contactosAEnviar = filteredContacts.filter(c => selectedContacts.includes(c.id));
    
    if (!window.confirm(`🤖 GENERAR HELPER AUTOMÁTICO\n\n📊 Contactos: ${contactosAEnviar.length}\n⚡ Velocidad: ${velocidad}\n\n¿Generar archivo para envío 100% automático?\n\n💡 Se descargará un archivo Python que envía todos los mensajes solo.`)) {
      return;
    }

    try {
      setModoHibrido(true);
      setEnviando(true);
      setEstadoProceso('🔧 Generando helper automático...');
      
      logMessage('🚀 GENERANDO HELPER AUTOMÁTICO', 'success');
      logMessage(`📊 Contactos seleccionados: ${contactosAEnviar.length}`, 'info');
      logMessage(`⚡ Velocidad configurada: ${velocidad}`, 'info');

      // Generar helper automático
      const resultado = await helperGenerator.generarHelperAutomatico(contactosAEnviar, {
        velocidad: velocidad
      });

      if (resultado.success) {
        setHelperGenerado(resultado);
        setMostrarInstrucciones(true);
        setEstadoProceso('✅ Helper generado - Revisa las instrucciones');
        
        logMessage(`✅ Helper generado: ${resultado.archivo}`, 'success');
        logMessage('📥 Archivo descargado automáticamente', 'success');
        logMessage('👀 Revisa las instrucciones para continuar', 'info');

        // Generar instrucciones
        const instrucciones = helperGenerator.generarInstrucciones(resultado);
        
        alert(`🎉 ¡Helper Generado Exitosamente!\n\n${instrucciones.pasos.join('\n')}\n\n💡 El envío será 100% automático después de ejecutar el archivo.`);
        
      } else {
        throw new Error('No se pudo generar el helper');
      }

    } catch (error) {
      logMessage(`❌ Error generando helper: ${error.message}`, 'error');
      alert(`Error generando helper automático: ${error.message}`);
    } finally {
      setEnviando(false);
      setModoHibrido(false);
    }
  };

  // FUNCIÓN ORIGINAL: Envío web (para comparación)
  const iniciarEnvioWeb = async () => {
    if (selectedContacts.length === 0) {
      alert('Por favor selecciona al menos un contacto');
      return;
    }

    const contactosAEnviar = filteredContacts.filter(c => selectedContacts.includes(c.id));
    
    if (!window.confirm(`🌐 ENVÍO WEB (Requiere clicks)\n\n📊 Contactos: ${contactosAEnviar.length}\n👤 Clicks requeridos: ${contactosAEnviar.length}\n\n¿Continuar con envío web manual?`)) {
      return;
    }

    // Lógica original del envío web...
    setEnviando(true);
    setTiempoInicio(Date.now());
    setEnviadosCount(0);
    setFallidosCount(0);
    setProgreso(0);
    setEstadoProceso('🚀 Iniciando envío web...');
    
    logMessage('🌐 INICIANDO ENVÍO WEB (Manual)', 'info');
    
    try {
      await whatsappService.envioMasivo(contactosAEnviar, {
        velocidad: velocidad,
        onProgress: (progressData) => {
          const progresoPorcentaje = Math.round((progressData.current / progressData.total) * 100);
          setProgreso(progresoPorcentaje);
          setEstadoProceso(`📤 Enviando a ${progressData.contact.name}... (${progressData.current}/${progressData.total})`);
          setEnviadosCount(progressData.enviados);
          setFallidosCount(progressData.fallidos);
        },
        onLog: (mensaje, tipo) => {
          logMessage(mensaje, tipo);
        },
        onComplete: (resultados) => {
          setProgreso(100);
          setEstadoProceso('🎉 ¡Envío web completado!');
          
          const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
          logMessage('🎉 ENVÍO WEB COMPLETADO', 'success');
          logMessage(`⏱️ Tiempo total: ${Math.floor(tiempoTotal/60)}m ${tiempoTotal%60}s`, 'info');

          alert(`🎉 Envío web completado!\n\n✅ Exitosos: ${resultados.exitosos}\n❌ Fallidos: ${resultados.fallidos}\n📊 Tasa de éxito: ${resultados.tasaExito}%`);
          loadContacts();
        }
      });

    } catch (error) {
      logMessage(`❌ Error crítico: ${error.message}`, 'error');
      alert(`Error durante el envío: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const detenerEnvio = () => {
    if (enviando) {
      whatsappService.detenerEnvio();
      setEnviando(false);
      setEstadoProceso('⏹️ Envío detenido');
      logMessage('⏹️ Proceso detenido por el usuario', 'warning');
      alert('Envío detenido. El progreso se ha guardado automáticamente.');
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.25rem' }}>
          💬 Envío de Mensajes Masivo - Modo Híbrido
        </h1>
        <p style={{ color: '#718096' }}>
          Elige entre envío automático (helper) o envío web manual - {filteredContacts.length} mensajes pendientes
        </p>
      </div>

      {/* NUEVO: Indicador de modo */}
      {modoHibrido && (
        <div style={{ 
          backgroundColor: '#dff0d8', 
          border: '1px solid #d6e9c6',
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1rem'
        }}>
          <div style={{ fontWeight: 'bold', color: '#3c763d' }}>
            🤖 Modo Híbrido Activado
          </div>
          <div style={{ fontSize: '0.875rem', color: '#3c763d', marginTop: '0.25rem' }}>
            Generando helper para envío 100% automático...
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Panel Izquierdo - Configuración */}
        <div>
          {/* Selección de Contactos */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0', 
            padding: '1rem', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              👥 Seleccionar Contactos ({filteredContacts.length} pendientes)
            </h2>
            
            {filteredContacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p>No hay contactos pendientes</p>
                <p style={{ fontSize: '0.875rem' }}>Importa contactos con mensajes personalizados</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={handleSelectAll}
                    disabled={enviando}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: enviando ? '#e5e7eb' : '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      opacity: enviando ? 0.5 : 1
                    }}
                  >
                    {selectedContacts.length === filteredContacts.length ? 'Deseleccionar' : 'Seleccionar'} Todos
                  </button>
                  <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {selectedContacts.length} de {filteredContacts.length} seleccionados
                  </span>
                </div>

                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}>
                  {filteredContacts.map((contact) => (
                    <label key={contact.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.5rem',
                      cursor: enviando ? 'not-allowed' : 'pointer',
                      borderRadius: '0.25rem',
                      opacity: enviando ? 0.7 : 1
                    }}
                    onMouseOver={(e) => !enviando && (e.target.style.backgroundColor = '#f9fafb')}
                    onMouseOut={(e) => !enviando && (e.target.style.backgroundColor = 'transparent')}
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => !enviando && handleSelectContact(contact.id)}
                        disabled={enviando}
                        style={{ marginRight: '0.75rem', accentColor: '#25D366' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                          {contact.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {contact.phone}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#4b5563', fontStyle: 'italic' }}>
                          {contact.message ? `${contact.message.substring(0, 50)}...` : 'Sin mensaje'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Control de Velocidad */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0', 
            padding: '1rem', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              ⚡ Velocidad de Envío
            </h2>
            
            <select
              value={velocidad}
              onChange={(e) => setVelocidad(e.target.value)}
              disabled={enviando}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                opacity: enviando ? 0.5 : 1,
                cursor: enviando ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="Lenta (5-8s)">Lenta (5-8s) - Más segura</option>
              <option value="Normal (3-5s)">Normal (3-5s) - Recomendada</option>
              <option value="Rápida (2-3s)">Rápida (2-3s) - Mayor riesgo</option>
            </select>
            
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              💡 Velocidad más lenta reduce el riesgo de restricciones de WhatsApp
            </p>
          </div>

          {/* NUEVO: Botones de Control Híbrido */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0', 
            padding: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              🎛️ Modo de Envío
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={previewMessage}
                disabled={enviando || filteredContacts.length === 0}
                style={{
                  padding: '0.75rem',
                  backgroundColor: (enviando || filteredContacts.length === 0) ? '#e5e7eb' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (enviando || filteredContacts.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (enviando || filteredContacts.length === 0) ? 0.5 : 1,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                🔍 Previsualizar Mensajes
              </button>
              
              {/* BOTÓN PRINCIPAL: Helper Automático */}
              <button
                onClick={generarHelperAutomatico}
                disabled={enviando || selectedContacts.length === 0}
                style={{
                  padding: '1rem',
                  backgroundColor: (enviando || selectedContacts.length === 0) ? '#e5e7eb' : '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (enviando || selectedContacts.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (enviando || selectedContacts.length === 0) ? 0.5 : 1,
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {enviando && modoHibrido ? 
                  '🔧 GENERANDO HELPER...' : 
                  `🤖 GENERAR HELPER AUTOMÁTICO (${selectedContacts.length})`
                }
              </button>

              {/* NUEVO: BOTÓN DE DIAGNÓSTICO */}
              <button
                onClick={async () => {
                  try {
                    logMessage('🔍 Generando diagnóstico del sistema...', 'info');
                    const resultado = await helperGenerator.generarHelperDiagnostico([], {});
                    if (resultado.success) {
                      alert(`🔍 Diagnóstico generado: ${resultado.archivo}\n\n📋 Este archivo identificará exactamente qué está causando el problema.\n\n💡 Ejecuta el archivo descargado para ver un diagnóstico completo paso a paso.`);
                      logMessage(`✅ Diagnóstico generado: ${resultado.archivo}`, 'success');
                    }
                  } catch (error) {
                    alert(`Error generando diagnóstico: ${error.message}`);
                    logMessage(`❌ Error en diagnóstico: ${error.message}`, 'error');
                  }
                }}
                disabled={enviando}
                style={{
                  padding: '0.75rem',
                  backgroundColor: enviando ? '#e5e7eb' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  opacity: enviando ? 0.5 : 1,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                🔍 GENERAR DIAGNÓSTICO DEL SISTEMA
              </button>

              {/* BOTÓN SECUNDARIO: Envío Web */}
              <button
                onClick={iniciarEnvioWeb}
                disabled={enviando || selectedContacts.length === 0}
                style={{
                  padding: '0.75rem',
                  backgroundColor: (enviando || selectedContacts.length === 0) ? '#e5e7eb' : '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: (enviando || selectedContacts.length === 0) ? 'not-allowed' : 'pointer',
                  opacity: (enviando || selectedContacts.length === 0) ? 0.5 : 1,
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {enviando && !modoHibrido ? 
                  '🌐 ENVIANDO WEB...' : 
                  `🌐 Envío Web Manual (${selectedContacts.length} clicks)`
                }
              </button>
              
              {enviando && (
                <button
                  onClick={detenerEnvio}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ⏹️ DETENER ENVÍO
                </button>
              )}
            </div>

            {/* NUEVO: Comparación de métodos */}
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '0.375rem',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#495057', marginBottom: '0.5rem' }}>
                📊 Comparación de Métodos:
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#495057' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>🤖 Helper Automático:</strong> 100% automático, 0 clicks, te puedes ir
                </div>
                <div>
                  <strong>🌐 Envío Web:</strong> Requiere {selectedContacts.length} clicks, debes estar presente
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Progreso y Log */}
        <div>
          {/* Progreso */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0', 
            padding: '1rem', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              📊 Estado del Proceso
            </h2>
            
            {/* Estado */}
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#f8fafc', 
              borderRadius: '0.375rem', 
              marginBottom: '1rem',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {estadoProceso}
            </div>

            {/* Barra de progreso */}
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.5rem', 
              height: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                width: `${progreso}%`, 
                backgroundColor: modoHibrido ? '#ff6b6b' : '#25D366', 
                height: '100%', 
                borderRadius: '0.5rem',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              {progreso}% completado
            </div>

            {/* Estadísticas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '1rem', 
              marginTop: '1rem' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
                  {enviadosCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>✅ Enviados</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626' }}>
                  {fallidosCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>❌ Fallidos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {tiempoTranscurrido}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>⏱️ Tiempo</div>
              </div>
            </div>

            {/* NUEVO: Info del helper generado */}
            {helperGenerado && (
              <div style={{ 
                marginTop: '1rem',
                padding: '0.75rem', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '0.375rem',
                border: '1px solid #bae6fd'
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                  🤖 Helper Generado:
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
                  <div>📁 Archivo: {helperGenerado.archivo}</div>
                  <div>📊 Contactos: {helperGenerado.contactos}</div>
                  <div>🤖 Estado: Listo para ejecución automática</div>
                </div>
              </div>
            )}
          </div>

          {/* Log de Actividad */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0', 
            padding: '1rem' 
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              📝 Registro de Actividad
            </h2>
            
            <div style={{ 
              height: '300px', 
              overflowY: 'auto', 
              backgroundColor: '#f8fafc', 
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}>
              {logMessages.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                  El registro de actividad aparecerá aquí...
                </div>
              ) : (
                logMessages.map((log) => (
                  <div key={log.id} style={{ 
                    marginBottom: '0.25rem',
                    color: log.type === 'error' ? '#dc2626' : 
                           log.type === 'success' ? '#059669' : 
                           log.type === 'warning' ? '#d97706' : '#374151'
                  }}>
                    {log.icon} [{log.timestamp}] {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NUEVO: Modal de Instrucciones */}
      {mostrarInstrucciones && helperGenerado && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            padding: '2rem', 
            width: '100%', 
            maxWidth: '32rem', 
            margin: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1rem' }}>
              🤖 Helper Automático Generado
            </h2>
            
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '1rem', 
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontWeight: '600', color: '#0369a1' }}>📁 {helperGenerado.archivo}</div>
              <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                📊 {helperGenerado.contactos} contactos configurados
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                🚀 Instrucciones de Uso:
              </h3>
              <ol style={{ fontSize: '0.875rem', paddingLeft: '1rem', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  📁 Ve a tu carpeta "Descargas"
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  🐍 Asegúrate de tener Python instalado
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  💻 Haz doble-click en el archivo descargado
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  ☕ ¡Relájate! El envío será 100% automático
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  🎉 Al terminar se auto-elimina y muestra reporte
                </li>
              </ol>
            </div>

            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                💡 <strong>Nota:</strong> Si no tienes Python, descárgalo de python.org/downloads
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setMostrarInstrucciones(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                ✅ Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComposer;