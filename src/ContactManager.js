import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';


// ESQUEMA ESTANDARIZADO DE DATOS
const CONTACT_SCHEMA = {
  id: '',
  nombre: '', // Campo unificado
  telefono: '', // Campo unificado  
  mensaje: '', // Campo obligatorio visible
  empresa: '',
  email: '',
  fechaCreacion: '',
  estado: 'PENDIENTE' // PENDIENTE, ENVIADO, FALLIDO
};

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState(CONTACT_SCHEMA);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);

  // FUNCIÓN CRÍTICA: Cargar y estandarizar contactos existentes
  const loadContacts = () => {
    try {
      const saved = localStorage.getItem('whatsapp-contacts');
      const rawContacts = saved ? JSON.parse(saved) : [];
      
      console.log('📋 Contactos raw cargados:', rawContacts);
      
      // ESTANDARIZAR todos los contactos al esquema único
      const standardizedContacts = rawContacts.map(contact => standardizeContact(contact));
      
      console.log('✅ Contactos estandarizados:', standardizedContacts);
      
      setContacts(standardizedContacts);
      
      // Guardar estructura estandarizada
      localStorage.setItem('whatsapp-contacts', JSON.stringify(standardizedContacts));
      
    } catch (error) {
      console.error('Error cargando contactos:', error);
      setContacts([]);
    }
  };

  // FUNCIÓN CENTRAL: Estandarizar cualquier estructura de contacto
  const standardizeContact = (rawContact) => {
    return {
      id: rawContact.id || generateUniqueId(),
      nombre: 
        rawContact.nombre || 
        rawContact.CONTACTO || 
        rawContact.contacto || 
        rawContact.Inquilino || 
        rawContact.inquilino || 
        'Sin nombre',
      telefono: 
        rawContact.telefono || 
        rawContact.TELÉFONO || 
        rawContact.telefono || 
        rawContact.NumeroTelefono || 
        rawContact.numeroTelefono || 
        rawContact.phone || 
        '',
      mensaje: 
        rawContact.mensaje || 
        rawContact.Mensaje || 
        rawContact.MESSAGE || 
        rawContact.message || 
        'Mensaje predeterminado',
      empresa: 
        rawContact.empresa || 
        rawContact.EMPRESA || 
        rawContact.Empresa || 
        '',
      email: 
        rawContact.email || 
        rawContact.EMAIL || 
        rawContact.Email || 
        '',
      fechaCreacion: 
        rawContact.fechaCreacion || 
        rawContact.AGREGADO || 
        rawContact.agregado || 
        new Date().toLocaleDateString(),
      estado: 
        rawContact.estado || 
        rawContact.EstatusEnvio || 
        rawContact.status || 
        'PENDIENTE'
    };
  };

  const generateUniqueId = () => {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const filterContacts = () => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.telefono.includes(searchTerm) ||
      contact.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredContacts(filtered);
  };

  // VALIDACIÓN ROBUSTA BASADA EN ESTÁNDARES
  const validateContact = (contact) => {
    const newErrors = {};

    if (!contact.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!contact.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s\-\(\)]{8,15}$/.test(contact.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    if (!contact.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio';
    } else if (contact.mensaje.length > 500) {
      newErrors.mensaje = 'El mensaje no puede exceder 500 caracteres';
    }

    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateContact(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Limpiar y estandarizar teléfono
    const cleanPhone = formData.telefono.replace(/[\s\-\(\)]/g, '');
    const standardizedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+51${cleanPhone}`;

    const contactToSave = {
      ...formData,
      telefono: standardizedPhone,
      fechaCreacion: editingContact ? formData.fechaCreacion : new Date().toLocaleDateString()
    };

    let updatedContacts;
    if (editingContact) {
      updatedContacts = contacts.map(contact =>
        contact.id === editingContact.id ? contactToSave : contact
      );
    } else {
      contactToSave.id = generateUniqueId();
      updatedContacts = [...contacts, contactToSave];
    }

    setContacts(updatedContacts);
    localStorage.setItem('whatsapp-contacts', JSON.stringify(updatedContacts));

    // Reset form
    setFormData(CONTACT_SCHEMA);
    setEditingContact(null);
    setShowModal(false);
    setErrors({});
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDelete = (contactId) => {
    if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setContacts(updatedContacts);
      localStorage.setItem('whatsapp-contacts', JSON.stringify(updatedContacts));
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

  // IMPORTACIÓN EXCEL MEJORADA
  const handleExcelImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Cargar SheetJS dinámicamente
      const XLSX = await import('xlsx');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('📊 Datos Excel raw:', jsonData);

        // Procesar y estandarizar datos del Excel
        const processedContacts = jsonData.map(row => {
          const standardized = standardizeContact(row);
          
          // Validar datos mínimos
          if (!standardized.nombre || standardized.nombre === 'Sin nombre' || 
              !standardized.telefono || standardized.telefono === '') {
            console.warn('⚠️ Contacto inválido omitido:', row);
            return null;
          }
          
          return standardized;
        }).filter(Boolean); // Eliminar nulos

        console.log('✅ Contactos procesados del Excel:', processedContacts);

        if (processedContacts.length === 0) {
          alert('No se encontraron contactos válidos en el archivo Excel');
          return;
        }

        // Combinar con contactos existentes
        const existingContacts = contacts;
        const newContacts = processedContacts.filter(newContact => 
          !existingContacts.some(existing => 
            existing.telefono === newContact.telefono
          )
        );

        if (newContacts.length === 0) {
          alert('Todos los contactos del Excel ya existen en el sistema');
          return;
        }

        const updatedContacts = [...existingContacts, ...newContacts];
        setContacts(updatedContacts);
        localStorage.setItem('whatsapp-contacts', JSON.stringify(updatedContacts));

        alert(`✅ Se importaron ${newContacts.length} contactos nuevos de ${processedContacts.length} procesados`);
        setShowImportModal(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importando Excel:', error);
      alert('Error al importar el archivo Excel');
    }

    // Reset input
    event.target.value = '';
  };

  const exportToCSV = () => {
    if (contacts.length === 0) {
      alert('No hay contactos para exportar');
      return;
    }

    const csvHeaders = ['Nombre', 'Teléfono', 'Mensaje', 'Empresa', 'Email', 'Estado', 'Fecha Creación'];
    const csvData = contacts.map(contact => [
      contact.nombre,
      contact.telefono,
      contact.mensaje,
      contact.empresa,
      contact.email,
      contact.estado,
      contact.fechaCreacion
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contactos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showMessage = (mensaje) => {
    setSelectedMessage(mensaje);
    setShowMessageModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ENVIADO': return '#28a745';
      case 'FALLIDO': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const getCompletitudPorcentaje = (contact) => {
    const campos = ['nombre', 'telefono', 'mensaje'];
    const completos = campos.filter(campo => contact[campo] && contact[campo].trim() !== '').length;
    return Math.round((completos / campos.length) * 100);
  };

  return (
    <div className="contact-manager">
      {/* Header con estadísticas */}
      <div className="manager-header">
        <h2>📱 Gestión de Contactos</h2>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{contacts.length}</span>
            <span className="stat-label">Total Contactos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{selectedContacts.length}</span>
            <span className="stat-label">Seleccionados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {contacts.filter(c => c.estado === 'ENVIADO').length}
            </span>
            <span className="stat-label">Enviados</span>
          </div>
        </div>
      </div>

      {/* Toolbar de acciones */}
      <div className="toolbar">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono, mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => {
              setFormData(CONTACT_SCHEMA);
              setEditingContact(null);
              setErrors({});
              setShowModal(true);
            }}
          >
            ➕ Agregar Contacto
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setShowImportModal(true)}
          >
            📊 Importar Excel
          </button>

          <button
            className="btn btn-info"
            onClick={exportToCSV}
            disabled={contacts.length === 0}
          >
            💾 Exportar CSV
          </button>

          {selectedContacts.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (window.confirm(`¿Eliminar ${selectedContacts.length} contactos seleccionados?`)) {
                  const updatedContacts = contacts.filter(c => !selectedContacts.includes(c.id));
                  setContacts(updatedContacts);
                  localStorage.setItem('whatsapp-contacts', JSON.stringify(updatedContacts));
                  setSelectedContacts([]);
                }
              }}
            >
              🗑️ Eliminar Seleccionados
            </button>
          )}
        </div>
      </div>

      {/* Tabla de contactos con columna MENSAJE */}
      <div className="contacts-table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th width="40">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th width="200">CONTACTO</th>
              <th width="150">TELÉFONO</th>
              <th width="250">MENSAJE</th>
              <th width="120">EMPRESA</th>
              <th width="80">ESTADO</th>
              <th width="100">COMPLETITUD</th>
              <th width="120">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {searchTerm ? 'No se encontraron contactos que coincidan con la búsqueda' : 'No hay contactos. Agrega contactos manualmente o importa desde Excel.'}
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id} className={selectedContacts.includes(contact.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                    />
                  </td>
                  <td>
                    <div className="contact-name">
                      <div className="avatar">{contact.nombre.charAt(0).toUpperCase()}</div>
                      <span>{contact.nombre}</span>
                    </div>
                  </td>
                  <td className="phone-cell">{contact.telefono}</td>
                  <td className="message-cell">
                    <div className="message-preview">
                      <span className="message-text">
                        {contact.mensaje.length > 50 
                          ? `${contact.mensaje.substring(0, 50)}...` 
                          : contact.mensaje
                        }
                      </span>
                      {contact.mensaje.length > 50 && (
                        <button 
                          className="view-full-message"
                          onClick={() => showMessage(contact.mensaje)}
                          title="Ver mensaje completo"
                        >
                          👁️
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{contact.empresa || '-'}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getEstadoColor(contact.estado) }}
                    >
                      {contact.estado}
                    </span>
                  </td>
                  <td>
                    <div className="completitud-bar">
                      <div 
                        className="completitud-fill"
                        style={{ width: `${getCompletitudPorcentaje(contact)}%` }}
                      ></div>
                      <span className="completitud-text">{getCompletitudPorcentaje(contact)}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(contact)}
                        title="Editar contacto"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(contact.id)}
                        title="Eliminar contacto"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales y formularios */}
      
      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className={errors.nombre ? 'error' : ''}
                    placeholder="Nombre del contacto"
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className={errors.telefono ? 'error' : ''}
                    placeholder="+51987654321"
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Mensaje *</label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  className={errors.mensaje ? 'error' : ''}
                  placeholder="Mensaje que se enviará por WhatsApp"
                  rows="3"
                  maxLength="500"
                />
                <div className="char-count">{formData.mensaje.length}/500</div>
                {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    placeholder="Empresa del contacto"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? 'error' : ''}
                    placeholder="email@ejemplo.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContact ? 'Actualizar' : 'Guardar'} Contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de importación Excel */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Importar Contactos desde Excel</h3>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>✕</button>
            </div>

            <div className="import-content">
              <div className="import-instructions">
                <h4>Formato del archivo Excel:</h4>
                <ul>
                  <li><strong>Columna A:</strong> Inquilino (Nombre del contacto)</li>
                  <li><strong>Columna B:</strong> NumeroTelefono</li>
                  <li><strong>Columna C:</strong> Mensaje</li>
                  <li><strong>Columna D:</strong> EstatusEnvio (opcional)</li>
                </ul>
              </div>

              <div className="file-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.ods"
                  onChange={handleExcelImport}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📊 Seleccionar Archivo Excel
                </button>
                <p className="file-info">Formatos soportados: .xlsx, .xls, .ods</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver mensaje completo */}
      {showMessageModal && (
        <div className="modal-overlay">
          <div className="modal message-modal">
            <div className="modal-header">
              <h3>Mensaje Completo</h3>
              <button className="modal-close" onClick={() => setShowMessageModal(false)}>✕</button>
            </div>
            <div className="message-content">
              <p>{selectedMessage}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .contact-manager {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
        }

        .stats-summary {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-section {
          flex: 1;
          max-width: 400px;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-large {
          padding: 15px 30px;
          font-size: 16px;
        }

        .contacts-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .contacts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .contacts-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
          font-size: 12px;
          text-transform: uppercase;
        }

        .contacts-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle;
        }

        .contacts-table tr:hover {
          background: #f8f9fa;
        }

        .contacts-table tr.selected {
          background: #e3f2fd;
        }

        .contact-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .phone-cell {
          font-family: monospace;
          font-size: 13px;
        }

        .message-cell {
          max-width: 250px;
        }

        .message-preview {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .message-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .view-full-message {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          opacity: 0.7;
        }

        .view-full-message:hover {
          opacity: 1;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .completitud-bar {
          position: relative;
          width: 80px;
          height: 20px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
        }

        .completitud-fill {
          height: 100%;
          background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
          transition: width 0.3s ease;
        }

        .completitud-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          font-weight: bold;
          color: #333;
        }

        .action-buttons-cell {
          display: flex;
          gap: 5px;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .btn-edit:hover {
          background: #e3f2fd;
        }

        .btn-delete:hover {
          background: #ffebee;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 40px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 10px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .message-modal {
          max-width: 500px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
        }

        .contact-form {
          padding: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-group {
          flex: 1;
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #dc3545;
        }

        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .char-count {
          text-align: right;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .import-content {
          padding: 20px;
        }

        .import-instructions {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .import-instructions h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .import-instructions ul {
          margin: 0;
          padding-left: 20px;
        }

        .import-instructions li {
          margin: 5px 0;
        }

        .file-upload {
          text-align: center;
          padding: 20px;
          border: 2px dashed #ddd;
          border-radius: 8px;
        }

        .file-info {
          margin-top: 10px;
          color: #666;
          font-size: 12px;
        }

        .message-content {
          padding: 20px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .contact-manager {
            padding: 10px;
          }

          .manager-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .toolbar {
            flex-direction: column;
            gap: 15px;
          }

          .action-buttons {
            flex-wrap: wrap;
            justify-content: center;
          }

          .contacts-table-container {
            overflow-x: auto;
          }

          .contacts-table {
            min-width: 1000px;
          }

          .form-row {
            flex-direction: column;
          }

          .modal {
            width: 95%;
            margin: 20px;
          }
        }
      }</style>
        .contact-manager {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
        }

        .stats-summary {
          display: flex;
          gap: 30px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-section {
          flex: 1;
          max-width: 400px;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-info {
          background: #17a2b8;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .contacts-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .contacts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .contacts-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
          font-size: 12px;
          text-transform: uppercase;
        }

        .contacts-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
          vertical-align: middle;
        }

        .contacts-table tr:hover {
          background: #f8f9fa;
        }

        .contacts-table tr.selected {
          background: #e3f2fd;
        }

        .contact-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .phone-cell {
          font-family: monospace;
          font-size: 13px;
        }

        .message-cell {
          max-width: 250px;
        }

        .message-preview {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .message-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .view-full-message {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          opacity: 0.7;
        }

        .view-full-message:hover {
          opacity: 1;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .completitud-bar {
          position: relative;
          width: 80px;
          height: 20px;
          background: #e9ecef;
          border-radius: 10px;
          overflow: hidden;
        }

        .completitud-fill {
          height: 100%;
          background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
          transition: width 0.3s ease;
        }

        .completitud-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 10px;
          font-weight: bold;
          color: #333;
        }

        .action-buttons-cell {
          display: flex;
          gap: 5px;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .btn-edit:hover {
          background: #e3f2fd;
        }

        .btn-delete:hover {
          background: #ffebee;
        }

        .no-data {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 40px;
        }
      `}</style>
    </div>
  );
};

export default ContactManager;