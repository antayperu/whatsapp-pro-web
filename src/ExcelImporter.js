import React, { useState } from 'react';

const ExcelImporter = ({ onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // Función principal para procesar Excel según tu documentación
  const processExcelFile = async (file) => {
    try {
      setLoading(true);
      
      // Leer archivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Cargar SheetJS dinámicamente
const XLSX = await loadXLSX();

    // Función para cargar XLSX
    async function loadXLSX() {
      return new Promise((resolve, reject) => {
        if (window.XLSX) {
          resolve(window.XLSX);
          return;
        }
    
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = () => {
          if (window.XLSX) {
            resolve(window.XLSX);
          } else {
            reject(new Error('No se pudo cargar la librería XLSX'));
          }
        };
        script.onerror = () => reject(new Error('Error cargando XLSX desde CDN'));
        document.head.appendChild(script);
      });
    }
      
      // Leer workbook con configuración según tu documentación
      const workbook = XLSX.read(arrayBuffer, {
        cellStyles: true,    // Colors and formatting
        cellFormulas: true,  // Formulas
        cellDates: true,     // Date handling
        cellNF: true,        // Number formatting
        sheetStubs: true     // Empty cells
      });

      // Explorar estructura del archivo
      console.log('Workbook metadata:', workbook.Workbook);
      
      // Obtener primera hoja de trabajo
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      console.log('Sheet metadata:', Object.keys(worksheet).filter(key => key.startsWith('!')));
      
      // Convertir a JSON con headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '', // Valor por defecto para celdas vacías
        blankrows: false // Omitir filas vacías
      });

      // Procesar datos según tu estructura
      return processDataStructure(jsonData, XLSX, worksheet);

    } catch (error) {
      console.error('Error procesando Excel:', error);
      throw new Error(`Error procesando archivo Excel: ${error.message}`);
    }
  };

  // Procesar estructura de datos según tu formato
  const processDataStructure = (data, XLSX, worksheet) => {
    if (data.length < 2) {
      throw new Error('El archivo debe tener al menos una fila de headers y una fila de datos');
    }

    const headers = data[0];
    const rows = data.slice(1);

    console.log('Headers encontrados:', headers);
    console.log('Total de filas:', rows.length);

    // Mapear headers según tu estructura: Inquilino | NumeroTelefono | Mensaje | EstatusEnvio
    const headerMapping = mapHeaders(headers);
    
    if (!headerMapping.numeroTelefono) {
  throw new Error(`Falta la columna de teléfono.\n\nHeaders encontrados: ${headers.join(', ')}\n\nNecesitamos al menos una columna de números de teléfono.`);
    }

    // Inquilino es opcional, se puede usar un valor por defecto
    if (!headerMapping.inquilino) {
    console.log('⚠️ No se encontró columna Inquilino, se usará valor por defecto');
    }

    // Procesar cada fila
    const processedContacts = [];
    const errors = [];

    rows.forEach((row, index) => {
      try {
        const contact = processRow(row, headerMapping, index + 2); // +2 porque empezamos en fila 2
        if (contact) {
          processedContacts.push(contact);
        }
      } catch (error) {
        errors.push(`Fila ${index + 2}: ${error.message}`);
      }
    });

    return {
      success: true,
      contacts: processedContacts,
      errors: errors,
      totalRows: rows.length,
      processedRows: processedContacts.length,
      headerMapping: headerMapping
    };
  };

 // Mapear headers según tu estructura específica REAL - VERSIÓN FLEXIBLE
const mapHeaders = (headers) => {
  const mapping = {};
  
  headers.forEach((header, index) => {
    const cleanHeader = header.toString().toLowerCase().trim().replace(/\s+/g, '');
    
    // Mapeo FLEXIBLE para NumeroTelefono
    if (cleanHeader.includes('numerotelefono') || 
        cleanHeader.includes('numero') || 
        cleanHeader.includes('telefono') || 
        cleanHeader.includes('phone') || 
        cleanHeader.includes('tel')) {
      mapping.numeroTelefono = index;
    } 
    // Mapeo FLEXIBLE para Inquilino
    else if (cleanHeader.includes('inquilino') || 
             cleanHeader.includes('nombre') || 
             cleanHeader.includes('cliente') || 
             cleanHeader.includes('empresa') ||
             cleanHeader.includes('name')) {
      mapping.inquilino = index;
    } 
    // Mapeo FLEXIBLE para Mensaje
    else if (cleanHeader.includes('mensaje') || 
             cleanHeader.includes('message') || 
             cleanHeader.includes('texto') ||
             cleanHeader.includes('contenido')) {
      mapping.mensaje = index;
    } 
    // Mapeo para EstatusEnvio
    else if (cleanHeader.includes('estatus') || 
             cleanHeader.includes('status') || 
             cleanHeader.includes('estado')) {
      mapping.estatusEnvio = index;
    }
  });

  console.log('Headers originales:', headers);
  console.log('Header mapping encontrado:', mapping);
  return mapping;
};

  // Procesar fila individual según tu estructura REAL
const processRow = (row, mapping, rowNumber) => {
  // Extraer datos según el mapeo EXACTO
  const numeroTelefono = row[mapping.numeroTelefono]?.toString().trim() || '';
  const inquilino = row[mapping.inquilino]?.toString().trim() || '';
  const mensaje = row[mapping.mensaje]?.toString().trim() || '';
  const estatusEnvio = row[mapping.estatusEnvio]?.toString().trim() || 'NO';

  // Validación según tu estructura
  if (!numeroTelefono) {
    throw new Error('NumeroTelefono es requerido');
  }
  
  if (!inquilino) {
    inquilino = 'Sin nombre'; // Valor por defecto
  }

    if (!mensaje) {
        mensaje = 'Mensaje personalizado'; // Valor por defecto
        }

  // Crear contacto según tu estructura EXACTA
  return {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: inquilino,
    phone: numeroTelefono,
    email: '', // No usado en tu app original
    company: inquilino, // Inquilino es la empresa
    city: '', // No usado en tu app original
    message: mensaje, // Campo específico de tu estructura
    status: estatusEnvio, // Campo específico de tu estructura
    createdAt: new Date().toISOString(),
    source: 'excel_import'
  };
};

  // Formatear número de teléfono
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Si no empieza con +, agregar código de país por defecto
    if (!cleaned.startsWith('+')) {
      // Detectar si es número peruano (tu caso)
      if (cleaned.startsWith('51') && cleaned.length >= 11) {
        cleaned = '+' + cleaned;
      } else if (cleaned.length >= 9) {
        cleaned = '+51' + cleaned; // Código de Perú por defecto
      }
    }
    
    return cleaned;
  };

  // Manejar selección de archivo
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validar tipo de archivo
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.oasis.opendocument.spreadsheet' // .ods
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|ods)$/i)) {
        alert('Por favor selecciona un archivo Excel válido (.xlsx, .xls)');
        return;
      }

      setFile(selectedFile);
      setResult(null);
      setPreviewData(null);
    }
  };

  // Procesar archivo
  const handleProcess = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo Excel');
      return;
    }

    try {
      setLoading(true);
      const result = await processExcelFile(file);
      
      setResult(result);
      setPreviewData(result.contacts.slice(0, 5)); // Mostrar preview de primeros 5 contactos
      
      if (result.success && result.contacts.length > 0) {
        setTimeout(() => {
          onImport(result.contacts);
        }, 3000); // Dar tiempo para ver el resultado
      }

    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        contacts: [],
        errors: [error.message]
      });
    } finally {
      setLoading(false);
    }
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
        maxWidth: '48rem', 
        margin: '1rem', 
        maxHeight: '90vh', 
        overflowY: 'auto' 
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c' }}>
            Importar Archivo Excel
          </h2>
          <button 
            onClick={onClose} 
            style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {!result && (
          <>
            {/* Estructura esperada */}
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #bfdbfe'
            }}>
              <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                📋 Estructura Excel Esperada:
              </h3>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '0.75rem', 
                borderRadius: '0.25rem', 
                fontFamily: 'monospace', 
                fontSize: '0.875rem',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Inquilino | NumeroTelefono | Mensaje | EstatusEnvio
                </div>
                <div style={{ color: '#6b7280' }}>
                  Veterinaria San Antonio | 51921566036 | Mensaje personalizado | NO
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', marginTop: '0.5rem' }}>
                <strong>Columnas requeridas:</strong> Inquilino, NumeroTelefono<br/>
                <strong>Columnas opcionales:</strong> Mensaje, EstatusEnvio, Email, Ciudad
              </p>
            </div>

            {/* Selección de archivo */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Seleccionar archivo Excel (.xlsx, .xls):
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.ods"
                onChange={handleFileSelect}
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              />
              {file && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#059669' }}>
                  ✅ Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Botones */}
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
                onClick={handleProcess}
                disabled={!file || loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: !file || loading ? 'not-allowed' : 'pointer',
                  opacity: !file || loading ? 0.5 : 1
                }}
                onMouseOver={(e) => file && !loading && (e.target.style.backgroundColor = '#128C7E')}
                onMouseOut={(e) => file && !loading && (e.target.style.backgroundColor = '#25D366')}
              >
                {loading ? 'Procesando...' : 'Procesar Excel'}
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  border: '2px solid #e2e8f0', 
                  borderTop: '2px solid #25D366', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto 1rem auto' 
                }}></div>
                <p style={{ color: '#6b7280' }}>Procesando archivo Excel...</p>
              </div>
            )}
          </>
        )}

        {/* Resultados */}
        {result && (
          <div style={{ textAlign: 'center' }}>
            {result.success ? (
              <div style={{ color: '#059669' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  ¡Importación Excel Exitosa!
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>{result.processedRows}</strong> contactos procesados de <strong>{result.totalRows}</strong> filas
                  </p>
                  {result.errors.length > 0 && (
                    <p style={{ fontSize: '0.875rem', color: '#d97706' }}>
                      {result.errors.length} filas con errores (omitidas)
                    </p>
                  )}
                </div>

                {/* Preview de contactos */}
                {previewData && previewData.length > 0 && (
                  <div style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1rem',
                    textAlign: 'left'
                  }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Preview de contactos importados:
                    </h4>
                    {previewData.map((contact, index) => (
                      <div key={index} style={{ 
                        fontSize: '0.75rem', 
                        color: '#374151', 
                        marginBottom: '0.25rem',
                        padding: '0.25rem',
                        backgroundColor: 'white',
                        borderRadius: '0.25rem'
                      }}>
                        <strong>{contact.name}</strong> - {contact.phone} 
                        {contact.email && ` - ${contact.email}`}
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Los contactos se agregarán automáticamente en 3 segundos...
                </p>
              </div>
            ) : (
              <div style={{ color: '#dc2626' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Error en la Importación
                </h3>
                <div style={{ 
                  backgroundColor: '#fef2f2', 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  <p style={{ color: '#991b1b', fontSize: '0.875rem', textAlign: 'left' }}>
                    {result.error}
                  </p>
                  {result.errors.length > 1 && (
                    <ul style={{ marginTop: '0.5rem', textAlign: 'left', fontSize: '0.75rem' }}>
                      {result.errors.slice(1, 6).map((error, index) => (
                        <li key={index} style={{ color: '#991b1b' }}>{error}</li>
                      ))}
                      {result.errors.length > 6 && (
                        <li style={{ color: '#6b7280' }}>...y {result.errors.length - 5} errores más</li>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setPreviewData(null);
                  }}
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

      {/* CSS para animación de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExcelImporter;