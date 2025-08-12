import React, { useState, useEffect } from 'react';
import ExcelImporter from './ExcelImporter';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, contacts]);

  const loadContacts = () => {
    const saved = localStorage.getItem('whatsapp-contacts');
    const loadedContacts = saved ? JSON.parse(saved) : [];
    setContacts(loadedContacts);
  };

  const saveContacts = (newContacts) => {
    localStorage.setItem('whatsapp-contacts', JSON.stringify(newContacts));
    setContacts(newContacts);
  };

  const filterContacts = () => {
    if (!searchQuery) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const addContact = (contactData) => {
    const newContact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: contactData.name || '',
      phone: contactData.phone || '',
      email: contactData.email || '',
      company: contactData.company || '',
      city: contactData.city || '',
      createdAt: new Date().toISOString()
    };

    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);
    return newContact;
  };

  const deleteContact = (contactId) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    saveContacts(updatedContacts);
    setSelectedContacts(selectedContacts.filter(id => id !== contactId));
  };

  const deleteSelectedContacts = () => {
    if (window.confirm(`¿Eliminar ${selectedContacts.length} contactos seleccionados?`)) {
      const updatedContacts = contacts.filter(c => !selectedContacts.includes(c.id));
      saveContacts(updatedContacts);
      setSelectedContacts([]);
    }
  };

  const exportToCSV = () => {
    const headers = ['name', 'phone', 'email', 'company', 'city', 'createdAt'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => 
        headers.map(header => `"${contact[header] || ''}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contactos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.25rem' }}>
            Gestión de Contactos
          </h1>
          <p style={{ color: '#718096' }}>
            {contacts.length} contactos • {selectedContacts.length} seleccionados
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              backgroundColor: '#3182ce',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
          >
            📥 Importar Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
          >
            ➕ Agregar Contacto
          </button>
        </div>
      </div>

      {/* Search and Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        border: '1px solid #e2e8f0', 
        padding: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Buscar contactos por nombre, teléfono, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSelectAll}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              {selectedContacts.length === filteredContacts.length && filteredContacts.length > 0 ? 'Deseleccionar' : 'Seleccionar'} Todos
            </button>
            {selectedContacts.length > 0 && (
              <button
                onClick={deleteSelectedContacts}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#ef4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                🗑️ Eliminar ({selectedContacts.length})
              </button>
            )}
            <button
              onClick={exportToCSV}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              📤 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {filteredContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1a202c', marginBottom: '0.5rem' }}>
              {contacts.length === 0 ? 'No hay contactos' : 'No se encontraron contactos'}
            </h3>
            <p style={{ color: '#718096', marginBottom: '1rem' }}>
              {contacts.length === 0 
                ? 'Comienza importando contactos desde un archivo CSV'
                : 'Intenta con otros términos de búsqueda'
              }
            </p>
            {contacts.length === 0 && (
              <button
                onClick={() => setShowImportModal(true)}
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
              >
                Importar Contactos
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={handleSelectAll}
                      style={{ accentColor: '#25D366' }}
                    />
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Contacto
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Teléfono
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Email
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Empresa
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Agregado
                  </th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {filteredContacts.map((contact, index) => (
                  <tr key={contact.id} style={{ 
                    borderTop: index > 0 ? '1px solid #f3f4f6' : 'none',
                    '&:hover': { backgroundColor: '#f9fafb' }
                  }}>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        style={{ accentColor: '#25D366' }}
                      />
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          backgroundColor: '#e5e7eb', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#6b7280', 
                          fontWeight: '500',
                          marginRight: '1rem'
                        }}>
                          {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a202c' }}>
                            {contact.name || 'Sin nombre'}
                          </div>
                          {contact.city && (
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{contact.city}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1a202c', fontFamily: 'monospace' }}>{contact.phone}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1a202c' }}>{contact.email || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#1a202c' }}>{contact.company || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(contact.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500' }}>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        style={{
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#991b1b'}
                        onMouseOut={(e) => e.target.style.color = '#dc2626'}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showImportModal && (
        <ExcelImporter 
            onClose={() => setShowImportModal(false)}
            onImport={(newContacts) => {      
             const updatedContacts = [...contacts, ...newContacts];
            saveContacts(updatedContacts);
            setShowImportModal(false);
          }}
        />
      )}

      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(contactData) => {
            addContact(contactData);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Componente Modal de Importación
const ImportModal = ({ onClose, onImport }) => {
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return data;
  };

  const mapCSVRowToContact = (row) => {
    const phoneFields = ['phone', 'telefono', 'telephone', 'number', 'numero'];
    const nameFields = ['name', 'nombre', 'full_name', 'fullname'];
    const emailFields = ['email', 'correo', 'mail'];
    const companyFields = ['company', 'empresa', 'organization'];
    const cityFields = ['city', 'ciudad', 'location'];

    const findField = (fields, row) => {
      for (const field of fields) {
        if (row[field]) return row[field];
      }
      return '';
    };

    return {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: findField(nameFields, row),
      phone: findField(phoneFields, row),
      email: findField(emailFields, row),
      company: findField(companyFields, row),
      city: findField(cityFields, row),
      createdAt: new Date().toISOString()
    };
  };

  const handleImport = async () => {
    if (!csvText.trim()) {
      alert('Por favor selecciona un archivo CSV o pega el contenido');
      return;
    }

    setLoading(true);
    try {
      const csvData = parseCSV(csvText);
      const importedContacts = [];
      const errors = [];

      csvData.forEach((row, index) => {
        try {
          const contact = mapCSVRowToContact(row);
          if (contact.phone) {
            importedContacts.push(contact);
          } else {
            errors.push(`Fila ${index + 2}: Número de teléfono requerido`);
          }
        } catch (error) {
          errors.push(`Fila ${index + 2}: ${error.message}`);
        }
      });

      setResult({
        success: true,
        imported: importedContacts.length,
        errors: errors,
        contacts: importedContacts
      });

      if (importedContacts.length > 0) {
        setTimeout(() => {
          onImport(importedContacts);
        }, 2000);
      }

    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        imported: 0,
        errors: [error.message]
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 50 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        width: '100%', 
        maxWidth: '32rem', 
        margin: '1rem', 
        maxHeight: '90vh', 
        overflowY: 'auto' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>Importar Contactos</h2>
          <button 
            onClick={onClose} 
            style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {!result && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Seleccionar archivo CSV:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                O pega el contenido CSV:
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="nombre,telefono,email,empresa&#10;Juan Pérez,+1234567890,juan@email.com,Empresa ABC"
                style={{ 
                  width: '100%', 
                  height: '10rem', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #bfdbfe'
            }}>
              <h3 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '0.5rem' }}>📋 Formato esperado:</h3>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' }}>
                El CSV debe incluir al menos una columna de teléfono. Columnas reconocidas:
              </p>
              <ul style={{ fontSize: '0.875rem', color: '#1e40af', paddingLeft: '1rem' }}>
                <li><strong>Teléfono:</strong> phone, telefono, telephone, number, numero</li>
                <li><strong>Nombre:</strong> name, nombre, full_name, fullname</li>
                <li><strong>Email:</strong> email, correo, mail</li>
                <li><strong>Empresa:</strong> company, empresa, organization</li>
                <li><strong>Ciudad:</strong> city, ciudad, location</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={loading || !csvText.trim()}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading || !csvText.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !csvText.trim() ? 0.5 : 1
                }}
                onMouseOver={(e) => !loading && csvText.trim() && (e.target.style.backgroundColor = '#128C7E')}
                onMouseOut={(e) => !loading && csvText.trim() && (e.target.style.backgroundColor = '#25D366')}
              >
                {loading ? 'Importando...' : 'Importar Contactos'}
              </button>
            </div>
          </>
        )}

        {result && (
          <div style={{ textAlign: 'center' }}>
            {result.success ? (
              <div style={{ color: '#059669' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>¡Importación Exitosa!</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Se importaron <strong>{result.imported}</strong> contactos correctamente
                </p>
                {result.errors.length > 0 && (
                  <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #fbbf24' }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
                      {result.errors.length} filas con errores (se omitieron)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: '#dc2626' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>Error en la Importación</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{result.error}</p>
                <button
                  onClick={() => setResult(null)}
                  style={{
                    backgroundColor: '#3182ce',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
                >
                  Intentar de Nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Modal de Agregar Contacto
const AddContactModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      alert('El número de teléfono es requerido');
      return;
    }

    onAdd(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 50 
    }}>
    <div style={{ 
       backgroundColor: 'white', 
       borderRadius: '0.5rem', 
       padding: '1.5rem', 
       width: '100%', 
       maxWidth: '28rem', 
       margin: '1rem' 
     }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
         <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>Agregar Contacto</h2>
         <button 
           onClick={onClose} 
           style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
         >
           ✕
         </button>
       </div>

       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
             Nombre
           </label>
           <input
             type="text"
             name="name"
             value={formData.name}
             onChange={handleChange}
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               border: '1px solid #d1d5db', 
               borderRadius: '0.5rem',
               fontSize: '0.875rem'
             }}
             placeholder="Ej: Juan Pérez"
           />
         </div>

         <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
             Teléfono *
           </label>
           <input
             type="tel"
             name="phone"
             value={formData.phone}
             onChange={handleChange}
             required
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               border: '1px solid #d1d5db', 
               borderRadius: '0.5rem',
               fontSize: '0.875rem'
             }}
             placeholder="Ej: +1234567890"
           />
         </div>

         <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
             Email
           </label>
           <input
             type="email"
             name="email"
             value={formData.email}
             onChange={handleChange}
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               border: '1px solid #d1d5db', 
               borderRadius: '0.5rem',
               fontSize: '0.875rem'
             }}
             placeholder="Ej: juan@email.com"
           />
         </div>

         <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
             Empresa
           </label>
           <input
             type="text"
             name="company"
             value={formData.company}
             onChange={handleChange}
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               border: '1px solid #d1d5db', 
               borderRadius: '0.5rem',
               fontSize: '0.875rem'
             }}
             placeholder="Ej: Empresa ABC"
           />
         </div>

         <div>
           <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
             Ciudad
           </label>
           <input
             type="text"
             name="city"
             value={formData.city}
             onChange={handleChange}
             style={{ 
               width: '100%', 
               padding: '0.75rem', 
               border: '1px solid #d1d5db', 
               borderRadius: '0.5rem',
               fontSize: '0.875rem'
             }}
             placeholder="Ej: Madrid"
           />
         </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem' }}>
           <button
             type="button"
             onClick={onClose}
             style={{
               padding: '0.5rem 1rem',
               color: '#374151',
               backgroundColor: '#f3f4f6',
               border: 'none',
               borderRadius: '0.5rem',
               cursor: 'pointer'
             }}
             onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
             onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
           >
             Cancelar
           </button>
           <button
             type="submit"
             style={{
               padding: '0.5rem 1rem',
               backgroundColor: '#25D366',
               color: 'white',
               border: 'none',
               borderRadius: '0.5rem',
               cursor: 'pointer'
             }}
             onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
             onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
           >
             Agregar Contacto
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default ContactManager;