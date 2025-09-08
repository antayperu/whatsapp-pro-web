import React, { useState, useEffect } from 'react';
import whatsappService from '../services/WhatsAppService';
import helperGenerator from '../services/HelperGenerator';

// ESQUEMA ESTANDARIZADO - MISMO QUE CONTACTMANAGER
const CONTACT_SCHEMA = {
  id: '',
  nombre: '',
  telefono: '', 
  mensaje: '',
  empresa: '',
  email: '',
  fechaCreacion: '',
  estado: 'PENDIENTE'
};

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
  
  // Estados para comunicación
  const [contactoActual, setContactoActual] = useState('');
  
  // Estados existentes para modo híbrido
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

  // FUNCIÓN SINCRONIZADA: Lee estructura estandarizada desde ContactManager
  const loadContacts = () => {
    try {
      const saved = localStorage.getItem('whatsapp-contacts');
      const allContacts = saved ? JSON.parse(saved) : [];
      
      console.log('📋 Contactos cargados desde localStorage:', allContacts);
      
      // FILTRAR contactos con datos válidos para envío
      const contactosValidosParaEnvio = allContacts.filter(contact => {
        // Verificar campos obligatorios usando esquema estandarizado
        const tieneNombre = contact.nombre && contact.nombre.trim() !== '' && contact.nombre !== 'Sin nombre';
        const tieneTelefono = contact.telefono && contact.telefono.trim() !== '';
        const tieneMensaje = contact.mensaje && contact.mensaje.trim() !== '';
        
        const esValido = tieneNombre && tieneTelefono && tieneMensaje;
        
        if (!esValido) {
          console.log(`⚠️ Contacto inválido omitido: ${contact.nombre || 'Sin nombre'} - Nombre: ${tieneNombre}, Teléfono: ${tieneTelefono}, Mensaje: ${tieneMensaje}`);
        }
        
        return esValido;
      });
      
      // Mapear a estructura interna para compatibilidad
      const contactosFormateados = contactosValidosParaEnvio.map(contact => ({
        id: contact.id,
        nombre: contact.nombre,
        telefono: contact.telefono,
        mensaje: contact.mensaje,
        empresa: contact.empresa || '',
        estado: contact.estado || 'PENDIENTE',
        fechaCreacion: contact.fechaCreacion || new Date().toLocaleDateString()
      }));
      
      console.log(`📊 Resultado final: ${allContacts.length} total → ${contactosValidosParaEnvio.length} válidos → ${contactosFormateados.length} listos para envío`);
      
      setContacts(allContacts);
      setFilteredContacts(contactosFormateados);
      
      logMessage(`📋 Contactos sincronizados: ${allContacts.length} total, ${contactosFormateados.length} listos para envío`, 'info');
      
      // Mostrar detalles si hay diferencias
      if (allContacts.length !== contactosFormateados.length) {
        const faltantes = allContacts.length - contactosFormateados.length;
        logMessage(`⚠️ ${faltantes} contactos omitidos por datos incompletos (revisar nombre, teléfono, mensaje)`, 'warning');
      }
      
    } catch (error) {
      console.error('Error cargando contactos:', error);
      logMessage('❌ Error cargando contactos desde localStorage', 'error');
      setContacts([]);
      setFilteredContacts([]);
    }
  };

  const logMessage = (mensaje, tipo = 'info', timestamp = null) => {
    const tiempo = timestamp || new Date().toLocaleTimeString();
    const iconos = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const icono = iconos[tipo] || '📝';
    
    const newMessage = {
      id: Date.now() + Math.random(),
      timestamp: tiempo,
      message: mensaje,
      type: tipo,
      icon: icono
    };
    
    setLogMessages(prev => {
      const nuevosLogs = [...prev, newMessage];
      return nuevosLogs.slice(-50);
    });
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
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };
const verificarProcesoCompletado = () => {
  const intervalo = setInterval(() => {
    const terminado = window.confirm(
      "¿El proceso de envío ha terminado?\n\n" +
      "Marca 'Aceptar' si:\n" +
      "- La ventana CMD se cerró\n" +
      "- Viste el mensaje 'Proceso completado'\n" +
      "- No hay más actividad en la ventana"
    );
    
    if (terminado) {
      clearInterval(intervalo);
      setEnviando(false);
      setProgreso(100);
      setEstadoProceso('✅ Envío completado - Revisa estadísticas en CMD');
      logMessage('🎉 Proceso de envío completado exitosamente', 'success');
      logMessage('📊 Revisa la ventana CMD para estadísticas detalladas', 'info');
    }
  }, 30000);
  
  setTimeout(() => clearInterval(intervalo), 600000);
};
  
// FUNCIÓN PRINCIPAL: Corregida para usar HelperGenerator
  const generarHelperAutomatico = async () => {
    try {
      if (selectedContacts.length === 0) {
        logMessage('⚠️ Selecciona al menos un contacto para enviar', 'warning');
        return;
      }

      console.log('🚀 Iniciando generación de helper automático...');
      
      // Preparar contactos seleccionados con estructura correcta
      const contactosParaEnviar = filteredContacts
        .filter(contact => selectedContacts.includes(contact.id))
        .map(contact => ({
          name: contact.nombre,    // Mapear nombre correcto
          phone: contact.telefono, // Mapear teléfono correcto
          message: contact.mensaje // Mapear mensaje correcto
        }));

      console.log('📋 Contactos preparados para envío:', contactosParaEnviar);

      // Validación final de datos
      const contactosValidados = contactosParaEnviar.filter(contact => {
        if (!contact.name || !contact.phone || !contact.message) {
          logMessage(`❌ Contacto ${contact.name || 'Sin nombre'} omitido por datos incompletos`, 'error');
          return false;
        }
        return true;
      });

      if (contactosValidados.length === 0) {
        logMessage('❌ No hay contactos válidos seleccionados', 'error');
        return;
      }

      // Configurar opciones
      const opciones = {
        velocidad: velocidad,
        timestamp: new Date().toISOString()
      };

      // Configurar estados UI
      setEnviando(true);
      setTiempoInicio(Date.now());
      setProgreso(0);
      setEnviadosCount(0);
      setFallidosCount(0);
      
      logMessage(`🚀 Generando helper para ${contactosValidados.length} contactos`, 'info');
      logMessage(`⚡ Velocidad configurada: ${velocidad}`, 'info');

      // ✅ LÍNEA CRÍTICA CORREGIDA: Usar HelperGenerator en lugar de PythonExecutor
      const resultado = await helperGenerator.generarHelperAutomatico(contactosValidados, opciones);

      if (resultado.success) {
        logMessage(`✅ ${resultado.message}`, 'success');
        logMessage(`📄 Archivo generado: ${resultado.archivo}`, 'info');
        logMessage(`💻 Ejecuta el archivo .BAT - El progreso se muestra en esa ventana`, 'info');
        logMessage(`⏱️ Tiempo estimado: ${Math.ceil(contactosValidados.length * 4 / 60)} minutos`, 'info');

        if (resultado.success) {
          logMessage(`✅ ${resultado.message}`, 'success');
          logMessage(`📄 Archivo generado: ${resultado.archivo}`, 'info');
          logMessage(`💻 Ejecuta el archivo .BAT - El progreso se muestra en esa ventana`, 'info');
          
          // AGREGAR ESTA LÍNEA:
          verificarProcesoCompletado();
          
          setProgreso(100);
          setEstadoProceso('✅ Helper generado. Ejecuta el archivo .BAT descargado.');
        }
        
        // Simular progreso para la UI (ya que el proceso real será externo)
        setProgreso(100);
        setEstadoProceso('✅ Helper generado. Ejecuta el archivo .BAT descargado.');
      } else {
        logMessage(`❌ Error: ${resultado.error}`, 'error');
        setEstadoProceso('❌ Error generando helper');
      }

      setEnviando(false);

    } catch (error) {
      console.error('Error en generarHelperAutomatico:', error);
      logMessage(`❌ Error inesperado: ${error.message}`, 'error');
      setEnviando(false);
      setEstadoProceso('❌ Error inesperado');
    }
  };

  // FUNCIÓN DIAGNÓSTICO: Corregida para usar HelperGenerator
  const generarHelperDiagnostico = async () => {
    try {
      logMessage('🔍 Generando helper de diagnóstico...', 'info');
      
      // ✅ USAR HELPERGENERATOR
      const resultado = await helperGenerator.generarHelperDiagnostico();
      
      if (resultado.success) {
        logMessage(`✅ Helper de diagnóstico generado: ${resultado.archivo}`, 'success');
      } else {
        logMessage(`❌ Error generando diagnóstico: ${resultado.error}`, 'error');
      }
    } catch (error) {
      logMessage(`❌ Error en diagnóstico: ${error.message}`, 'error');
    }
  };

  // FUNCIÓN WEB: Envío web como fallback
  const iniciarEnvioWeb = async () => {
    if (selectedContacts.length === 0) {
      logMessage('⚠️ Selecciona al menos un contacto para enviar', 'warning');
      return;
    }

    setEnviando(true);
    setTiempoInicio(Date.now());
    setProgreso(0);
    setEnviadosCount(0);
    setFallidosCount(0);

    logMessage(`🌐 Iniciando envío web a ${selectedContacts.length} contactos`, 'info');

    const contactosParaEnviar = filteredContacts.filter(contact => 
      selectedContacts.includes(contact.id)
    );

    let enviados = 0;
    let fallidos = 0;

    for (let i = 0; i < contactosParaEnviar.length; i++) {
      const contact = contactosParaEnviar[i];
      setEstadoProceso(`Enviando a ${contact.nombre}... (${i + 1}/${contactosParaEnviar.length})`);
      
      try {
        await whatsappService.sendMessage(contact.telefono, contact.mensaje);
        enviados++;
        setEnviadosCount(enviados);
        logMessage(`✅ Mensaje enviado a ${contact.nombre}`, 'success');
      } catch (error) {
        fallidos++;
        setFallidosCount(fallidos);
        logMessage(`❌ Error enviando a ${contact.nombre}: ${error.message}`, 'error');
      }

      setProgreso(Math.round(((i + 1) / contactosParaEnviar.length) * 100));
      
      if (i < contactosParaEnviar.length - 1) {
        const delay = velocidad.includes('Lenta') ? 5000 : 
                     velocidad.includes('Rápida') ? 2000 : 3000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setEnviando(false);
    setEstadoProceso(`✅ Envío completado: ${enviados} enviados, ${fallidos} fallidos`);
    logMessage(`📊 Resumen final: ${enviados} enviados, ${fallidos} fallidos`, 'success');
  };

  // Función para recargar contactos cuando hay cambios
  const recargarContactos = () => {
    loadContacts();
    logMessage('🔄 Contactos recargados desde gestión de contactos', 'info');
  };

  return (
    <div className="message-composer">
      <div className="composer-header">
        <h2>📱 Compositor de Mensajes</h2>
        <div className="stats-bar">
          <span>📋 Total: {filteredContacts.length}</span>
          <span>✅ Seleccionados: {selectedContacts.length}</span>
          <span>📤 Enviados: {enviadosCount}</span>
          <span>❌ Fallidos: {fallidosCount}</span>
          <span>⏱️ Tiempo: {tiempoTranscurrido}</span>
        </div>
      </div>

      {/* Panel de control de velocidad */}
      <div className="control-panel">
        <div className="velocity-control">
          <label>⚡ Velocidad de envío:</label>
          <select 
            value={velocidad} 
            onChange={(e) => setVelocidad(e.target.value)}
            disabled={enviando}
          >
            <option value="Lenta (5-7s)">🐌 Lenta (5-7s) - Más seguro</option>
            <option value="Normal (3-5s)">⚡ Normal (3-5s) - Recomendado</option>
            <option value="Rápida (1-2s)">🚀 Rápida (1-2s) - Riesgo alto</option>
          </select>
        </div>

        <div className="sync-control">
          <button
            className="btn btn-outline"
            onClick={recargarContactos}
            disabled={enviando}
            title="Recargar contactos desde gestión"
          >
            🔄 Sincronizar Contactos
          </button>
        </div>
      </div>

      {/* Estado del proceso */}
      <div className="process-status">
        <div className="status-header">
          <h3>📊 Estado del Proceso</h3>
          <div className="status-indicators">
            {enviando ? (
              <span className="indicator active">🟢 Activo</span>
            ) : (
              <span className="indicator ready">🔵 Listo</span>
            )}
          </div>
        </div>
        
        <div className="status-info">
          <p><strong>Estado:</strong> {estadoProceso}</p>
          {contactoActual && <p><strong>Contacto actual:</strong> {contactoActual}</p>}
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            <span className="progress-text">{progreso}%</span>
          </div>
        </div>
      </div>

      {/* BOTONES PRINCIPALES */}
      <div className="main-actions">
        <div className="primary-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={generarHelperAutomatico}
            disabled={enviando || selectedContacts.length === 0}
          >
            🚀 GENERAR HELPER AUTOMÁTICO
          </button>
          
          <button
            disabled={true}
            style={{
              padding: '0.75rem',
              backgroundColor: '#e5e7eb',
              color: '#9ca3af',
              cursor: 'not-allowed',
              opacity: 0.5
            }}
          >
            🌐 Envío Web Manual (Próximamente)
          </button>
          
       <button
          onClick={async () => {
            const resultado = await helperGenerator.generarHelperDiagnostico([], {});
            if (resultado.success) {
              alert(`Diagnóstico generado: ${resultado.archivo}`);
            }
          }}
          style={{
            padding: '0.75rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          🔍 GENERAR DIAGNÓSTICO DEL SISTEMA
        </button>
        </div>

        {/* Instrucciones básicas */}
        <div className="process-instructions">
          <p>💡 <strong>Instrucciones:</strong></p>
          <ul>
            <li>✅ Selecciona los contactos para enviar</li>
            <li>📄 Genera el helper y ejecuta el archivo .BAT descargado</li>
            <li>📁 Ubica y ejecuta el archivo .BAT descargado</li>
            <li>🖥️ Sigue las instrucciones en la ventana de comandos</li>
            <li>✅ El proceso se ejecutará automáticamente</li>
          </ul>
        </div>
      </div>

      {/* Lista de contactos SINCRONIZADA con ContactManager */}
      <div className="contacts-section">
        <div className="contacts-header">
          <h3>📋 Contactos Listos para Envío ({filteredContacts.length})</h3>
          {filteredContacts.length > 0 && (
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                onChange={handleSelectAll}
                disabled={enviando}
              />
              Seleccionar todos
            </label>
          )}
        </div>

        <div className="contacts-list">
          {filteredContacts.length === 0 ? (
            <div className="no-contacts">
              <p>📭 No hay contactos listos para envío</p>
              <p>Asegúrate de que los contactos tengan <strong>nombre</strong>, <strong>teléfono</strong> y <strong>mensaje</strong> completos</p>
              <button 
                className="btn btn-primary"
                onClick={recargarContactos}
              >
                🔄 Recargar Contactos
              </button>
            </div>
          ) : (
            filteredContacts.slice(0, 50).map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedContacts.includes(contact.id) ? 'selected' : ''}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    disabled={enviando}
                  />
                  <div className="contact-info">
                    <div className="contact-header">
                      <span className="contact-name">{contact.nombre}</span>
                      <span className="contact-phone">{contact.telefono}</span>
                      {contact.empresa && (
                        <span className="contact-company">({contact.empresa})</span>
                      )}
                    </div>
                    <div className="contact-message">
                      <strong>Mensaje:</strong> {contact.mensaje.length > 100 
                        ? `${contact.mensaje.substring(0, 100)}...` 
                        : contact.mensaje}
                    </div>
                    <div className="contact-meta">
                      <span className="contact-state">Estado: {contact.estado}</span>
                      <span className="contact-date">Agregado: {contact.fechaCreacion}</span>
                    </div>
                  </div>
                </label>
              </div>
            ))
          )}
          
          {filteredContacts.length > 50 && (
            <div className="contacts-pagination">
              <p>Mostrando 50 de {filteredContacts.length} contactos</p>
            </div>
          )}
        </div>
      </div>

      {/* LOG DE ACTIVIDAD */}
      <div className="activity-log">
        <div className="log-header">
          <h3>📝 Log de Actividad</h3>
          <button 
            className="btn btn-small"
            onClick={() => setLogMessages([])}
          >
            🗑️ Limpiar
          </button>
        </div>
        
        <div className="log-container">
          {logMessages.length === 0 ? (
            <p className="log-empty">Sin actividad registrada</p>
          ) : (
            logMessages.slice(-20).map((log) => (
              <div key={log.id} className={`log-entry log-${log.type}`}>
                <span className="log-time">{log.timestamp}</span>
                <span className="log-icon">{log.icon}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
        
        {logMessages.length > 20 && (
          <div className="log-footer">
            <p>Mostrando últimos 20 de {logMessages.length} mensajes</p>
          </div>
        )}
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        .message-composer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .composer-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .stats-bar {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 14px;
        }

        .control-panel {
          background: white;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .velocity-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .velocity-control select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .sync-control {
          display: flex;
          align-items: center;
        }

        .btn-outline {
          background: white;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn-outline:hover:not(:disabled) {
          background: #007bff;
          color: white;
        }

        .process-status {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .status-indicators {
          display: flex;
          gap: 10px;
        }

        .indicator {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .indicator.active { background: #d4edda; color: #155724; }
        .indicator.ready { background: #d1ecf1; color: #0c5460; }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .progress-bar {
          flex: 1;
          height: 20px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745, #20c997);
          transition: width 0.3s ease;
          border-radius: 10px;
        }

        .progress-text {
          font-weight: bold;
          color: #495057;
        }

        .main-actions {
          margin-bottom: 30px;
        }

        .primary-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .process-instructions {
          margin-top: 15px;
          font-size: 14px;
        }

        .process-instructions ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .btn-large {
          padding: 15px 30px;
          font-size: 16px;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }

        .contacts-section {
          background: white;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .contacts-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .select-all {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .contacts-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .no-contacts {
          padding: 40px 20px;
          text-align: center;
          color: #666;
        }

        .no-contacts p {
          margin: 10px 0;
        }

        .contact-item {
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s ease;
        }

        .contact-item:hover {
          background: #f8f9fa;
        }

        .contact-item.selected {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
        }

        .contact-item label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          width: 100%;
        }

        .contact-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-header {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .contact-name {
          font-weight: bold;
          color: #333;
        }

        .contact-phone {
          color: #666;
          font-size: 14px;
          font-family: monospace;
        }

        .contact-company {
          color: #888;
          font-size: 13px;
          font-style: italic;
        }

        .contact-message {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.4;
        }

        .contact-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #666;
        }

        .contact-state {
          font-weight: 500;
        }

        .contacts-pagination {
          padding: 15px 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .activity-log {
          background: white;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
        }

        .log-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .log-container {
          padding: 10px 20px;
          max-height: 400px;
          overflow-y: auto;
          background: #fafafa;
        }

        .log-empty {
          text-align: center;
          color: #999;
          padding: 20px;
          font-style: italic;
        }

        .log-entry {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .log-entry:last-child {
          border-bottom: none;
        }

        .log-time {
          color: #666;
          font-family: monospace;
          flex-shrink: 0;
          font-size: 12px;
        }

        .log-icon {
          flex-shrink: 0;
        }

        .log-message {
          flex: 1;
          word-break: break-word;
        }

        .log-success .log-message { color: #28a745; }
        .log-error .log-message { color: #dc3545; }
        .log-warning .log-message { color: #ffc107; }
        .log-info .log-message { color: #17a2b8; }

        .log-footer {
          padding: 10px 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .message-composer {
            padding: 10px;
          }

          .stats-bar {
            flex-direction: column;
            gap: 5px;
          }

          .control-panel {
            flex-direction: column;
            gap: 15px;
          }

          .primary-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            text-align: center;
          }

          .contacts-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .status-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .contact-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageComposer;