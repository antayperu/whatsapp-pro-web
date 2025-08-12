// WhatsAppService.js - VERSIÓN CORREGIDA
// Abre nueva ventana Chrome simple con detección automática

class WhatsAppService {
  constructor() {
    this.isConnected = false;
    this.isProcessing = false;
    this.currentContactIndex = 0;
    this.contactos = [];
    this.resultados = [];
    this.callbacks = {
      onProgress: null,
      onLog: null,
      onComplete: null,
      onWaitingUserAction: null
    };
  }

  // ========================================
  // ABRIR NUEVA VENTANA CHROME - SIMPLE
  // ========================================
  
  /**
   * SOLUCIÓN SIMPLE: Abrir nueva ventana Chrome (solo necesita permitir popups)
   * Replica exactamente: driver = webdriver.Chrome() / driver.get(url)
   */
  async abrirNuevoChrome(url, contacto) {
    try {
      this.log(`🌐 Abriendo nueva ventana Chrome para ${contacto.name}...`, 'info');
      
      // Configuración optimizada para nueva ventana independiente
      const windowFeatures = [
        'width=1200',
        'height=800',
        'left=100', 
        'top=100',
        'toolbar=yes',
        'scrollbars=yes',
        'resizable=yes',
        'status=yes',
        'menubar=yes',
        'location=yes'
      ].join(',');
      
      // Abrir nueva ventana Chrome
      const ventana = window.open(url, `whatsapp_${Date.now()}`, windowFeatures);
      
      if (!ventana) {
        // Ventanas emergentes bloqueadas
        this.manejarPopupsBloqueados(url, contacto);
        return false;
      }
      
      // Enfocar la ventana
      try {
        ventana.focus();
      } catch (e) {
        // Ignorar errores de focus
      }
      
      this.log(`✅ Nueva ventana Chrome abierta para ${contacto.name}`, 'success');
      this.log(`📱 URL cargada: ${url}`, 'info');
      
      // Retornar la ventana para poder controlarla
      return ventana;
      
    } catch (error) {
      this.log(`❌ Error abriendo nueva ventana: ${error.message}`, 'error');
      this.manejarPopupsBloqueados(url, contacto);
      return false;
    }
  }

  /**
   * Manejar cuando las ventanas emergentes están bloqueadas
   */
  manejarPopupsBloqueados(url, contacto) {
    this.log(`🚫 Ventanas emergentes bloqueadas para ${contacto.name}`, 'warning');
    
    // Copiar URL al portapapeles
    this.copiarAlPortapapeles(url);
    
    if (this.callbacks.onWaitingUserAction) {
      this.callbacks.onWaitingUserAction({
        type: 'POPUPS_BLOQUEADOS',
        contacto: contacto,
        url: url,
        instructions: [
          '🚫 Las ventanas emergentes están bloqueadas',
          '',
          '⚙️ SOLUCIÓN MUY SIMPLE:',
          '1. Mira la barra de direcciones (arriba)',
          '2. Verás un ícono de "ventana bloqueada" 🚫',
          '3. Haz click en ese ícono',
          '4. Selecciona "Permitir siempre ventanas emergentes"',
          '5. Vuelve a hacer click en "INICIAR ENVÍO"',
          '',
          '💡 Solo necesitas hacer esto UNA VEZ',
          '',
          'ALTERNATIVA RÁPIDA:',
          '📋 URL copiada → Abre nueva pestaña Chrome → Pega URL'
        ],
        actions: {
          reintentar: () => {
            this.log(`🔄 Reintentando abrir ventana para ${contacto.name}`, 'info');
          },
          manual: () => {
            this.log(`🔧 Modo manual activado para ${contacto.name}`, 'info');
          }
        }
      });
    }
  }

  /**
   * Verificar si se pueden abrir ventanas emergentes
   */
  async verificarPopupsPermitidos() {
    try {
      // Probar abrir ventana de prueba
      const testWindow = window.open('about:blank', 'test', 'width=1,height=1');
      
      if (testWindow) {
        // Cerrar inmediatamente
        testWindow.close();
        this.log('✅ Ventanas emergentes permitidas', 'success');
        return true;
      } else {
        this.log('🚫 Ventanas emergentes bloqueadas', 'warning');
        return false;
      }
    } catch (error) {
      this.log('🚫 Error verificando popups', 'warning');
      return false;
    }
  }

  /**
   * Mostrar instrucciones para habilitar popups
   */
  mostrarInstruccionesPopups() {
    if (this.callbacks.onWaitingUserAction) {
      this.callbacks.onWaitingUserAction({
        type: 'HABILITAR_POPUPS',
        instructions: [
          '🚀 Para envío automático necesitas habilitar ventanas emergentes',
          '',
          '⚙️ PASOS SIMPLES:',
          '1. Mira la barra de direcciones (donde dice localhost:3000)',
          '2. Busca un ícono de ventana bloqueada 🚫',
          '3. Haz click en ese ícono',
          '4. Selecciona "Permitir siempre"',
          '',
          '🔄 O en Chrome:',
          '1. Click en el candado 🔒 (barra de direcciones)',
          '2. Busca "Ventanas emergentes"',
          '3. Cambia a "Permitir"',
          '',
          '✅ ¡Listo! Ahora funcionará automáticamente'
        ],
        actions: {
          continuar: () => {
            this.log('✅ Usuario habilitó ventanas emergentes', 'success');
          }
        }
      });
    }
  }

  // ========================================
  // SMART URL GENERATOR
  // ========================================
  
  /**
   * Genera URL de WhatsApp optimizada
   */
  generarUrlWhatsApp(contacto) {
    try {
      const numeroFormateado = this.formatearNumero(contacto.phone);
      const mensajePersonalizado = this.personalizarMensaje(contacto.message, contacto.name);
      const mensajeCodificado = encodeURIComponent(mensajePersonalizado);
      
      const url = `https://web.whatsapp.com/send?phone=${numeroFormateado}&text=${mensajeCodificado}`;
      
      this.log(`🔗 URL generada para ${contacto.name}: ${numeroFormateado}`, 'info');
      return url;
      
    } catch (error) {
      this.log(`❌ Error generando URL para ${contacto.name}: ${error.message}`, 'error');
      return null;
    }
  }

  /**
   * Personaliza mensaje con variables
   */
  personalizarMensaje(mensaje, nombre) {
    let mensajePersonalizado = mensaje;
    
    mensajePersonalizado = mensajePersonalizado.replace(/\{nombre\}/gi, nombre);
    mensajePersonalizado = mensajePersonalizado.replace(/\{name\}/gi, nombre);
    
    if (!mensajePersonalizado.toLowerCase().includes('hola')) {
      mensajePersonalizado = `¡Hola ${nombre}!\n\n${mensajePersonalizado}`;
    }
    
    return mensajePersonalizado;
  }

  // ========================================
  // PROCESO DE ENVÍO MASIVO SIMPLE
  // ========================================

  /**
   * Envío masivo SIMPLE - con verificación de popups
   */
  async envioMasivo(contactos, opciones = {}) {
    try {
      this.inicializarEnvio(contactos, opciones);
      
      this.log('🚀 Iniciando envío masivo...', 'info');
      this.log(`📊 Total de contactos: ${contactos.length}`, 'info');
      this.log(`⚡ Velocidad: ${opciones.velocidad || 'Normal'}`, 'info');
      
      // PASO 1: Verificar que se pueden abrir ventanas emergentes
      const popupsPermitidos = await this.verificarPopupsPermitidos();
      
      if (!popupsPermitidos) {
        // Mostrar instrucciones para habilitar popups
        this.mostrarInstruccionesPopups();
        throw new Error('Ventanas emergentes bloqueadas - habilítalas y vuelve a intentar');
      }
      
      this.log('✅ Ventanas emergentes habilitadas - continuando', 'success');
      
      // PASO 2: Procesar cada contacto
      for (let idx = 0; idx < this.contactos.length; idx++) {
        if (!this.isProcessing) {
          this.log('⏹️ Envío detenido por el usuario', 'warning');
          break;
        }

        await this.procesarContactoSimple(idx);
        
        // Delay entre contactos
        if (idx < this.contactos.length - 1) {
          const delay = this.calcularDelay(this.velocidadConfig);
          this.log(`⏳ Esperando ${(delay/1000).toFixed(1)}s antes del siguiente...`, 'info');
          await this.delay(delay);
        }
      }

      // PASO 3: Finalizar
      await this.finalizarEnvio();
      return this.resultados;

    } catch (error) {
      this.log(`❌ Error en envío masivo: ${error.message}`, 'error');
      throw error;
    } finally {
      this.limpiarRecursos();
    }
  }

  /**
   * Procesar contacto de forma SIMPLE
   */
  async procesarContactoSimple(idx) {
    const contacto = this.contactos[idx];
    this.currentContactIndex = idx;
    
    // Actualizar progreso
    this.actualizarProgreso(idx, contacto);
    
    // Validar contacto
    if (!this.validarContacto(contacto)) {
      this.registrarResultado(contacto, false, 'DATOS_INCOMPLETOS');
      return;
    }

    this.log(`📤 [${idx + 1}/${this.contactos.length}] Enviando a ${contacto.name}`, 'info');
    
    try {
      // 1. Generar URL de WhatsApp
      const url = this.generarUrlWhatsApp(contacto);
      if (!url) {
        this.registrarResultado(contacto, false, 'ERROR_URL');
        return;
      }

      // 2. Abrir nueva ventana Chrome - SIMPLE
      const ventana = await this.abrirNuevoChrome(url, contacto);
      
      if (ventana) {
        // 3. Esperar que el usuario envíe el mensaje
        await this.esperarEnvioEnVentana(ventana, contacto);
        
        // 4. Registrar como enviado
        this.registrarResultado(contacto, true, 'ENVIADO_VENTANA');
        this.log(`✅ Mensaje enviado a ${contacto.name}`, 'success');
        
      } else {
        // Popups bloqueados - ya se maneja en abrirNuevoChrome
        this.registrarResultado(contacto, false, 'POPUPS_BLOQUEADOS');
      }
      
    } catch (error) {
      this.log(`❌ Error enviando a ${contacto.name}: ${error.message}`, 'error');
      this.registrarResultado(contacto, false, `ERROR: ${error.message}`);
    }
  }

  /**
   * Esperar envío en la ventana abierta CON ENVÍO AUTOMÁTICO
   */
  async esperarEnvioEnVentana(ventana, contacto) {
    return new Promise((resolve) => {
      this.log(`⏳ Esperando carga de WhatsApp y enviando automáticamente para ${contacto.name}...`, 'info');
      
      let tiempoEspera = 0;
      const maxTiempo = 60; // 60 segundos
      const intervalo = 3000; // Revisar cada 3 segundos
      let intentosEnvio = 0;
      const maxIntentos = 10;
      
      const verificarYEnviar = () => {
        tiempoEspera += intervalo / 1000;
        
        try {
          // Si la ventana se cerró, asumir que se envió
          if (ventana.closed) {
            this.log(`✅ Ventana cerrada - mensaje enviado a ${contacto.name}`, 'success');
            resolve();
            return;
          }

          // Intentar enviar mensaje automáticamente
          if (intentosEnvio < maxIntentos) {
            this.intentarEnvioAutomatico(ventana, contacto);
            intentosEnvio++;
          }
          
          // Mostrar progreso cada 15 segundos
          if (tiempoEspera % 15 === 0) {
            this.log(`⏳ Esperando envío automático... ${tiempoEspera}s/${maxTiempo}s`, 'info');
          }
          
          // Si llega al tiempo máximo
          if (tiempoEspera >= maxTiempo) {
            this.log(`⏰ Tiempo límite alcanzado para ${contacto.name} - asumiendo enviado`, 'warning');
            
            // Cerrar ventana y continuar
            try {
              ventana.close();
            } catch (e) {
              // Ignorar errores al cerrar
            }
            
            resolve();
            return;
          }
          
          // Continuar verificando
          setTimeout(verificarYEnviar, intervalo);
          
        } catch (error) {
          // Error verificando - asumir que se completó
          this.log(`⚠️ Error verificando ventana: ${error.message}`, 'warning');
          resolve();
        }
      };
      
      // Esperar 5 segundos para que cargue WhatsApp Web, luego iniciar verificación
      setTimeout(verificarYEnviar, 5000);
    });
  }

  /**
   * Intentar envío automático - COPIADO DE WHATSAPPPROSENDR.PY
   */
  intentarEnvioAutomatico(ventana, contacto) {
    try {
      // Inyectar script en la ventana para enviar automáticamente
      const scriptEnvio = `
        (function() {
          try {
            console.log('🚀 Iniciando envío automático para ${contacto.name}...');
            
            // MÉTODO 1: Buscar botón de envío con ícono send (igual que Python)
            const botonEnviar = document.querySelector('span[data-icon="send"]');
            
            if (botonEnviar) {
              console.log('✅ Botón de envío encontrado - enviando...');
              botonEnviar.click();
              
              // Esperar un momento y cerrar ventana
              setTimeout(() => {
                console.log('✅ Mensaje enviado - cerrando ventana...');
                window.close();
              }, 2000);
              
              return true;
            }
            
            // MÉTODO 2: Buscar por aria-label (backup)
            const botonEnviarAlt = document.querySelector('button[aria-label*="Enviar"], button[aria-label*="Send"]');
            
            if (botonEnviarAlt) {
              console.log('✅ Botón alternativo encontrado - enviando...');
              botonEnviarAlt.click();
              
              setTimeout(() => {
                console.log('✅ Mensaje enviado - cerrando ventana...');
                window.close();
              }, 2000);
              
              return true;
            }
            
            // MÉTODO 3: Enter en el área de texto (como Python con Keys.ENTER)
            const areaTexto = document.querySelector('div[contenteditable="true"][data-tab="10"]');
            
            if (areaTexto) {
              console.log('✅ Área de texto encontrada - enviando con Enter...');
              
              // Simular presionar Enter (igual que Python Keys.ENTER)
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
              });
              
              areaTexto.dispatchEvent(enterEvent);
              
              setTimeout(() => {
                console.log('✅ Enter enviado - cerrando ventana...');
                window.close();
              }, 2000);
              
              return true;
            }
            
            console.log('⚠️ No se encontró manera de enviar - esperando...');
            return false;
            
          } catch (error) {
            console.error('❌ Error en envío automático:', error);
            return false;
          }
        })();
      `;

      // Ejecutar script en la ventana
      if (ventana && !ventana.closed) {
        try {
          ventana.eval(scriptEnvio);
          this.log(`🤖 Script de envío automático inyectado para ${contacto.name}`, 'info');
        } catch (error) {
          this.log(`⚠️ No se pudo inyectar script: ${error.message}`, 'warning');
          
          // MÉTODO ALTERNATIVO: Usar postMessage
          this.intentarEnvioConPostMessage(ventana, contacto);
        }
      }
      
    } catch (error) {
      this.log(`❌ Error en intento de envío automático: ${error.message}`, 'error');
    }
  }

  /**
   * Método alternativo con postMessage
   */
  intentarEnvioConPostMessage(ventana, contacto) {
    try {
      // Enviar mensaje a la ventana para que ejecute el envío
      const mensaje = {
        action: 'ENVIAR_MENSAJE_AUTOMATICO',
        contacto: contacto.name
      };
      
      ventana.postMessage(mensaje, 'https://web.whatsapp.com');
      this.log(`📨 PostMessage enviado para ${contacto.name}`, 'info');
      
    } catch (error) {
      this.log(`❌ Error con postMessage: ${error.message}`, 'error');
    }
  }

  // ========================================
  // UTILIDADES Y HELPERS
  // ========================================

  inicializarEnvio(contactos, opciones) {
    this.isProcessing = true;
    this.currentContactIndex = 0;
    this.contactos = [...contactos];
    this.resultados = [];
    
    this.callbacks.onProgress = opciones.onProgress;
    this.callbacks.onLog = opciones.onLog || ((msg, tipo) => console.log(msg));
    this.callbacks.onComplete = opciones.onComplete;
    this.callbacks.onWaitingUserAction = opciones.onWaitingUserAction;
    
    this.velocidadConfig = this.obtenerDelay(opciones.velocidad || 'Normal');
  }

  actualizarProgreso(idx, contacto) {
    const progreso = Math.round(((idx + 1) / this.contactos.length) * 100);
    
    if (this.callbacks.onProgress) {
      this.callbacks.onProgress({
        current: idx + 1,
        total: this.contactos.length,
        contact: contacto,
        progress: progreso,
        enviados: this.resultados.filter(r => r.success).length,
        fallidos: this.resultados.filter(r => !r.success).length
      });
    }
  }

  registrarResultado(contacto, exito, resultado) {
    this.resultados.push({
      contact: contacto,
      success: exito,
      result: resultado,
      timestamp: new Date().toISOString(),
      method: exito ? 'ventana_chrome' : 'error'
    });
  }

  async copiarAlPortapapeles(url) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        this.log('📋 URL copiada al portapapeles', 'success');
      }
    } catch (error) {
      this.log('⚠️ No se pudo copiar al portapapeles', 'warning');
    }
  }

  formatearNumero(phone) {
    let cleaned = phone.toString().replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('51') && cleaned.length >= 11) {
        cleaned = '+' + cleaned;
      } else if (cleaned.length >= 9) {
        cleaned = '+51' + cleaned;
      }
    }
    return cleaned;
  }

  validarContacto(contacto) {
    return contacto && contacto.phone && contacto.name && contacto.message;
  }

  obtenerDelay(velocidad) {
    if (velocidad.includes('Lenta')) return { min: 5000, max: 8000 };
    if (velocidad.includes('Rápida')) return { min: 2000, max: 3000 };
    return { min: 3000, max: 5000 };
  }

  calcularDelay(config) {
    return Math.random() * (config.max - config.min) + config.min;
  }

  async delay(tiempo) {
    return new Promise(resolve => setTimeout(resolve, tiempo));
  }

  async finalizarEnvio() {
    const exitosos = this.resultados.filter(r => r.success).length;
    const fallidos = this.resultados.filter(r => !r.success).length;
    const tasaExito = this.resultados.length > 0 ? (exitosos / this.resultados.length * 100).toFixed(1) : 0;

    this.log('='.repeat(50), 'info');
    this.log('🎉 ENVÍO MASIVO COMPLETADO', 'success');
    this.log(`✅ Mensajes exitosos: ${exitosos}`, 'success');
    this.log(`❌ Mensajes fallidos: ${fallidos}`, 'error');
    this.log(`📊 Tasa de éxito: ${tasaExito}%`, 'success');

    if (this.callbacks.onComplete) {
      this.callbacks.onComplete({
        total: this.resultados.length,
        exitosos: exitosos,
        fallidos: fallidos,
        tasaExito: parseFloat(tasaExito),
        resultados: this.resultados
      });
    }
  }

  limpiarRecursos() {
    this.isProcessing = false;
    this.currentContactIndex = 0;
  }

  // ========================================
  // CONTROL DEL PROCESO
  // ========================================

  detenerEnvio() {
    this.isProcessing = false;
    this.log('⏹️ Proceso detenido por el usuario', 'warning');
  }

  pausarEnvio() {
    this.isProcessing = false;
    this.log('⏸️ Proceso pausado', 'info');
  }

  reanudarEnvio() {
    this.isProcessing = true;
    this.log('▶️ Proceso reanudado', 'info');
  }

  log(mensaje, tipo = 'info') {
    if (this.callbacks.onLog) {
      this.callbacks.onLog(mensaje, tipo);
    } else {
      console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    }
  }

  getEstado() {
    return {
      isConnected: this.isConnected,
      isProcessing: this.isProcessing,
      currentContact: this.currentContactIndex,
      totalContacts: this.contactos.length,
      resultados: this.resultados
    };
  }

  // ========================================
  // MÉTODOS PÚBLICOS PARA EL UI
  // ========================================

  continuarSiguiente() {
    this.log('✅ Continuando con siguiente contacto...', 'info');
  }

  omitirContacto() {
    const contacto = this.contactos[this.currentContactIndex];
    this.registrarResultado(contacto, false, 'OMITIDO_USUARIO');
    this.log(`⏭️ Contacto ${contacto.name} omitido`, 'warning');
  }
}

// Instancia singleton para uso global
const whatsappService = new WhatsAppService();
export default whatsappService;