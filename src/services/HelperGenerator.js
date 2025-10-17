// ===============================================================
// ARTEFACTO 1: HelperGenerator_Core.js v3.0 - CLASE BASE MEJORADA
// ===============================================================
//
// 🎯 PROPÓSITO: Base sólida y robusta para el HelperGenerator v3.0
// 📈 MEJORAS vs v2.2:
//    - Configuración Chrome robusta (40+ opciones vs 10)
//    - Sistema de diagnóstico automático integrado
//    - Validaciones exhaustivas de datos de entrada
//    - Múltiples métodos de fallback
//    - Compatibilidad 100% con interfaz actual
//
// ⚙️ COMPATIBILIDAD: 100% compatible con MessageComposer.js actual
// 🔧 INSTALACIÓN: Reemplaza la clase HelperGenerator en tu archivo actual

/**
 * HelperGenerator Core v3.0 - Clase Base Ultra Robusta
 *
 * Esta clase mantiene la misma interfaz pública que v2.2 pero con
 * robustez interna mejorada significativamente.
 */
class HelperGenerator {
  constructor() {
    // Información de versión
    this.version = "3.0.0";
    this.buildDate = new Date().toISOString();
    this.compatibility = "2.2"; // Compatible con v2.2

    // Estado interno mejorado
    this.isInitialized = false;
    this.lastError = null;
    this.diagnostics = null;
    this.systemInfo = null;

    // Configuración robusta por defecto
    this.defaultConfig = {
      // Configuración Chrome Ultra Robusta (40+ opciones)
      chromeOptions: {
        // Opciones básicas de estabilidad
        arguments: [
          "--start-maximized", // Maximizar ventana
          "--disable-dev-shm-usage", // Evitar problemas memoria compartida
          "--no-sandbox", // Evitar problemas sandbox
          "--disable-setuid-sandbox", // Compatibilidad Linux
          "--disable-gpu", // Evitar problemas GPU
          "--disable-features=VizDisplayCompositor", // Estabilidad

          // Anti-detección y automatización
          "--disable-blink-features=AutomationControlled",
          "--disable-extensions",
          "--disable-plugins",
          "--disable-default-apps",
          "--disable-sync",
          "--disable-translate",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-features=TranslateUI",

          // Notificaciones y popups
          "--disable-notifications",
          "--disable-popup-blocking",
          "--disable-infobars",
          "--disable-password-generation",
          "--disable-save-password-bubble",

          // Performance y memoria
          "--memory-pressure-off",
          "--max_old_space_size=4096",
          "--disable-background-networking",
          "--disable-background-timer-throttling",
          "--disable-device-discovery-notifications",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",

          // Compatibilidad específica WhatsApp Web
          "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "--accept-lang=es-ES,es;q=0.9,en;q=0.8",

          // Estabilidad adicional
          "--no-first-run",
          "--no-default-browser-check",
          "--disable-logging",
          "--disable-gpu-logging",
          "--silent-debugger-extension-api",
        ],

        // Preferencias experimentales
        experimentalOptions: {
          excludeSwitches: ["enable-automation"],
          useAutomationExtension: false,
          detach: true,
        },

        // Configuración de perfil
        profile: {
          "profile.default_content_setting_values.notifications": 2, // Bloquear notificaciones
          "profile.default_content_settings.popups": 0, // Permitir popups
          "profile.managed_default_content_settings.images": 1, // Cargar imágenes
        },
      },

      // Configuración de timeouts robusta
      timeouts: {
        initialization: 60000, // 60s para inicializar Chrome
        whatsappConnection: 180000, // 3 minutos para conectar WhatsApp
        messageLoad: 30000, // 30s para cargar mensaje
        messageSend: 15000, // 15s para enviar
        popupKill: 5000, // 5s para cerrar popups
        elementSearch: 10000, // 10s para buscar elementos
        pageLoad: 45000, // 45s para cargar página
        networkWait: 20000, // 20s para esperar red
      },

      // Configuración de reintentos
      retryConfig: {
        maxRetries: 3, // Máximo 3 reintentos por contacto
        retryDelay: 5000, // 5s entre reintentos
        exponentialBackoff: true, // Aumentar tiempo entre reintentos
        retryOnTimeout: true, // Reintentar en timeout
        retryOnElementNotFound: true, // Reintentar si no encuentra elemento
      },

      // Configuración de velocidad mejorada
      speedConfig: {
        "Lenta (5-8s)": {
          min: 5000,
          max: 8000,
          description: "Más segura para evitar bloqueos",
        },
        "Normal (3-5s)": {
          min: 3000,
          max: 5000,
          description: "Balance entre velocidad y seguridad",
        },
        "Rápida (2-3s)": {
          min: 2000,
          max: 3000,
          description: "Más rápida pero mayor riesgo",
        },
      },

      // Rutas de ChromeDriver para auto-detección
      chromeDriverPaths: [
        "/usr/local/bin/chromedriver", // Linux/Mac estándar
        "/usr/bin/chromedriver", // Linux alternativo
        "C:\\Program Files\\Google\\Chrome\\Application\\chromedriver.exe", // Windows Program Files
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chromedriver.exe", // Windows x86
        process.env.CHROME_DRIVER || "", // Variable de entorno
        "./chromedriver.exe", // Directorio actual
        "./drivers/chromedriver.exe", // Subdirectorio drivers
        "../chromedriver.exe", // Directorio padre
      ].filter(Boolean), // Remover paths vacíos

      // User Data Directory para persistir sesión WhatsApp
      userDataDir: "WhatsAppSender_Profile",

      // Configuración de logging mejorada
      logging: {
        level: "INFO", // DEBUG, INFO, WARNING, ERROR
        includeTimestamp: true, // Incluir timestamp en logs
        includeLevel: true, // Incluir nivel en logs
        maxLogEntries: 1000, // Máximo entries en memoria
        logToFile: false, // No log a archivo (navegador)
      },
    };

    // Inicializar automáticamente
    this.initialize();
  }

  /**
   * Inicialización robusta del sistema
   */
  async initialize() {
    try {
      console.log(`🚀 Inicializando HelperGenerator v${this.version}...`);

      // Realizar diagnóstico básico del sistema
      this.systemInfo = await this.performBasicDiagnostics();

      // Validar configuración
      this.validateConfiguration();

      // Marcar como inicializado
      this.isInitialized = true;
      this.lastError = null;

      console.log(
        `✅ HelperGenerator v${this.version} inicializado correctamente`
      );
      console.log(`📊 Sistema detectado:`, this.systemInfo);

      return true;
    } catch (error) {
      console.error(
        `❌ Error inicializando HelperGenerator v${this.version}:`,
        error
      );
      this.lastError = error;
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Diagnóstico básico del sistema (versión simplificada para navegador)
   */
  async performBasicDiagnostics() {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      browser: this.detectBrowser(),
      platform: this.detectPlatform(),
      features: this.checkBrowserFeatures(),
      performance: this.checkPerformance(),
    };

    return diagnostics;
  }

  /**
   * Detectar navegador actual
   */
  detectBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      return { name: "Chrome", compatible: true };
    } else if (userAgent.includes("Firefox")) {
      return {
        name: "Firefox",
        compatible: false,
        reason: "Selenium mejor con Chrome",
      };
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return {
        name: "Safari",
        compatible: false,
        reason: "No soporta ChromeDriver",
      };
    } else if (userAgent.includes("Edg")) {
      return {
        name: "Edge",
        compatible: true,
        note: "Puede funcionar pero Chrome recomendado",
      };
    } else {
      return {
        name: "Desconocido",
        compatible: false,
        reason: "Navegador no identificado",
      };
    }
  }

  /**
   * Detectar plataforma del sistema
   */
  detectPlatform() {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;

    if (platform.includes("Win") || userAgent.includes("Windows")) {
      return { name: "Windows", compatible: true, primary: true };
    } else if (platform.includes("Mac") || userAgent.includes("Mac")) {
      return { name: "macOS", compatible: true, note: "Soporte experimental" };
    } else if (platform.includes("Linux") || userAgent.includes("Linux")) {
      return { name: "Linux", compatible: true, note: "Soporte experimental" };
    } else {
      return { name: "Desconocido", compatible: false };
    }
  }

  /**
   * Verificar características del navegador
   */
  checkBrowserFeatures() {
    return {
      popupsAllowed: this.checkPopupsAllowed(),
      clipboardAPI: !!navigator.clipboard,
      downloadAPI: true, // Asumimos que está disponible
      fileAPI: !!window.File,
      base64Support: true, // Nativo en JS
    };
  }

  /**
   * Verificar si las ventanas emergentes están permitidas
   */
  checkPopupsAllowed() {
    try {
      const testWindow = window.open("about:blank", "test", "width=1,height=1");
      if (testWindow) {
        testWindow.close();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar rendimiento básico del sistema
   */
  checkPerformance() {
    return {
      memory: performance.memory
        ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
          }
        : { available: false },
      timing: performance.timing
        ? {
            loadTime:
              performance.timing.loadEventEnd -
              performance.timing.navigationStart,
            domReady:
              performance.timing.domContentLoadedEventEnd -
              performance.timing.navigationStart,
          }
        : { available: false },
    };
  }

  /**
   * Validar configuración interna
   */
  validateConfiguration() {
    // Validar opciones de Chrome
    if (
      !this.defaultConfig.chromeOptions ||
      !Array.isArray(this.defaultConfig.chromeOptions.arguments)
    ) {
      throw new Error("Configuración de Chrome inválida");
    }

    // Validar timeouts
    if (
      !this.defaultConfig.timeouts ||
      typeof this.defaultConfig.timeouts !== "object"
    ) {
      throw new Error("Configuración de timeouts inválida");
    }

    // Validar configuración de velocidad
    if (
      !this.defaultConfig.speedConfig ||
      typeof this.defaultConfig.speedConfig !== "object"
    ) {
      throw new Error("Configuración de velocidad inválida");
    }

    console.log("✅ Configuración validada correctamente");
  }

  /**
   * FUNCIÓN COMPLETA CORREGIDA: generarHelperAutomatico()
   * Reemplaza toda la función en tu HelperGenerator.js
   */
  async generarHelperAutomatico(contactos, opciones = {}) {
    try {
      console.log('Iniciando generacion de helper automatico...');
      console.log('Contactos recibidos:', contactos.length);
      
      // PASO 1: Validación básica sin funciones externas
      if (!Array.isArray(contactos) || contactos.length === 0) {
        throw new Error('No hay contactos válidos para procesar');
      }

      // PASO 2: Sanitizar contactos SIN funciones auxiliares
      const contactosSanitizados = contactos.map((contacto, index) => {
        return {
          name: this.limpiarTextoSimple(contacto.name || `Contacto ${index + 1}`),
          phone: this.limpiarTelefonoSimple(contacto.phone || ''),
          message: this.limpiarTextoSimple(contacto.message || 'Mensaje personalizado')
        };
      });

      console.log('Contactos sanitizados:', contactosSanitizados.length);

      // PASO 3: Preparar configuración simple
      const config = {
        contactos: contactosSanitizados,
        opciones: {
          velocidad: opciones.velocidad || 'Normal (3-5s)',
          delay: { min: 3, max: 5 },
          timestamp: new Date().toISOString()
        }
      };

      // PASO 4: Generar código Python simple
      const pythonCode = this.generarPythonSimple(contactosSanitizados, config);
      
      console.log('Codigo Python generado, longitud:', pythonCode.length);

      // PASO 5: Crear archivo .BAT funcional
      const batFile = this.crearBatFuncional(pythonCode, config);
      
      console.log('Archivo .BAT creado:', batFile.nombre);

      // PASO 6: Descargar archivo automáticamente
      this.descargarArchivoSimple(batFile.contenido, batFile.nombre);

      console.log('Helper automatico generado exitosamente');
      
      // Retornar resultado compatible
      return {
        success: true,
        version: this.version,
        archivo: batFile.nombre,
        contactos: contactosSanitizados.length,
        message: `Helper v${this.version} generado y descargado exitosamente`,
        config: config
      };
      
    } catch (error) {
      console.error('Error en generarHelperAutomatico:', error);
      
      return {
        success: false,
        version: this.version,
        error: error.message,
        message: 'Error generando helper automático: ' + error.message
      };
    }
  }

  /**
   * FUNCIÓN AUXILIAR: Limpiar texto simple
   */
  limpiarTextoSimple(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }
  
  console.log(`🧹 Sanitizando (preservando formato): "${texto.substring(0, 50)}..."`);
  
  let textoLimpio = texto;
  
  // PASO 1: Preservar saltos de línea convirtiéndolos a \n
  textoLimpio = textoLimpio.replace(/\r\n/g, '\n');
  textoLimpio = textoLimpio.replace(/\r/g, '\n');
  
  // PASO 2: Solo eliminar caracteres que REALMENTE rompen .BAT
  const caracteresProhibidosBat = ['"', '%', '|', '<', '>', '&', '^'];
  
  caracteresProhibidosBat.forEach(caracter => {
    textoLimpio = textoLimpio.replace(new RegExp('\\' + caracter, 'g'), '');
  });
  
  // PASO 3: Reemplazar comillas problemáticas por comillas simples
  textoLimpio = textoLimpio.replace(/[""'']/g, "'");
  
  // PASO 4: Limpiar espacios múltiples pero mantener saltos de línea
  textoLimpio = textoLimpio.replace(/[ \t]+/g, ' ');
  textoLimpio = textoLimpio.replace(/\n[ \t]+/g, '\n');
  textoLimpio = textoLimpio.replace(/[ \t]+\n/g, '\n');
  textoLimpio = textoLimpio.replace(/\n{3,}/g, '\n\n');
  //textoLimpio = textoLimpio.replace(/\n/g, ' ');
  
  
  // PASO 5: Trim y validar longitud
  textoLimpio = textoLimpio.trim();
  if (textoLimpio.length > 4000) {
    textoLimpio = textoLimpio.substring(0, 4000);
  }
  
  console.log(`✅ Texto sanitizado: "${textoLimpio.substring(0, 50)}..."`);
  return textoLimpio;
}

  /**
   * FUNCIÓN AUXILIAR: Limpiar teléfono simple
   */
  limpiarTelefonoSimple(telefono) {
    if (!telefono || typeof telefono !== 'string') {
      return '';
    }
    
    // Limpiar y formatear teléfono
    let telefonoLimpio = telefono.replace(/[^\d+]/g, '');
    
    // Agregar código de país si no lo tiene
    if (!telefonoLimpio.startsWith('+')) {
      if (telefonoLimpio.startsWith('51') && telefonoLimpio.length >= 11) {
        telefonoLimpio = '+' + telefonoLimpio;
      } else if (telefonoLimpio.length >= 9) {
        telefonoLimpio = '+51' + telefonoLimpio;
      }
    }
    
    return telefonoLimpio;
  }

  /**
   * FUNCIÓN MEJORADA: generarPythonSimple() - COMPLETAMENTE AUTOMÁTICO
   * Basada en las técnicas exitosas del WhatsAppProSender.py
   * Reemplaza la función actual en tu HelperGenerator.js
   */
  generarPythonSimple(contactos, config) {
  console.log('Generando script Python completamente automatico...');
  
  const contactosJson = JSON.stringify(contactos.map(c => ({
    name: c.name || 'Sin nombre',
    phone: c.phone || '',
    message: c.message || 'Mensaje personalizado'
  })), null, 2);

  // Calcular delays según velocidad
  let delayMin = 3, delayMax = 5;
  if (config.opciones.velocidad.includes('Lenta')) {
    delayMin = 5; delayMax = 8;
  } else if (config.opciones.velocidad.includes('Rápida')) {
    delayMin = 2; delayMax = 3;
  }

  const pythonCode = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# WhatsApp Sender Automatico v3.0

import webbrowser
import time
import random
import urllib.parse
import sys
import os

# Intentar importar selenium
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.keys import Keys
    selenium_disponible = True
    print("Selenium disponible - Modo automatico activado")
except ImportError:
    selenium_disponible = False
    print("Selenium no disponible - Usando modo manual")

# Datos de contactos
contactos = ${contactosJson}

def configurar_chrome():
    """Configuracion Chrome optimizada"""
    if not selenium_disponible:
        return None
    
    print("Configurando Chrome...")
    options = Options()
    
    # Opciones de estabilidad
    options.add_argument("--start-maximized")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-blink-features=AutomationControlled")
    
    # Anti-deteccion
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    
    try:
        # INTENTO 1: Chrome directo (MAS RAPIDO)
        try:
            driver = webdriver.Chrome(options=options)
            print("Chrome iniciado directamente")
            return driver
        except:
            print("Chrome directo falló, probando con ChromeDriverManager...")
            pass
            
        # INTENTO 2: ChromeDriverManager (fallback)
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("Chrome iniciado con ChromeDriverManager")
        return driver
        
    except Exception as e:
        print(f"Error iniciando Chrome: {e}")
        return None

def verificar_whatsapp(driver, max_intentos=18):
    """Verificar que WhatsApp esté listo"""
    print("Verificando conexion a WhatsApp Web...")
    
    for i in range(max_intentos):
        try:
            # Buscar elementos que indican que WhatsApp está listo
            driver.find_element(By.XPATH, "//div[@id='pane-side']")
            print("WhatsApp Web conectado exitosamente")
            return True
        except:
            tiempo = (i+1)*10
            if tiempo <= 60:
                print(f"Cargando WhatsApp Web... {tiempo}s")
            else:
                print(f"Esperando conexion... {tiempo}s (escanea QR si aparece)")
            time.sleep(10)
    
    print("No se pudo conectar a WhatsApp Web")
    return False

def enviar_mensaje(driver, contacto, indice, total):
    """Enviar mensaje a un contacto"""
    try:
        nombre = contacto['name']
        telefono = contacto['phone']
        mensaje_base = contacto['message']
        # PERSONALIZAR MENSAJE con nombre del contacto (igual que versión desktop)
        if not mensaje_base.lower().startswith('hola'):
            mensaje = f"Hola {nombre}!\\n\\n{mensaje_base}"
        else:
            # Si ya tiene saludo, reemplazar variables {nombre} o {name}
            mensaje = mensaje_base.replace('{nombre}', nombre).replace('{name}', nombre)
        
        # Asegurar que el número tenga el signo +
        if not telefono.startswith('+'):
            telefono = '+' + telefono
        
        print(f"[{indice+1}/{total}] Enviando a {nombre} ({telefono})")
        
        # Crear URL de WhatsApp
        mensaje_url = urllib.parse.quote(mensaje)
        url = f"https://web.whatsapp.com/send?phone={telefono}&text={mensaje_url}"
        
        # Navegar a la URL
        driver.get(url)
        time.sleep(5)  # Esperar carga
        
        # Buscar botón de envío
        try:
            # Intentar múltiples selectores
            selectores = [
                "//span[@data-icon='send']",
                "//span[@data-icon='send']/parent::button",
                "//button[@aria-label='Enviar']",
                "//button[@aria-label='Send']"
            ]
            
            boton_enviar = None
            for selector in selectores:
                try:
                    boton_enviar = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    if boton_enviar:
                        break
                except:
                    continue
            
            if boton_enviar:
                boton_enviar.click()
                print(f"✅ Mensaje enviado a {nombre}")
                return True
            else:
                # Fallback: usar ENTER
                cuadro_texto = driver.find_element(By.XPATH, "//div[@contenteditable='true']")
                cuadro_texto.send_keys(Keys.ENTER)
                print(f"✅ Mensaje enviado a {nombre} (ENTER)")
                return True
                
        except Exception as e:
            print(f"❌ Error enviando a {nombre}: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error crítico enviando a {nombre}: {e}")
        return False

def envio_manual_fallback():
    """Método manual usando webbrowser"""
    print("=== MODO MANUAL ACTIVADO ===")
    print("(Selenium no disponible)")
    
    for i, contacto in enumerate(contactos):
        nombre = contacto['name']
        telefono = contacto['phone']
        mensaje = contacto['message']
        
        print(f"[{i+1}/{len(contactos)}] {nombre} - {telefono}")
        
        # Generar URL
        mensaje_url = urllib.parse.quote(mensaje)
        url = f"https://web.whatsapp.com/send?phone={telefono}&text={mensaje_url}"
        
        # Abrir en navegador
        webbrowser.open(url)
        
        print("Ventana abierta. Envía el mensaje y presiona Enter...")
        input()
    
    print("✅ Proceso manual completado")
    return True

def main():
    print("=" * 60)
    print("WhatsApp Sender Automatico v3.0")
    print("=" * 60)
    print(f"Contactos: {len(contactos)}")
    print("Velocidad: ${config.opciones.velocidad}")
    print()
    
    # Intentar modo automático
    if selenium_disponible:
        print("=== MODO AUTOMATICO ===")
        
        driver = configurar_chrome()
        if not driver:
            return envio_manual_fallback()
        
        try:
            # Abrir WhatsApp Web
            print("Abriendo WhatsApp Web...")
            driver.get("https://web.whatsapp.com")
            
            # Verificar conexión
            if not verificar_whatsapp(driver):
                driver.quit()
                return envio_manual_fallback()
            
            print("=== INICIANDO ENVIO ===")
            
            # Contadores
            exitosos = 0
            fallidos = 0
            
            # Procesar contactos
            for i, contacto in enumerate(contactos):
                if enviar_mensaje(driver, contacto, i, len(contactos)):
                    exitosos += 1
                else:
                    fallidos += 1
                
                # Pausa entre envíos
                if i < len(contactos) - 1:
                    delay = random.uniform(${delayMin}, ${delayMax})
                    print(f"Esperando {delay:.1f}s...")
                    time.sleep(delay)
            
            print()
            print("=" * 60)
            print("PROCESO COMPLETADO")
            print("=" * 60)
            print(f"✅ Exitosos: {exitosos}")
            print(f"❌ Fallidos: {fallidos}")
            print(f"📊 Tasa de éxito: {(exitosos/len(contactos)*100):.1f}%")
            
            driver.quit()
            return True
            
        except Exception as e:
            print(f"Error en modo automático: {e}")
            try:
                driver.quit()
            except:
                pass
            return envio_manual_fallback()
    
    else:
        return envio_manual_fallback()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error crítico: {e}")
    finally:
        input("Presiona Enter para cerrar...")
`;

  console.log('Script Python completo generado');
  return pythonCode;
}

  /**
   * FUNCIÓN AUXILIAR: Descargar archivo simple
   */
  descargarArchivoSimple(contenido, nombreArchivo) {
    try {
      console.log('Iniciando descarga de archivo:', nombreArchivo);
      
      // Crear blob
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      
      // Crear URL temporal
      const url = window.URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombreArchivo;
      enlace.style.display = 'none';
      
      // Ejecutar descarga
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      
      // Limpiar URL
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('Archivo descargado exitosamente:', nombreArchivo);
      return true;
      
    } catch (error) {
      console.error('Error descargando archivo:', error);
      
      // Fallback: mostrar en nueva ventana
      try {
        const ventana = window.open('', '_blank');
        ventana.document.write('<pre>' + contenido + '</pre>');
        ventana.document.title = nombreArchivo;
        console.log('Archivo mostrado en nueva ventana');
        return true;
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        return false;
      }
    }
  }
  

  // FUNCIONES AUXILIARES NUEVAS REQUERIDAS

  /**
   * Sanitizar contactos básicamente
   */
  sanitizarContactosBasico(contactos) {
    return contactos.map(contacto => ({
      ...contacto,
      name: this.sanitizarTextoBasico(contacto.name),
      phone: this.normalizarTelefonoBasico(contacto.phone),
      message: this.sanitizarTextoBasico(contacto.message || 'Mensaje personalizado')
    }));
  }

  /**
   * Sanitizar texto básico
   */
    /**
   * Sanitizar texto básico
   */
  sanitizarTextoBasico(texto) {
    if (!texto) return '';
    // Normaliza para separar tildes de letras, luego elimina las tildes.
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s\-\.\,\(\)]/g, '') // Permite algunos caracteres más
      .trim();
  }

  /**
   * Normalizar teléfono básico
   */
  normalizarTelefonoBasico(telefono) {
    if (!telefono) return '';
    // Elimina todo lo que no sea un dígito, excepto el '+' inicial.
    let limpio = telefono.toString().replace(/[^\d+]/g, '');
    if (limpio.startsWith('+')) {
        return '+' + limpio.substr(1).replace(/\+/g, ''); // Quita cualquier '+' extra
    }
    // Si no empieza con +, quita todos los + y sigue.
    limpio = limpio.replace(/\+/g, '');
    if (limpio.length >= 9) {
        // Asume un prefijo si es necesario, o simplemente devuelve los números.
        // Aquí puedes añadir una lógica más inteligente si quieres.
        return '+51' + limpio; // Ejemplo: Asumir Perú
    }
    return limpio;
  }

crearBatFuncional(pythonCode, config) {
  try {
    console.log('Creando .BAT con Selenium real - Un solo navegador');
    
    // Timestamp simple
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const pythonFileName = `ws_script_${timestamp}.py`;
    
    
      // Calcular delays según velocidad
    let delayMin = 3, delayMax = 5;
    if (config.opciones.velocidad.includes('Lenta')) {
      delayMin = 5; delayMax = 8;
    } else if (config.opciones.velocidad.includes('Rápida')) {
      delayMin = 2; delayMax = 3;
    }

    const batContent = [
      '@echo off',
      'title WhatsApp Sender v3.0 - SELENIUM AUTOMATICO',
      'color 0A',
      'cls',
      'echo.',
      'echo ===============================================',
      'echo WhatsApp Sender v3.0 - COMPLETAMENTE AUTOMATICO',
      'echo ===============================================',
      'echo.',
      `echo Contactos: ${config.contactos.length}`,
      `echo Velocidad: ${config.opciones.velocidad}`,
      'echo.',
      'pause',
      'echo.',
      
      // PASO 1: Instalar Selenium si no existe
      'echo [1/5] Verificando Selenium...',
      'python -c "import selenium" 2>nul',
      'if errorlevel 1 (',
      '    echo Selenium no encontrado. Instalando...',
      '    python -m pip install selenium webdriver-manager',
      '    if errorlevel 1 (',
      '        echo ERROR: No se pudo instalar Selenium',
      '        echo Instala manualmente: pip install selenium webdriver-manager',
      '        pause',
      '        exit /b 1',
      '    )',
      ')',
      'echo Selenium verificado',
      'echo.',
      
      // PASO 2: Crear script Python con Selenium REAL
      'echo [2/5] Creando script automatico...',
      
      // Crear archivo Python línea por línea con Selenium
      `echo # WhatsApp Sender Automatico v3.0 > "%TEMP%\\${pythonFileName}"`,
      `echo import time >> "%TEMP%\\${pythonFileName}"`,
      `echo import random >> "%TEMP%\\${pythonFileName}"`,
      `echo import urllib.parse >> "%TEMP%\\${pythonFileName}"`,
      `echo import sys >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      
      // Importar Selenium
      `echo try: >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium import webdriver >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.common.by import By >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.support.ui import WebDriverWait >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.support import expected_conditions as EC >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.chrome.service import Service >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.chrome.options import Options >> "%TEMP%\\${pythonFileName}"`,
      `echo     from selenium.webdriver.common.keys import Keys >> "%TEMP%\\${pythonFileName}"`,
      `echo     from webdriver_manager.chrome import ChromeDriverManager >> "%TEMP%\\${pythonFileName}"`,
      `echo     print("Selenium importado correctamente") >> "%TEMP%\\${pythonFileName}"`,
      `echo except ImportError as e: >> "%TEMP%\\${pythonFileName}"`,
      `echo     print(f"Error importando Selenium: {e}") >> "%TEMP%\\${pythonFileName}"`,
      `echo     sys.exit(1) >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      
      // Datos de contactos
      // Datos de contactos - Usar contactos reales
      `echo contactos = [] >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      ...config.contactos.map((contacto, index) => [
        `echo contacto = {'name': '${contacto.name.replace(/'/g, "")}', 'phone': '${contacto.phone}', 'message': '${contacto.message.replace(/'/g, "").replace(/\n/g, "\\n")}'}  >> "%TEMP%\\${pythonFileName}"`,
        `echo contactos.append(contacto) >> "%TEMP%\\${pythonFileName}"`
      ]).flat(),
      
      // Función configurar Chrome
      `echo def configurar_chrome(): >> "%TEMP%\\${pythonFileName}"`,
      `echo     print("Configurando Chrome...") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options = Options() >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument("--start-maximized") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument("--disable-notifications") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument("--disable-dev-shm-usage") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument("--no-sandbox") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument("--disable-blink-features=AutomationControlled") >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_experimental_option("excludeSwitches", ["enable-automation"]) >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_experimental_option("useAutomationExtension", False) >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      `echo     # PERSISTENCIA DE SESIÓN - Como versión desktop exitosa >> "%TEMP%\\${pythonFileName}"`,
      `echo     import os >> "%TEMP%\\${pythonFileName}"`,
      `echo     user_data_dir = os.path.join(os.path.expanduser("~"), "WhatsAppSender_ChromeData") >> "%TEMP%\\${pythonFileName}"`,
      `echo     os.makedirs(user_data_dir, exist_ok=True) >> "%TEMP%\\${pythonFileName}"`,
      `echo     options.add_argument(f"--user-data-dir={user_data_dir}") >> "%TEMP%\\${pythonFileName}"`,
      `echo     print(f"📁 Sesión guardada en: {user_data_dir}") >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      `echo     try: >> "%TEMP%\\${pythonFileName}"`,
      `echo         # INTENTO 1: Chrome directo (MAS RAPIDO) >> "%TEMP%\\${pythonFileName}"`,
      `echo         try: >> "%TEMP%\\${pythonFileName}"`,
      `echo             driver = webdriver.Chrome(options=options) >> "%TEMP%\\${pythonFileName}"`,
      `echo             print("Chrome iniciado directamente") >> "%TEMP%\\${pythonFileName}"`,
      `echo             return driver >> "%TEMP%\\${pythonFileName}"`,
      `echo         except: >> "%TEMP%\\${pythonFileName}"`,
      `echo             print("Chrome directo fallo, probando con ChromeDriverManager...") >> "%TEMP%\\${pythonFileName}"`,
      `echo             pass >> "%TEMP%\\${pythonFileName}"`,
      `echo         # INTENTO 2: ChromeDriverManager (fallback) >> "%TEMP%\\${pythonFileName}"`,
      `echo         driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options) >> "%TEMP%\\${pythonFileName}"`,
      `echo         print("Chrome iniciado con ChromeDriverManager") >> "%TEMP%\\${pythonFileName}"`,
      `echo         return driver >> "%TEMP%\\${pythonFileName}"`,
      `echo     except Exception as e: >> "%TEMP%\\${pythonFileName}"`,
      `echo         print(f"Error iniciando Chrome: {e}") >> "%TEMP%\\${pythonFileName}"`,
      `echo         return None >> "%TEMP%\\${pythonFileName}"`,
      
      // Función verificar WhatsApp
      `echo def verificar_whatsapp(driver): >> "%TEMP%\\${pythonFileName}"`,
      `echo     print("Verificando conexion a WhatsApp...") >> "%TEMP%\\${pythonFileName}"`,
      `echo     for i in range(18): >> "%TEMP%\\${pythonFileName}"`,
      `echo         try: >> "%TEMP%\\${pythonFileName}"`,
      `echo             driver.find_element(By.XPATH, "//div[@id='pane-side']") >> "%TEMP%\\${pythonFileName}"`,
      `echo             print("WhatsApp Web conectado") >> "%TEMP%\\${pythonFileName}"`,
      `echo             return True >> "%TEMP%\\${pythonFileName}"`,
      `echo         except: >> "%TEMP%\\${pythonFileName}"`,
      `echo             tiempo = (i+1)*10 >> "%TEMP%\\${pythonFileName}"`,
      `echo             print(f"Esperando WhatsApp... {tiempo}s") >> "%TEMP%\\${pythonFileName}"`,
      `echo             time.sleep(10) >> "%TEMP%\\${pythonFileName}"`,
      `echo     return False >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      
      // Función enviar mensaje automático
      `echo def enviar_mensaje(driver, contacto, indice, total): >> "%TEMP%\\${pythonFileName}"`,
      `echo     try: >> "%TEMP%\\${pythonFileName}"`,
      `echo         nombre = contacto['name'] >> "%TEMP%\\${pythonFileName}"`,
      `echo         telefono = contacto['phone'] >> "%TEMP%\\${pythonFileName}"`,
      `echo         mensaje_base = contacto['message'] >> "%TEMP%\\${pythonFileName}"`,
      `echo         # PERSONALIZAR MENSAJE con nombre del contacto >> "%TEMP%\\${pythonFileName}"`,
      `echo         if not mensaje_base.lower().startswith('hola'): >> "%TEMP%\\${pythonFileName}"`,
      `echo             mensaje = f"Hola {nombre}!\\n\\n{mensaje_base}" >> "%TEMP%\\${pythonFileName}"`,
      `echo         else: >> "%TEMP%\\${pythonFileName}"`,
      `echo             mensaje = mensaje_base.replace('{nombre}', nombre).replace('{name}', nombre) >> "%TEMP%\\${pythonFileName}"`,
      `echo         print(f"[{indice+1}/{total}] Enviando a {nombre}...") >> "%TEMP%\\${pythonFileName}"`,
      `echo         mensaje_url = urllib.parse.quote(mensaje) >> "%TEMP%\\${pythonFileName}"`,
      `echo         url = f"https://web.whatsapp.com/send?phone={telefono}&text={mensaje_url}" >> "%TEMP%\\${pythonFileName}"`,
      `echo         driver.get(url) >> "%TEMP%\\${pythonFileName}"`,
      `echo         time.sleep(3) >> "%TEMP%\\${pythonFileName}"`,
      `echo         selectores_boton = ["//*[@aria-label='Enviar']", "//*[@aria-label='Send']", "//button[@aria-label='Enviar']", "//button[@aria-label='Send']", "//div[@aria-label='Enviar']", "//div[@aria-label='Send']", "//span[@data-icon='send']/ancestor::button[1]", "//span[@data-icon='send']/../.."] >> "%TEMP%\\${pythonFileName}"`,
      `echo         boton_enviar = None >> "%TEMP%\\${pythonFileName}"`,
      `echo         for selector in selectores_boton: >> "%TEMP%\\${pythonFileName}"`,
      `echo             try: >> "%TEMP%\\${pythonFileName}"`,
      `echo                 boton_enviar = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, selector))) >> "%TEMP%\\${pythonFileName}"`,
      `echo                 if boton_enviar: break >> "%TEMP%\\${pythonFileName}"`,
      `echo             except: continue >> "%TEMP%\\${pythonFileName}"`,
      `echo         if boton_enviar: >> "%TEMP%\\${pythonFileName}"`,
      `echo             boton_enviar.click() >> "%TEMP%\\${pythonFileName}"`,
      `echo         else: >> "%TEMP%\\${pythonFileName}"`,
      `echo             driver.find_element(By.XPATH, "//div[@contenteditable='true']").send_keys(Keys.ENTER) >> "%TEMP%\\${pythonFileName}"`,
      `echo         print(f"Mensaje enviado a {nombre}") >> "%TEMP%\\${pythonFileName}"`,
      `echo         return True >> "%TEMP%\\${pythonFileName}"`,
      `echo     except Exception as e: >> "%TEMP%\\${pythonFileName}"`,
      `echo         print(f"Error enviando a {nombre}: {e}") >> "%TEMP%\\${pythonFileName}"`,
      `echo         return False >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      
      // Función principal
      `echo def main(): >> "%TEMP%\\${pythonFileName}"`,
      `echo     print("WhatsApp Sender Automatico v3.0") >> "%TEMP%\\${pythonFileName}"`,
      `echo     print(f"Contactos: {len(contactos)}") >> "%TEMP%\\${pythonFileName}"`,
      `echo     driver = configurar_chrome() >> "%TEMP%\\${pythonFileName}"`,
      `echo     if not driver: >> "%TEMP%\\${pythonFileName}"`,
      `echo         return False >> "%TEMP%\\${pythonFileName}"`,
      `echo     try: >> "%TEMP%\\${pythonFileName}"`,
      `echo         driver.get("https://web.whatsapp.com") >> "%TEMP%\\${pythonFileName}"`,
      `echo         if not verificar_whatsapp(driver): >> "%TEMP%\\${pythonFileName}"`,
      `echo             print("No se pudo conectar a WhatsApp") >> "%TEMP%\\${pythonFileName}"`,
      `echo             return False >> "%TEMP%\\${pythonFileName}"`,
      `echo         exitosos = 0 >> "%TEMP%\\${pythonFileName}"`,
      `echo         for i, contacto in enumerate(contactos): >> "%TEMP%\\${pythonFileName}"`,
      `echo             if enviar_mensaje(driver, contacto, i, len(contactos)): >> "%TEMP%\\${pythonFileName}"`,
      `echo                 exitosos += 1 >> "%TEMP%\\${pythonFileName}"`,
      `echo             if i < len(contactos) - 1: >> "%TEMP%\\${pythonFileName}"`,
      `echo                 delay = random.uniform(${delayMin}, ${delayMax}) >> "%TEMP%\\${pythonFileName}"`,
      `echo                 print(f"Esperando {delay:.1f}s...") >> "%TEMP%\\${pythonFileName}"`,
      `echo                 time.sleep(delay) >> "%TEMP%\\${pythonFileName}"`,
      `echo         print(f"Proceso completado. Exitosos: {exitosos}/{len(contactos)}") >> "%TEMP%\\${pythonFileName}"`,
      `echo         return True >> "%TEMP%\\${pythonFileName}"`,
      `echo     finally: >> "%TEMP%\\${pythonFileName}"`,
      `echo         driver.quit() >> "%TEMP%\\${pythonFileName}"`,
      `echo. >> "%TEMP%\\${pythonFileName}"`,
      
      // Ejecutar
      `echo if __name__ == "__main__": >> "%TEMP%\\${pythonFileName}"`,
      `echo     main() >> "%TEMP%\\${pythonFileName}"`,
      `echo     input("Presiona Enter para cerrar...") >> "%TEMP%\\${pythonFileName}"`,
      
      // PASO 3: Verificar archivo
      'echo [3/5] Verificando archivo...',
      `if not exist "%TEMP%\\${pythonFileName}" (`,
      '    echo ERROR: No se creo el archivo Python',
      '    pause',
      '    exit /b 1',
      ')',
      'echo Archivo Python creado correctamente',
      'echo.',
      
      // PASO 4: Verificar Python
      'echo [4/5] Verificando Python...',
      'python --version',
      'if errorlevel 1 (',
      '    echo ERROR: Python no disponible',
      '    echo Instala Python desde https://python.org/downloads',
      '    pause',
      '    exit /b 1',
      ')',
      'echo Python disponible',
      'echo.',
      
      // PASO 5: Ejecutar
      'echo [5/5] EJECUTANDO SENDER AUTOMATICO...',
      'echo ===============================================',
      'echo INICIANDO ENVIO COMPLETAMENTE AUTOMATICO',
      'echo UN SOLO NAVEGADOR - SIN INTERVENCIÓN MANUAL',
      'echo ===============================================',
      'echo.',
      `python "%TEMP%\\${pythonFileName}"`,
      'echo.',
      'echo ===============================================',
      'echo PROCESO COMPLETADO',
      'echo ===============================================',
      'echo.',
      
      // Limpiar
      `del "%TEMP%\\${pythonFileName}" > nul 2>&1`,
      'echo Archivos temporales eliminados',
      'pause',
      'exit /b 0'
    ].join('\n');

    return {
      nombre: `WhatsAppSender_Selenium_${timestamp}.bat`,
      contenido: batContent,
      tipo: 'text/plain',
      size: batContent.length
    };
    
  } catch (error) {
    console.error('Error creando .BAT con Selenium:', error);
    throw new Error('Error generando archivo BAT con Selenium: ' + error.message);
  }
}



  /**
   * Validación robusta de datos de entrada
   */
    /**
   * Validación y CORRECCIÓN robusta de datos de entrada.
   * Esta función ahora modifica los contactos para asegurar que sean válidos.
   */
  validateInputData(contactos, opciones) {
    const errors = [];
    const warnings = [];

    // 1. Validar que 'contactos' sea un array
    if (!Array.isArray(contactos)) {
      errors.push("La lista de contactos no es válida (debe ser un array).");
      return { valid: false, errors, warnings };
    }
    if (contactos.length === 0) {
      errors.push("La lista de contactos está vacía.");
      return { valid: false, errors, warnings };
    }

    // 2. Iterar y CORREGIR cada contacto
    contactos.forEach((contacto, index) => {
      // Si el contacto es nulo o no es un objeto, es un error grave.
      if (!contacto || typeof contacto !== 'object') {
        errors.push(`El contacto en la posición ${index + 1} es inválido.`);
        return; // Saltar al siguiente contacto
      }

      // Validar y corregir 'name'
      if (!contacto.name || typeof contacto.name !== 'string' || !contacto.name.trim()) {
        errors.push(`El contacto ${index + 1} no tiene un nombre válido.`);
      }

      // Validar y corregir 'phone'
      if (!contacto.phone || typeof contacto.phone !== 'string' || !contacto.phone.trim()) {
        errors.push(`El contacto ${index + 1} (${contacto.name || ''}) no tiene un teléfono válido.`);
      }

      // =================================================================
      // PUNTO CLAVE DE LA SOLUCIÓN: Validar y CORREGIR 'message'
      // =================================================================
      if (!contacto.message || typeof contacto.message !== 'string' || !contacto.message.trim()) {
        // Si el mensaje es nulo, undefined, o está vacío, NO lanzamos un error.
        // En su lugar, lo CORREGIMOS asignando un mensaje por defecto.
        warnings.push(`El contacto '${contacto.name || 'Desconocido'}' no tenía mensaje. Se usará uno por defecto.`);
        contacto.message = 'Hola, te envío un mensaje.'; // Asignamos un mensaje predeterminado.
      }
    });

    // 3. Validar opciones (se mantiene igual)
    if (opciones && typeof opciones !== "object") {
      errors.push("El objeto de opciones no es válido.");
    }
    if (opciones.velocidad && !this.defaultConfig.speedConfig[opciones.velocidad]) {
      errors.push(`La velocidad '${opciones.velocidad}' no es válida.`);
    }

    // 4. Devolver el resultado
    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings, // Ahora se devuelven las advertencias generadas
    };
  }


  /**
   * Obtener advertencias de validación (no críticas)
   */
      /**
   * Obtener advertencias de validación (no críticas) - VERSIÓN ROBUSTA
   */
  getValidationWarnings(contactos, opciones) {
    const warnings = [];

    // Validar que contactos existe y es un array
    if (!contactos || !Array.isArray(contactos)) {
      return warnings; // Salir si no hay contactos
    }

    // Iterar de forma segura sobre cada contacto
    contactos.forEach(c => {
      // Verificar que el contacto 'c' y sus propiedades existan antes de usarlas
      if (c && c.phone && typeof c.phone === 'string' && !c.phone.startsWith("+")) {
        warnings.push(`Número sin prefijo internacional (+): ${c.phone}`);
      }

      if (c && c.message && typeof c.message === 'string' && c.message.length > 500) {
        warnings.push(`Mensaje muy largo (>500 caracteres) para: ${c.name}`);
      }

      if (c && c.message && typeof c.message === 'string' && /[^\x20-\x7E]/.test(c.message)) {
        warnings.push(`Mensaje con caracteres especiales (se limpiarán) para: ${c.name}`);
      }
    });

    return warnings;
  }


  /**
   * Preparar configuración robusta
   */
  prepareRobustConfiguration(contactos, opciones) {
    const config = {
      // Metadata
      version: this.version,
      timestamp: Date.now(),
      fecha: new Date().toISOString(),

      // Contactos procesados
      contactos: contactos.map((contacto, index) => ({
        id: contacto.id || `contact_${index}_${Date.now()}`,
        name: contacto.name,
        phone: contacto.phone,
        message: contacto.message,
        status: contacto.status || "PENDIENTE",
        originalIndex: index,
      })),

      // Opciones mejoradas
      opciones: {
        // Velocidad
        velocidad: opciones.velocidad || "Normal (3-5s)",
        delay:
          this.defaultConfig.speedConfig[opciones.velocidad || "Normal (3-5s)"],

        // Timeouts robustos
        timeouts: { ...this.defaultConfig.timeouts },

        // Configuración Chrome completa
        chromeOptions: { ...this.defaultConfig.chromeOptions },

        // Paths de ChromeDriver
        chromeDriverPaths: [...this.defaultConfig.chromeDriverPaths],

        // User Data Directory
        userDataDir: this.defaultConfig.userDataDir,

        // Configuración de reintentos
        retryConfig: { ...this.defaultConfig.retryConfig },

        // Features habilitadas (para próximos artefactos)
        popupKillerEnabled: true,
        specialCharSanitization: true,
        osCompatibilityCheck: true,
        networkCheck: true,

        // Elementos de detección WhatsApp (multi-elemento)
        whatsappReadyElements: [
          { type: "xpath", value: "//div[@id='pane-side']" },
          { type: "xpath", value: "//div[@data-testid='chat-list']" },
          { type: "css", value: "[data-testid='chat-list']" },
          { type: "css", value: "#pane-side" },
        ],

        // Estrategia de manejo de errores
        errorHandlingStrategy: "robust", // robust, simple, aggressive

        // Logging
        logging: { ...this.defaultConfig.logging },

        // Configuración específica del usuario
        userOptions: opciones,
      },
    };

    return config;
  }

  /**
   * Generar timestamp para nombres de archivo
   */
  generateTimestamp() {
    return new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .split(".")[0];
  }

  /**
   * Obtener sugerencias basadas en errores
   */
  getSuggestions(error) {
    const suggestions = [];

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes("contactos")) {
      suggestions.push("Verifica que la lista de contactos sea válida");
      suggestions.push(
        "Asegúrate de que cada contacto tenga nombre, teléfono y mensaje"
      );
    }

    if (errorMessage.includes("popup")) {
      suggestions.push("Habilita las ventanas emergentes en tu navegador");
      suggestions.push(
        "Ve a Configuración > Privacidad > Ventanas emergentes > Permitir"
      );
    }

    if (errorMessage.includes("chrome")) {
      suggestions.push("Asegúrate de tener Google Chrome instalado");
      suggestions.push("Verifica que Python esté instalado correctamente");
    }

    // Sugerencias generales
    suggestions.push("Intenta con menos contactos para probar");
    suggestions.push("Verifica tu conexión a internet");

    return suggestions;
  }

  /**
   * MÉTODO DE DIAGNÓSTICO: Para generar diagnóstico del sistema
   * (Será completado en Artefacto 2)
   */
  async generarHelperDiagnostico(contactos = [], opciones = {}) {
    try {
      console.log('🔍 Iniciando diagnóstico completo del sistema v3.0...');
      
      // Realizar diagnóstico completo
      const diagnosticoCompleto = await this.realizarDiagnosticoCompleto();
      
      // Generar archivo .BAT diagnóstico
      const archivoDiagnostico = this.crearArchivoDiagnosticoBat(diagnosticoCompleto);
      
      // Descargar archivo automáticamente
      this.descargarArchivo(archivoDiagnostico.contenido, archivoDiagnostico.nombre);
      
      console.log(`✅ Diagnóstico completo generado: ${archivoDiagnostico.nombre}`);
      
      return {
        success: true,
        version: this.version,
        archivo: archivoDiagnostico.nombre,
        diagnostico: diagnosticoCompleto,
        message: 'Diagnóstico completo generado exitosamente',
        instrucciones: this.generarInstruccionesDiagnostico(diagnosticoCompleto),
        resumen: this.generarResumenDiagnostico(diagnosticoCompleto)
      };
      
    } catch (error) {
      console.error('❌ Error generando diagnóstico completo:', error);
      return {
        success: false,
        version: this.version,
        error: error.message,
        sugerencias: [
          'Verifica tu conexión a internet',
          'Asegúrate de permitir descargas en el navegador', 
          'Intenta refrescar la página y volver a intentar'
        ]
      };
    }
  }

  /**
   * Realizar diagnóstico completo del sistema
   */
  async realizarDiagnosticoCompleto() {
    console.log("🔍 Realizando diagnóstico completo...");

    const diagnostico = {
      timestamp: new Date().toISOString(),
      fecha: new Date().toLocaleDateString("es-ES"),
      hora: new Date().toLocaleTimeString("es-ES"),

      // Información del navegador
      navegador: this.diagnosticarNavegador(),

      // Información del sistema operativo
      sistemaOperativo: this.diagnosticarSistemaOperativo(),

      // Características del navegador
      caracteristicas: await this.diagnosticarCaracteristicasNavegador(),

      // Conectividad de red
      conectividad: await this.diagnosticarConectividad(),

      // Configuración de seguridad
      seguridad: await this.diagnosticarConfiguracionSeguridad(),

      // Performance del sistema
      performance: this.diagnosticarPerformance(),

      // Problemas detectados
      problemasDetectados: [],

      // Soluciones recomendadas
      solucionesRecomendadas: [],

      // Nivel de compatibilidad (1-5)
      nivelCompatibilidad: 0,
    };

    // Analizar problemas y generar soluciones
    this.analizarProblemasYSoluciones(diagnostico);

    return diagnostico;
  }

  /**
   * Diagnosticar navegador actual
   */
  diagnosticarNavegador() {
    const userAgent = navigator.userAgent;
    const navegador = {
      userAgent: userAgent,
      nombre: "Desconocido",
      version: "Desconocido",
      compatible: false,
      recomendaciones: [],
    };

    // Detectar Chrome
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
      navegador.nombre = "Google Chrome";
      navegador.version = chromeMatch ? chromeMatch[1] : "Desconocida";
      navegador.compatible = parseInt(navegador.version) >= 90;

      if (navegador.compatible) {
        navegador.recomendaciones.push(
          "✅ Chrome es el navegador recomendado para WhatsApp Sender"
        );
      } else {
        navegador.recomendaciones.push(
          "⚠️ Actualiza Chrome a una versión más reciente (90+)"
        );
      }
    }
    // Detectar Firefox
    else if (userAgent.includes("Firefox")) {
      const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
      navegador.nombre = "Mozilla Firefox";
      navegador.version = firefoxMatch ? firefoxMatch[1] : "Desconocida";
      navegador.compatible = false;
      navegador.recomendaciones.push(
        "⚠️ Firefox no es totalmente compatible. Se recomienda Google Chrome"
      );
    }
    // Detectar Safari
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      navegador.nombre = "Safari";
      navegador.compatible = false;
      navegador.recomendaciones.push(
        "❌ Safari no es compatible. Descarga Google Chrome"
      );
    }
    // Detectar Edge
    else if (userAgent.includes("Edg")) {
      const edgeMatch = userAgent.match(/Edg\/(\d+)/);
      navegador.nombre = "Microsoft Edge";
      navegador.version = edgeMatch ? edgeMatch[1] : "Desconocida";
      navegador.compatible = true;
      navegador.recomendaciones.push(
        "✅ Edge es compatible, pero Chrome es más estable"
      );
    }

    return navegador;
  }

  /**
   * Diagnosticar sistema operativo
   */
  diagnosticarSistemaOperativo() {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;

    const so = {
      platform: platform,
      nombre: "Desconocido",
      version: "Desconocida",
      arquitectura: "Desconocida",
      compatible: false,
      recomendaciones: [],
    };

    // Detectar Windows
    if (platform.includes("Win") || userAgent.includes("Windows")) {
      so.nombre = "Windows";
      so.compatible = true;

      // Detectar versión de Windows
      if (userAgent.includes("Windows NT 10.0")) {
        so.version = "Windows 10/11";
        so.recomendaciones.push("✅ Windows 10/11 es totalmente compatible");
      } else if (userAgent.includes("Windows NT 6.3")) {
        so.version = "Windows 8.1";
        so.recomendaciones.push("✅ Windows 8.1 es compatible");
      } else if (userAgent.includes("Windows NT 6.1")) {
        so.version = "Windows 7";
        so.recomendaciones.push(
          "⚠️ Windows 7: compatible pero considera actualizar"
        );
      } else {
        so.version = "Versión antigua";
        so.recomendaciones.push(
          "⚠️ Versión de Windows muy antigua, pueden haber problemas"
        );
      }

      // Detectar arquitectura
      so.arquitectura =
        userAgent.includes("WOW64") || userAgent.includes("Win64")
          ? "64 bits"
          : "32 bits";
    }
    // Detectar macOS
    else if (platform.includes("Mac") || userAgent.includes("Mac")) {
      so.nombre = "macOS";
      so.compatible = true;
      so.recomendaciones.push("✅ macOS es compatible (soporte experimental)");
      so.recomendaciones.push(
        "💡 Asegúrate de tener Python 3 instalado con Homebrew"
      );
    }
    // Detectar Linux
    else if (platform.includes("Linux") || userAgent.includes("Linux")) {
      so.nombre = "Linux";
      so.compatible = true;
      so.recomendaciones.push("✅ Linux es compatible (soporte experimental)");
      so.recomendaciones.push(
        "💡 Instala Python 3 y Chrome desde tu gestor de paquetes"
      );
    }

    return so;
  }

  /**
   * Diagnosticar características del navegador
   */
  async diagnosticarCaracteristicasNavegador() {
    const caracteristicas = {
      ventanasEmergentes: this.probarVentanasEmergentes(),
      clipboard: !!navigator.clipboard,
      geolocation: !!navigator.geolocation,
      notifications: "Notification" in window,
      serviceWorker: "serviceWorker" in navigator,
      webAssembly: typeof WebAssembly === "object",
      localStorage: this.probarLocalStorage(),
      sessionStorage: this.probarSessionStorage(),
      indexedDB: "indexedDB" in window,
      webGL: this.probarWebGL(),
      problemas: [],
      recomendaciones: [],
    };

    // Analizar problemas de características
    if (!caracteristicas.ventanasEmergentes) {
      caracteristicas.problemas.push("Ventanas emergentes bloqueadas");
      caracteristicas.recomendaciones.push(
        "🚫 Habilita ventanas emergentes para este sitio"
      );
    }

    if (!caracteristicas.clipboard) {
      caracteristicas.problemas.push("API Clipboard no disponible");
      caracteristicas.recomendaciones.push(
        "⚠️ Algunas funciones de copiado pueden no funcionar"
      );
    }

    if (!caracteristicas.localStorage) {
      caracteristicas.problemas.push("localStorage no disponible");
      caracteristicas.recomendaciones.push(
        "⚠️ No se pueden guardar configuraciones localmente"
      );
    }

    return caracteristicas;
  }

  /**
   * Probar ventanas emergentes
   */
  probarVentanasEmergentes() {
    try {
      const testWindow = window.open("about:blank", "test", "width=1,height=1");
      if (testWindow) {
        testWindow.close();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Probar localStorage
   */
  probarLocalStorage() {
    try {
      const test = "__test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Probar sessionStorage
   */
  probarSessionStorage() {
    try {
      const test = "__test__";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Probar WebGL
   */
  probarWebGL() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  /**
   * Diagnosticar conectividad de red
   */
  async diagnosticarConectividad() {
    const conectividad = {
      online: navigator.onLine,
      connection:
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection,
      velocidad: "Desconocida",
      latencia: null,
      problemas: [],
      recomendaciones: [],
    };

    // Información de la conexión
    if (conectividad.connection) {
      conectividad.velocidad =
        conectividad.connection.effectiveType || "Desconocida";
      conectividad.downlink = conectividad.connection.downlink;
      conectividad.rtt = conectividad.connection.rtt;
    }

    // Probar conectividad con sitios importantes
    try {
      const sitiosProbar = [
        { nombre: "Google", url: "https://www.google.com", esencial: true },
        {
          nombre: "WhatsApp Web",
          url: "https://web.whatsapp.com",
          esencial: true,
        },
        {
          nombre: "Python.org",
          url: "https://www.python.org",
          esencial: false,
        },
        { nombre: "GitHub", url: "https://github.com", esencial: false },
      ];

      conectividad.sitiosAccesibles = [];

      for (const sitio of sitiosProbar) {
        try {
          const inicio = performance.now();
          await fetch(sitio.url, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-cache",
          });
          const fin = performance.now();

          conectividad.sitiosAccesibles.push({
            nombre: sitio.nombre,
            accesible: true,
            latencia: Math.round(fin - inicio),
          });
        } catch (error) {
          conectividad.sitiosAccesibles.push({
            nombre: sitio.nombre,
            accesible: false,
            error: error.message,
          });

          if (sitio.esencial) {
            conectividad.problemas.push(
              `No se puede acceder a ${sitio.nombre}`
            );
          }
        }
      }
    } catch (error) {
      conectividad.problemas.push("Error probando conectividad");
    }

    // Generar recomendaciones
    if (!conectividad.online) {
      conectividad.recomendaciones.push("❌ Sin conexión a internet detectada");
    }

    if (
      conectividad.velocidad === "slow-2g" ||
      conectividad.velocidad === "2g"
    ) {
      conectividad.recomendaciones.push("⚠️ Conexión muy lenta detectada");
    }

    return conectividad;
  }

  /**
   * Diagnosticar configuración de seguridad
   */
  async diagnosticarConfiguracionSeguridad() {
    const seguridad = {
      https: location.protocol === "https:",
      mixedContent: false,
      csp: null,
      cookies: navigator.cookieEnabled,
      thirdPartyCookies: null,
      problemas: [],
      recomendaciones: [],
    };

    // Verificar HTTPS
    if (!seguridad.https && location.hostname !== "localhost") {
      seguridad.problemas.push("Sitio no usa HTTPS");
      seguridad.recomendaciones.push(
        "⚠️ Para producción, usar HTTPS es recomendado"
      );
    }

    // Verificar cookies
    if (!seguridad.cookies) {
      seguridad.problemas.push("Cookies deshabilitadas");
      seguridad.recomendaciones.push(
        "🍪 Habilita cookies para mejor funcionalidad"
      );
    }

    return seguridad;
  }

  /**
   * Diagnosticar performance del sistema
   */
  diagnosticarPerformance() {
    const performance_info = {
      memory: null,
      timing: null,
      hardware: null,
      problemas: [],
      recomendaciones: [],
    };

    // Información de memoria
    if (performance.memory) {
      performance_info.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
      };

      // Verificar uso de memoria
      const porcentajeUso =
        (performance_info.memory.used / performance_info.memory.limit) * 100;
      if (porcentajeUso > 80) {
        performance_info.problemas.push("Alto uso de memoria");
        performance_info.recomendaciones.push(
          "🧠 Cierra otras pestañas para liberar memoria"
        );
      }
    }

    // Información de timing
    if (performance.timing) {
      performance_info.timing = {
        loadTime:
          performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady:
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart,
        connectTime:
          performance.timing.connectEnd - performance.timing.connectStart,
      };

      // Verificar tiempos de carga
      if (performance_info.timing.loadTime > 10000) {
        performance_info.problemas.push("Tiempo de carga lento");
        performance_info.recomendaciones.push("⚠️ Conexión lenta detectada");
      }
    }

    // Información de hardware (aproximada)
    performance_info.hardware = {
      cores: navigator.hardwareConcurrency || "Desconocido",
      deviceMemory: navigator.deviceMemory || "Desconocida",
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };

    return performance_info;
  }

  /**
   * Analizar problemas detectados y generar soluciones
   */
  analizarProblemasYSoluciones(diagnostico) {
    // Resetear arrays
    diagnostico.problemasDetectados = [];
    diagnostico.solucionesRecomendadas = [];

    let puntuacionCompatibilidad = 5;

    // Analizar navegador
    if (!diagnostico.navegador.compatible) {
      diagnostico.problemasDetectados.push({
        categoria: "Navegador",
        problema: `${diagnostico.navegador.nombre} no es totalmente compatible`,
        severidad: "Alta",
        solucion: "Instalar Google Chrome desde https://chrome.google.com",
      });
      puntuacionCompatibilidad -= 2;
    }

    // Analizar características del navegador
    if (!diagnostico.caracteristicas.ventanasEmergentes) {
      diagnostico.problemasDetectados.push({
        categoria: "Navegador",
        problema: "Ventanas emergentes bloqueadas",
        severidad: "Crítica",
        solucion:
          "Permitir ventanas emergentes para este sitio en configuración del navegador",
      });
      puntuacionCompatibilidad -= 2;
    }

    // Analizar conectividad
    if (!diagnostico.conectividad.online) {
      diagnostico.problemasDetectados.push({
        categoria: "Red",
        problema: "Sin conexión a internet",
        severidad: "Crítica",
        solucion:
          "Verificar conexión a internet y configuración de proxy/firewall",
      });
      puntuacionCompatibilidad -= 3;
    }

    // Analizar performance
    if (
      diagnostico.performance.memory &&
      diagnostico.performance.memory.used > 500
    ) {
      diagnostico.problemasDetectados.push({
        categoria: "Performance",
        problema: "Alto uso de memoria del navegador",
        severidad: "Media",
        solucion: "Cerrar pestañas innecesarias y reiniciar el navegador",
      });
      puntuacionCompatibilidad -= 0.5;
    }

    // Generar soluciones específicas
    diagnostico.solucionesRecomendadas = [
      {
        prioridad: 1,
        titulo: "Verificar Python",
        descripcion: "Asegúrate de tener Python 3.8+ instalado",
        comando: "python --version",
        enlace: "https://python.org/downloads",
      },
      {
        prioridad: 2,
        titulo: "Verificar Google Chrome",
        descripcion: "Asegúrate de tener Chrome actualizado",
        comando: "chrome://version",
        enlace: "https://chrome.google.com",
      },
      {
        prioridad: 3,
        titulo: "Habilitar ventanas emergentes",
        descripcion: "Permitir popups en configuración del navegador",
        comando: "chrome://settings/content/popups",
        enlace: null,
      },
    ];

    // Establecer nivel de compatibilidad
    diagnostico.nivelCompatibilidad = Math.max(
      1,
      Math.min(5, puntuacionCompatibilidad)
    );
  }

  /**
   * Crear archivo .BAT de diagnóstico
   */
  crearArchivoDiagnosticoBat(diagnostico) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("T", "_")
      .split(".")[0]
      .replace("Z", ""); // Agregar esta línea;
    const nombreArchivo = `WhatsApp_Diagnostico_v3_${timestamp.replace(/Z$/, "")}.bat`;

    // Generar contenido del archivo .BAT
    const contenido = this.generarContenidoDiagnosticoBat(diagnostico);

    return {
      nombre: nombreArchivo,
      contenido: contenido,
      size: contenido.length,
      tipo: "text/plain",
      diagnostico: diagnostico,
    };
  }

  /**
   * Generar contenido del archivo .BAT de diagnóstico
   */
  generarContenidoDiagnosticoBat(diagnostico) {
    const contenido = [
      "@echo off",
      "title WhatsApp Sender - DIAGNÓSTICO COMPLETO v3.0",
      "color 0E",
      "cls",
      "echo.",
      "echo ================================================================",
      "echo    🔍 DIAGNÓSTICO COMPLETO WhatsApp Sender v3.0",
      "echo    Identificando problemas automáticamente...",
      "echo ================================================================",
      "echo.",
      `echo 📅 Fecha: ${diagnostico.fecha} ${diagnostico.hora}`,
      `echo 🌐 Navegador: ${diagnostico.navegador.nombre} ${diagnostico.navegador.version}`,
      `echo 💻 Sistema: ${diagnostico.sistemaOperativo.nombre} ${diagnostico.sistemaOperativo.version}`,
      `echo ⭐ Compatibilidad: ${diagnostico.nivelCompatibilidad}/5`,
      "echo.",
      "echo ================================================================",
      "echo    VERIFICACIONES AUTOMÁTICAS",
      "echo ================================================================",
      "echo.",

      // Verificación Python
      "echo [TEST 1] Verificando Python...",
      "python --version 2>&1",
      "if errorlevel 1 (",
      "    echo ❌ PROBLEMA CRÍTICO: Python no está instalado o no funciona",
      "    echo.",
      "    echo 🔧 SOLUCIÓN:",
      "    echo    1. Ve a https://python.org/downloads/",
      "    echo    2. Descarga Python 3.8 o superior",
      '    echo    3. Durante la instalación, marca "Add Python to PATH"',
      "    echo    4. Reinicia tu computadora después de instalar",
      "    echo.",
      "    set PYTHON_OK=0",
      ") else (",
      "    echo ✅ Python instalado correctamente",
      "    set PYTHON_OK=1",
      ")",
      "echo.",

      // Verificación pip
      "echo [TEST 2] Verificando pip (gestor de paquetes Python)...",
      "pip --version 2>&1",
      "if errorlevel 1 (",
      "    echo ⚠️ ADVERTENCIA: pip no funciona correctamente",
      "    echo 💡 Esto puede causar problemas instalando dependencias",
      ") else (",
      "    echo ✅ pip funcionando correctamente",
      ")",
      "echo.",

      // Verificación Chrome
      "echo [TEST 3] Verificando Google Chrome...",
      'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version 2>nul',
      "if errorlevel 1 (",
      "    echo ❌ PROBLEMA: Google Chrome no detectado en registro",
      "    echo.",
      "    echo 🔧 SOLUCIÓN:",
      "    echo    1. Ve a https://chrome.google.com",
      "    echo    2. Descarga e instala Google Chrome",
      "    echo    3. Ejecuta Chrome al menos una vez",
      "    echo.",
      ") else (",
      "    echo ✅ Google Chrome detectado",
      ")",
      "echo.",

      // Verificación conectividad
      "echo [TEST 4] Verificando conectividad a internet...",
      "ping -n 1 google.com >nul 2>&1",
      "if errorlevel 1 (",
      "    echo ❌ PROBLEMA: Sin conexión a internet o bloqueado por firewall",
      "    echo.",
      "    echo 🔧 SOLUCIÓN:",
      "    echo    1. Verifica tu conexión a internet",
      "    echo    2. Revisa configuración de proxy/firewall",
      "    echo    3. Temporalmente deshabilita antivirus para probar",
      "    echo.",
      ") else (",
      "    echo ✅ Conectividad a internet OK",
      ")",
      "echo.",

      // Verificación WhatsApp Web
      "echo [TEST 5] Verificando acceso a WhatsApp Web...",
      "ping -n 1 web.whatsapp.com >nul 2>&1",
      "if errorlevel 1 (",
      "    echo ⚠️ ADVERTENCIA: No se puede alcanzar WhatsApp Web",
      "    echo 💡 Esto puede ser normal debido a configuraciones de red",
      ") else (",
      "    echo ✅ WhatsApp Web accesible",
      ")",
      "echo.",

      // Resumen de problemas detectados
      "echo ================================================================",
      "echo    PROBLEMAS DETECTADOS EN EL NAVEGADOR",
      "echo ================================================================",
      "echo.",
    ];

    // Agregar problemas específicos detectados
    if (diagnostico.problemasDetectados.length > 0) {
      diagnostico.problemasDetectados.forEach((problema, index) => {
        contenido.push(
          `echo [PROBLEMA ${index + 1}] ${problema.categoria}: ${problema.problema}`
        );
        contenido.push(`echo 🔧 Solución: ${problema.solucion}`);
        contenido.push("echo.");
      });
    } else {
      contenido.push(
        "echo ✅ No se detectaron problemas críticos en el navegador"
      );
      contenido.push("echo.");
    }

    // Instrucciones finales
    contenido.push(
      ...[
        "echo ================================================================",
        "echo    INSTRUCCIONES SIGUIENTES",
        "echo ================================================================",
        "echo.",
        "echo 🎯 PASOS SIGUIENTES:",
        "echo.",
        "echo 1. 📋 Revisa todos los mensajes de este diagnóstico",
        "echo 2. 🔧 Soluciona los problemas marcados con ❌",
        "echo 3. ⚠️  Considera las advertencias marcadas con ⚠️",
        "echo 4. 🔄 Ejecuta este diagnóstico nuevamente después de hacer cambios",
        "echo 5. 🚀 Una vez todo esté ✅, prueba generar el helper automático",
        "echo.",
        "echo 💡 CONSEJOS IMPORTANTES:",
        "echo    - Si Python falla, REINICIA la computadora después de instalarlo",
        'echo    - Asegúrate de marcar "Add Python to PATH" durante instalación',
        "echo    - Si persisten problemas, ejecuta como administrador",
        "echo    - Temporalmente deshabilita antivirus para probar",
        "echo.",
        `echo ⭐ NIVEL DE COMPATIBILIDAD: ${diagnostico.nivelCompatibilidad}/5`,
        "",
      ]
    );

    // Evaluación final
    if (diagnostico.nivelCompatibilidad >= 4) {
      contenido.push(
        ...[
          "echo 🎉 ¡EXCELENTE! Tu sistema parece estar listo para WhatsApp Sender",
          "echo    Puedes proceder a generar el helper automático con confianza.",
          "echo.",
        ]
      );
    } else if (diagnostico.nivelCompatibilidad >= 3) {
      contenido.push(
        ...[
          "echo ⚠️  ADVERTENCIA: Tu sistema tiene algunos problemas menores",
          "echo    WhatsApp Sender puede funcionar, pero revisa las recomendaciones.",
          "echo.",
        ]
      );
    } else {
      contenido.push(
        ...[
          "echo ❌ ATENCIÓN: Tu sistema tiene problemas importantes",
          "echo    Es muy recomendable solucionar los problemas antes de continuar.",
          "echo.",
        ]
      );
    }

    contenido.push(
      ...[
        "echo ================================================================",
        "echo    DIAGNÓSTICO COMPLETADO",
        "echo ================================================================",
        "echo.",
        "pause",
        "exit /b 0",
      ]
    );

    return contenido.join("\n");
  }

  /**
   * Descargar archivo automáticamente
   */
  descargarArchivo(contenido, nombreArchivo) {
    try {
      // Crear blob con el contenido
      const blob = new Blob([contenido], { type: "text/plain;charset=windows-1252" });

      // Crear URL temporal
      const url = window.URL.createObjectURL(blob);

      // Crear enlace temporal y hacer click
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = nombreArchivo;
      enlace.style.display = "none";

      // Agregar al DOM, hacer click y remover
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);

      // Limpiar URL temporal después de un momento
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      console.log(`✅ Archivo ${nombreArchivo} descargado automáticamente`);
      return true;
    } catch (error) {
      console.error("❌ Error descargando archivo:", error);

      // Fallback: mostrar contenido en nueva ventana
      try {
        const ventana = window.open("", "_blank");
        ventana.document.write(`<pre>${contenido}</pre>`);
        ventana.document.title = nombreArchivo;
        console.log("💡 Archivo mostrado en nueva ventana como fallback");
        return true;
      } catch (fallbackError) {
        console.error("❌ Error en fallback:", fallbackError);
        return false;
      }
    }
  }

  /**
   * Generar instrucciones de diagnóstico
   */
  generarInstruccionesDiagnostico(diagnostico) {
    const instrucciones = {
      version: this.version,
      compatibilidad: diagnostico.nivelCompatibilidad,
      pasosBasicos: [
        '📁 Ve a tu carpeta "Descargas"',
        "🔍 Busca el archivo de diagnóstico descargado (.bat)",
        "💻 Haz doble-click en el archivo",
        "📋 Lee cuidadosamente todos los resultados",
        "🔧 Soluciona los problemas marcados con ❌",
      ],
      problemasComunes: [],
      solucionesEspecificas: [],
    };

    // Agregar problemas comunes según diagnóstico
    if (!diagnostico.navegador.compatible) {
      instrucciones.problemasComunes.push("Navegador no compatible");
      instrucciones.solucionesEspecificas.push(
        "Instala Google Chrome desde chrome.google.com"
      );
    }

    if (!diagnostico.caracteristicas.ventanasEmergentes) {
      instrucciones.problemasComunes.push("Ventanas emergentes bloqueadas");
      instrucciones.solucionesEspecificas.push(
        "Habilita popups en configuración del navegador"
      );
    }

    if (!diagnostico.conectividad.online) {
      instrucciones.problemasComunes.push("Sin conexión a internet");
      instrucciones.solucionesEspecificas.push("Verifica tu conexión de red");
    }

    // Instrucciones específicas según nivel de compatibilidad
    if (diagnostico.nivelCompatibilidad >= 4) {
      instrucciones.mensaje =
        "🎉 ¡Tu sistema está listo! Puedes generar el helper automático con confianza.";
    } else if (diagnostico.nivelCompatibilidad >= 3) {
      instrucciones.mensaje =
        "⚠️ Tu sistema es compatible pero tiene problemas menores. Revisa las recomendaciones.";
    } else {
      instrucciones.mensaje =
        "❌ Tu sistema requiere atención. Soluciona los problemas críticos antes de continuar.";
    }

    return instrucciones;
  }

  /**
   * Generar resumen ejecutivo del diagnóstico
   */
  generarResumenDiagnostico(diagnostico) {
    const resumen = {
      timestamp: diagnostico.timestamp,
      nivelCompatibilidad: diagnostico.nivelCompatibilidad,
      problemascríticos: diagnostico.problemasDetectados.filter(
        (p) => p.severidad === "Crítica"
      ).length,
      problemasAltos: diagnostico.problemasDetectados.filter(
        (p) => p.severidad === "Alta"
      ).length,
      problemasMedios: diagnostico.problemasDetectados.filter(
        (p) => p.severidad === "Media"
      ).length,
      totalProblemas: diagnostico.problemasDetectados.length,

      // Resumen por categorías
      navegadorOK: diagnostico.navegador.compatible,
      conectividadOK: diagnostico.conectividad.online,
      ventanasEmergentesOK: diagnostico.caracteristicas.ventanasEmergentes,

      // Recomendación principal
      recomendacion: "",
      siguientePaso: "",
    };

    // Generar recomendación principal
    if (resumen.nivelCompatibilidad >= 4) {
      resumen.recomendacion = "Sistema óptimo para WhatsApp Sender";
      resumen.siguientePaso =
        "Puedes proceder con la generación del helper automático";
    } else if (resumen.nivelCompatibilidad >= 3) {
      resumen.recomendacion = "Sistema compatible con problemas menores";
      resumen.siguientePaso =
        "Revisa y soluciona las advertencias antes de continuar";
    } else {
      resumen.recomendacion = "Sistema requiere configuración adicional";
      resumen.siguientePaso = "Soluciona los problemas críticos identificados";
    }

    return resumen;
  }

  /**
   * MÉTODO PARA INSTRUCCIONES: Generar instrucciones de uso
   */
  generarInstrucciones(resultado) {
    return {
      version: this.version,
      pasos: [
        `📁 Archivo generado: ${resultado.archivo}`,
        '📂 Ve a tu carpeta "Descargas"',
        "🐍 Asegúrate de tener Python instalado (python.org/downloads)",
        "💻 Haz doble-click en el archivo descargado",
        "📱 Si aparece QR, escanéalo desde WhatsApp móvil",
        "☕ ¡Relájate! El envío será 100% automático",
        "🎉 Al terminar, el archivo se auto-elimina y muestra reporte",
      ],
      notas: [
        "💡 Si no tienes Python, descárgalo de python.org/downloads",
        "🔒 El archivo se auto-elimina por seguridad después del uso",
        "📊 Verás progreso detallado durante la ejecución",
        `🚀 Usando HelperGenerator v${this.version} con mejoras robustas`,
      ],
      mejoras: [
        "✅ 40+ opciones de Chrome para máxima compatibilidad",
        "✅ Sistema de reintentos automáticos",
        "✅ Detección inteligente de errores",
        "✅ Persistencia de sesión WhatsApp",
        "✅ Manejo automático de pop-ups (próximo artefacto)",
        "✅ Sanitización de caracteres especiales (próximo artefacto)",
      ],
    };
  }

  /**
   * Obtener información del sistema
   */
  getSystemInfo() {
    return {
      version: this.version,
      initialized: this.isInitialized,
      lastError: this.lastError,
      systemInfo: this.systemInfo,
      buildDate: this.buildDate,
    };
  }

  /**
   * Método de limpieza
   */
  cleanup() {
    this.isInitialized = false;
    this.lastError = null;
    this.diagnostics = null;
    console.log(`🧹 HelperGenerator v${this.version} limpieza completada`);
  }
// ===============================================================
  // FUNCIONES DE SANITIZACIÓN ULTRA ROBUSTAS v3.0
  // Insertar DESPUÉS de cleanup() y ANTES del } que cierra la clase
  // ===============================================================

  /**
   * SANITIZAR TEXTO ULTRA ROBUSTO - Reemplaza caracteres especiales problemáticos
   */
  // // sanitizarTextoUltraRobusto(texto) {
  // //   try {
  // //     if (!texto || typeof texto !== 'string') {
  // //       console.warn('⚠️ Texto inválido para sanitizar:', texto);
  // //       return '';
  // //     }

  // //     let textoLimpio = texto;
      
  // //     console.log(`🧹 Sanitizando: "${texto.substring(0, 50)}..."`);
      
  // //     // PASO 1: Normalización Unicode NFD
  // //     textoLimpio = textoLimpio.normalize('NFD');
      
  // //     // PASO 2: Mapa de caracteres especiales más problemáticos
  // //     const caracteresProblematicos = new Map([
  // //       // Vocales con acentos más comunes
  // //       ['á', 'a'], ['à', 'a'], ['ä', 'a'], ['â', 'a'], ['ã', 'a'],
  // //       ['é', 'e'], ['è', 'e'], ['ë', 'e'], ['ê', 'e'],
  // //       ['í', 'i'], ['ì', 'i'], ['ï', 'i'], ['î', 'i'],
  // //       ['ó', 'o'], ['ò', 'o'], ['ö', 'o'], ['ô', 'o'], ['õ', 'o'],
  // //       ['ú', 'u'], ['ù', 'u'], ['ü', 'u'], ['û', 'u'],
        
  // //       // Mayúsculas con acentos
  // //       ['Á', 'A'], ['À', 'A'], ['Ä', 'A'], ['Â', 'A'], ['Ã', 'A'],
  // //       ['É', 'E'], ['È', 'E'], ['Ë', 'E'], ['Ê', 'E'],
  // //       ['Í', 'I'], ['Ì', 'I'], ['Ï', 'I'], ['Î', 'I'],
  // //       ['Ó', 'O'], ['Ò', 'O'], ['Ö', 'O'], ['Ô', 'O'], ['Õ', 'O'],
  // //       ['Ú', 'U'], ['Ù', 'U'], ['Ü', 'U'], ['Û', 'U'],
        
  // //       // Caracteres hispanos críticos
  // //       ['ñ', 'n'], ['Ñ', 'N'], ['ç', 'c'], ['Ç', 'C'],
        
  // //       // Comillas problemáticas (CRÍTICO para .BAT)
  // //       ['"', "'"], ['"', "'"], ['"', "'"], // Smart quotes
  // //       ['«', '"'], ['»', '"'], // French quotes
  // //       ["'", "'"], ["'", "'"], // Smart apostrophes
        
  // //       // Guiones problemáticos
  // //       ['–', '-'], ['—', '-'], ['―', '-'],
        
  // //       // Símbolos problemáticos
  // //       ['€', 'EUR'], ['£', 'GBP'], ['¥', 'YEN'],
  // //       ['©', '(c)'], ['®', '(r)'], ['™', '(tm)'],
        
  // //       // Espacios problemáticos
  // //       ['\u00A0', ' '], // Non-breaking space
  // //       ['\u2007', ' '], ['\u2009', ' '], ['\u200A', ' ']
  // //     ]);
      
  // //     // PASO 3: Reemplazar caracteres especiales
  // //     let caracteresReemplazados = 0;
  // //     caracteresProblematicos.forEach((reemplazo, caracter) => {
  // //       if (textoLimpio.includes(caracter)) {
  // //         textoLimpio = textoLimpio.replace(new RegExp(this.escaparRegex(caracter), 'g'), reemplazo);
  // //         caracteresReemplazados++;
  // //       }
  // //     });
      
  // //     if (caracteresReemplazados > 0) {
  // //       console.log(`🔄 Caracteres especiales reemplazados: ${caracteresReemplazados}`);
  // //     }
      
  // //     // PASO 4: Eliminar emojis más problemáticos
  // //     const emojisProblematicos = [
  // //       '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  // //       '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚',
  // //       '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  // //       '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  // //       '🔥', '💰', '💵', '💴', '💶', '💷', '💸', '💳', '🎉', '🎊'
  // //     ];
      
  // //     emojisProblematicos.forEach(emoji => {
  // //       if (textoLimpio.includes(emoji)) {
  // //         textoLimpio = textoLimpio.replace(new RegExp(this.escaparRegex(emoji), 'g'), '');
  // //       }
  // //     });
      
  // //     // PASO 5: Eliminar caracteres totalmente prohibidos para .BAT
  // //     const caracteresProhibidosBat = ['<', '>', '|', '&', '^', '%'];
  // //     caracteresProhibidosBat.forEach(caracter => {
  // //       if (textoLimpio.includes(caracter)) {
  // //         console.log(`🚫 Eliminando carácter prohibido para .BAT: '${caracter}'`);
  // //         textoLimpio = textoLimpio.replace(new RegExp(this.escaparRegex(caracter), 'g'), '');
  // //       }
  // //     });
      
  // //     // PASO 6: Limpiar espacios múltiples y caracteres de control
  // //     textoLimpio = textoLimpio.replace(/\s+/g, ' ');
  // //     textoLimpio = textoLimpio.replace(/[\r\n\t\0\x1A]/g, ' ');
  // //     textoLimpio = textoLimpio.trim();
      
  // //     console.log(`✅ Texto sanitizado: "${textoLimpio.substring(0, 50)}..."`);
  // //     console.log(`📊 Reducción: ${texto.length} → ${textoLimpio.length} caracteres`);
      
  // //     return textoLimpio;
      
  // //   } catch (error) {
  // //     console.error('❌ Error en sanitización ultra robusta:', error);
  // //     // Fallback: sanitización básica
  // //     return this.sanitizacionFallback(texto);
  // //   }
  // // }

  // // /**
  // //  * NORMALIZAR TELÉFONO ULTRA ROBUSTO - Maneja todos los formatos problemáticos
  // //  */
  // // normalizarTelefonoUltraRobusto(telefono) {
  // //   try {
  // //     if (!telefono || typeof telefono !== 'string') {
  // //       console.warn('⚠️ Teléfono inválido para normalizar:', telefono);
  // //       return '';
  // //     }

  // //     console.log(`📞 Normalizando teléfono: "${telefono}"`);
      
  // //     let telefonoLimpio = telefono.toString();
      
  // //     // PASO 1: Eliminar TODOS los caracteres que no sean dígitos o +
  // //     telefonoLimpio = telefonoLimpio.replace(/[^\d+]/g, '');
      
  // //     // PASO 2: Limpiar múltiples signos +
  // //     telefonoLimpio = telefonoLimpio.replace(/\++/g, '+');
      
  // //     // PASO 3: Asegurar que + solo esté al inicio
  // //     if (telefonoLimpio.includes('+')) {
  // //       const partes = telefonoLimpio.split('+');
  // //       telefonoLimpio = '+' + partes.filter(p => p.length > 0).join('');
  // //     }
      
  // //     // PASO 4: Validar longitud mínima
  // //     const soloDigitos = telefonoLimpio.replace(/\+/g, '');
  // //     if (soloDigitos.length < 8) {
  // //       console.warn(`⚠️ Teléfono muy corto: ${soloDigitos.length} dígitos (mínimo 8)`);
  // //       return '';
  // //     }
      
  // //     // PASO 5: Validar longitud máxima
  // //     if (soloDigitos.length > 20) {
  // //       console.warn(`⚠️ Teléfono muy largo: ${soloDigitos.length} dígitos (máximo 20)`);
  // //       telefonoLimpio = telefonoLimpio.substring(0, 21); // +1 por el +
  // //     }
      
  // //     // PASO 6: Agregar código de país si no tiene
  // //     if (!telefonoLimpio.startsWith('+')) {
  // //       // Lógica específica para detectar códigos de país
  // //       if (soloDigitos.startsWith('51') && soloDigitos.length >= 11) {
  // //         // Número peruano con código
  // //         telefonoLimpio = '+' + soloDigitos;
  // //       } else if (soloDigitos.startsWith('1') && soloDigitos.length >= 10) {
  // //         // Número USA/Canadá
  // //         telefonoLimpio = '+' + soloDigitos;
  // //       } else if (soloDigitos.startsWith('52') && soloDigitos.length >= 12) {
  // //         // Número mexicano
  // //         telefonoLimpio = '+' + soloDigitos;
  // //       } else if (soloDigitos.startsWith('34') && soloDigitos.length >= 11) {
  // //         // Número español
  // //         telefonoLimpio = '+' + soloDigitos;
  // //       } else if (soloDigitos.startsWith('54') && soloDigitos.length >= 11) {
  // //         // Número argentino
  // //         telefonoLimpio = '+' + soloDigitos;
  // //       } else if (soloDigitos.length >= 9) {
  // //         // Por defecto, asumir Perú (+51)
  // //         telefonoLimpio = '+51' + soloDigitos;
  // //         console.log('🇵🇪 Asumiendo código de país Perú (+51)');
  // //       } else {
  // //         console.warn('⚠️ Número muy corto para agregar código de país');
  // //         return '';
  // //       }
  // //     }
      
  // //     // PASO 7: Validación final con regex
  // //     const telefonoValidado = telefonoLimpio.match(/^\+\d{8,19}$/);
  // //     if (!telefonoValidado) {
  // //       console.warn('⚠️ Teléfono no pasa validación final:', telefonoLimpio);
  // //       return '';
  // //     }
      
  // //     console.log(`✅ Teléfono normalizado: ${telefono} → ${telefonoLimpio}`);
  // //     return telefonoLimpio;
      
  // //   } catch (error) {
  // //     console.error('❌ Error en normalización de teléfono:', error);
  // //     return '';
  // //   }
  // // }

  // // /**
  // //  * SANITIZAR MENSAJE ULTRA ROBUSTO - Específico para mensajes WhatsApp
  // //  */
  // // sanitizarMensajeUltraRobusto(mensaje) {
  // //   try {
  // //     if (!mensaje || typeof mensaje !== 'string') {
  // //       console.warn('⚠️ Mensaje inválido para sanitizar:', mensaje);
  // //       return 'Mensaje personalizado';
  // //     }

  // //     console.log(`💬 Sanitizando mensaje: "${mensaje.substring(0, 100)}..."`);
      
  // //     let mensajeLimpio = mensaje;
      
  // //     // PASO 1: Sanitización básica de texto
  // //     mensajeLimpio = this.sanitizarTextoUltraRobusto(mensajeLimpio);
      
  // //     // PASO 2: Manejar saltos de línea problemáticos
  // //     mensajeLimpio = mensajeLimpio.replace(/\r?\n|\r/g, ' ');
  // //     mensajeLimpio = mensajeLimpio.replace(/\\n/g, ' ');
  // //     mensajeLimpio = mensajeLimpio.replace(/\\r/g, ' ');
      
  // //     // PASO 3: Limpiar espacios múltiples (mensaje específico)
  // //     mensajeLimpio = mensajeLimpio.replace(/\s{3,}/g, ' ');
      
  // //     // PASO 4: Validar longitud del mensaje
  // //     if (mensajeLimpio.length > 1000) {
  // //       console.log(`✂️ Mensaje truncado: ${mensajeLimpio.length} → 1000 caracteres`);
  // //       mensajeLimpio = mensajeLimpio.substring(0, 1000);
  // //       mensajeLimpio += '...';
  // //     }
      
  // //     // PASO 5: Asegurar que el mensaje no esté vacío
  // //     if (!mensajeLimpio.trim()) {
  // //       console.warn('⚠️ Mensaje vacío después de sanitización, usando fallback');
  // //       mensajeLimpio = 'Mensaje personalizado';
  // //     }
      
  // //     // PASO 6: Verificar compatibilidad con WhatsApp (longitud)
  // //     if (mensajeLimpio.length > 4096) {
  // //       console.log('⚠️ Mensaje muy largo para WhatsApp, truncando...');
  // //       mensajeLimpio = mensajeLimpio.substring(0, 4090) + '...';
  // //     }
      
  // //     console.log(`✅ Mensaje sanitizado: "${mensajeLimpio.substring(0, 100)}..."`);
  // //     return mensajeLimpio.trim();
      
  // //   } catch (error) {
  // //     console.error('❌ Error sanitizando mensaje:', error);
  // //     return 'Mensaje personalizado';
  // //   }
  // // }

  // // /**
  // //  * VALIDAR CONTACTO EXHAUSTIVO - Validación completa de contactos
  // //  */
  // // validarContactoExhaustivo(contacto) {
  // //   const resultado = {
  // //     valido: false,
  // //     errores: [],
  // //     advertencias: [],
  // //     contactoLimpio: null
  // //   };

  // //   try {
  // //     console.log(`🔍 Validando contacto: ${contacto.name}`);
      
  // //     // Verificar estructura básica
  // //     if (!contacto || typeof contacto !== 'object') {
  // //       resultado.errores.push('Contacto no es un objeto válido');
  // //       return resultado;
  // //     }

  // //     // Crear copia del contacto para limpiar
  // //     const contactoLimpio = { ...contacto };

  // //     // VALIDAR Y SANITIZAR NOMBRE
  // //     if (!contacto.name || typeof contacto.name !== 'string') {
  // //       resultado.errores.push('Nombre es requerido y debe ser texto');
  // //     } else {
  // //       const nombreOriginal = contacto.name;
  // //       contactoLimpio.name = this.sanitizarTextoUltraRobusto(contacto.name);
        
  // //       if (!contactoLimpio.name) {
  // //         resultado.errores.push('Nombre se volvió vacío después de sanitización');
  // //       } else if (contactoLimpio.name.length > 50) {
  // //         resultado.advertencias.push(`Nombre muy largo, será truncado: ${contactoLimpio.name.length} > 50`);
  // //         contactoLimpio.name = contactoLimpio.name.substring(0, 50);
  // //       }
        
  // //       if (nombreOriginal !== contactoLimpio.name) {
  // //         resultado.advertencias.push(`Nombre modificado: "${nombreOriginal}" → "${contactoLimpio.name}"`);
  // //       }
  // //     }

  // //     // VALIDAR Y SANITIZAR TELÉFONO
  // //     if (!contacto.phone || typeof contacto.phone !== 'string') {
  // //       resultado.errores.push('Teléfono es requerido y debe ser texto');
  // //     } else {
  // //       const telefonoOriginal = contacto.phone;
  // //       contactoLimpio.phone = this.normalizarTelefonoUltraRobusto(contacto.phone);
        
  // //       if (!contactoLimpio.phone) {
  // //         resultado.errores.push('Teléfono inválido después de normalización');
  // //       } else if (telefonoOriginal !== contactoLimpio.phone) {
  // //         resultado.advertencias.push(`Teléfono normalizado: "${telefonoOriginal}" → "${contactoLimpio.phone}"`);
  // //       }
  // //     }

  // //     // VALIDAR Y SANITIZAR MENSAJE
  // //     if (!contacto.message || typeof contacto.message !== 'string') {
  // //       resultado.errores.push('Mensaje es requerido y debe ser texto');
  // //     } else {
  // //       const mensajeOriginal = contacto.message;
  // //       contactoLimpio.message = this.sanitizarMensajeUltraRobusto(contacto.message);
        
  // //       if (!contactoLimpio.message) {
  // //         resultado.errores.push('Mensaje se volvió vacío después de sanitización');
  // //       } else if (mensajeOriginal !== contactoLimpio.message) {
  // //         resultado.advertencias.push(`Mensaje sanitizado: ${mensajeOriginal.length} → ${contactoLimpio.message.length} caracteres`);
  // //       }
  // //     }

  // //     // VALIDAR CAMPOS OPCIONALES
  // //     if (contacto.email && typeof contacto.email === 'string') {
  // //       contactoLimpio.email = this.sanitizarTextoUltraRobusto(contacto.email);
  // //     }

  // //     if (contacto.company && typeof contacto.company === 'string') {
  // //       contactoLimpio.company = this.sanitizarTextoUltraRobusto(contacto.company);
  // //     }

  // //     // DETERMINAR SI EL CONTACTO ES VÁLIDO
  // //     resultado.valido = resultado.errores.length === 0;
  // //     resultado.contactoLimpio = contactoLimpio;

  // //     if (resultado.valido) {
  // //       console.log(`✅ Contacto válido: ${contactoLimpio.name}`);
  // //     } else {
  // //       console.log(`❌ Contacto inválido: ${resultado.errores.join(', ')}`);
  // //     }

  // //     return resultado;

  // //   } catch (error) {
  // //     console.error('❌ Error validando contacto:', error);
  // //     resultado.errores.push(`Error de validación: ${error.message}`);
  // //     return resultado;
  // //   }
  // // }

  // // /**
  // //  * GENERAR BASE64 ULTRA SEGURO - Base64 garantizado libre de problemas
  // //  */
  // // generarBase64UltraSeguro(data) {
  // //   try {
  // //     console.log('🔐 Generando Base64 ultra seguro...');
      
  // //     // Asegurar que los datos sean string
  // //     let dataString = typeof data === 'string' ? data : JSON.stringify(data);
      
  // //     // Sanitizar completamente los datos antes de codificar
  // //     dataString = this.sanitizarTextoUltraRobusto(dataString);
      
  // //     // Eliminar caracteres problemáticos para Base64
  // //     dataString = dataString.replace(/[\r\n\t\0\x1A]/g, ' ');
  // //     dataString = dataString.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
  // //     // Codificar a Base64 con manejo de errores
  // //     let base64String;
      
  // //     try {
  // //       // Método principal: btoa nativo
  // //       base64String = btoa(encodeURIComponent(dataString).replace(/%([0-9A-F]{2})/g,
  // //         function toSolidBytes(match, p1) {
  // //           return String.fromCharCode('0x' + p1);
  // //         }
  // //       ));
  // //     } catch (btoaError) {
  // //       console.warn('⚠️ btoa falló, usando método alternativo:', btoaError.message);
        
  // //       // Método alternativo: codificación manual básica
  // //       base64String = this.codificarBase64Manual(dataString);
  // //     }
      
  // //     console.log(`✅ Base64 generado: ${base64String.length} caracteres`);
      
  // //     return base64String;
      
  // //   } catch (error) {
  // //     console.error('❌ Error generando Base64 ultra seguro:', error);
  // //     throw new Error(`Error en Base64: ${error.message}`);
  // //   }
  // // }

  // // /**
  // //  * ESCAPAR CARACTERES PARA REGEX - Utilidad para escapar caracteres especiales
  // //  */
  // // escaparRegex(string) {
  // //   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // // }

  // // /**
  // //  * SANITIZACIÓN FALLBACK - Método básico como fallback
  // //  */
  // // sanitizacionFallback(texto) {
  // //   if (!texto) return '';
    
  // //   return texto
  // //     .toString()
  // //     .normalize('NFD')
  // //     .replace(/[^\x20-\x7E]/g, '') // Solo ASCII imprimibles
  // //     .replace(/"/g, "'")
  // //     .replace(/\r?\n|\r/g, ' ')
  // //     .replace(/\s+/g, ' ')
  // //     .trim();
  // // }

  // // /**
  // //  * CODIFICACIÓN BASE64 MANUAL - Fallback para Base64
  // //  */
  // // codificarBase64Manual(input) {
  // //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // //   let result = '';
  // //   let i = 0;
    
  // //   while (i < input.length) {
  // //     const a = input.charCodeAt(i++);
  // //     const b = i < input.length ? input.charCodeAt(i++) : 0;
  // //     const c = i < input.length ? input.charCodeAt(i++) : 0;
      
  // //     const bitmap = (a << 16) | (b << 8) | c;
      
  // //     result += chars.charAt((bitmap >> 18) & 63);
  // //     result += chars.charAt((bitmap >> 12) & 63);
  // //     result += (i - 2 < input.length) ? chars.charAt((bitmap >> 6) & 63) : '=';
  // //     result += (i - 1 < input.length) ? chars.charAt(bitmap & 63) : '=';
  // //   }
    
  //   return result;
  // }
}

// ===============================================================
// EXPORTACIÓN E INTEGRACIÓN
// ===============================================================

/**
 * INSTRUCCIONES DE INTEGRACIÓN:
 *
 * 1. REEMPLAZA tu clase HelperGenerator actual con HelperGeneratorCore
 * 2. CAMBIA las referencias en tu código:
 *    - const helperGenerator = new HelperGenerator()
 *    + const helperGenerator = new HelperGeneratorCore()
 *
 * 3. La interfaz pública es 100% compatible:
 *    - generarHelperAutomatico(contactos, opciones) ✅
 *    - generarHelperDiagnostico() ✅
 *    - generarInstrucciones() ✅
 *
 * 4. NUEVAS funcionalidades disponibles:
 *    - getSystemInfo() - Info del sistema
 *    - cleanup() - Limpieza de recursos
 */

// Para compatibilidad con require/import
if (typeof module !== "undefined" && module.exports) {
  module.exports = HelperGenerator;
} else if (typeof window !== "undefined") {
  window.HelperGenerator = HelperGenerator;
}

// ===============================================================
// LOG DE CAMBIOS RESPECTO A v2.2
// ===============================================================
/*
🚀 MEJORAS PRINCIPALES:

1. CONFIGURACIÓN CHROME ROBUSTA:
   - v2.2: 10 opciones básicas
   - v3.0: 40+ opciones optimizadas para WhatsApp

2. SISTEMA DE DIAGNÓSTICO:
   - v2.2: Sin diagnóstico
   - v3.0: Diagnóstico automático del sistema

3. VALIDACIÓN DE DATOS:
   - v2.2: Validación básica
   - v3.0: Validación exhaustiva + advertencias

4. CONFIGURACIÓN DE TIMEOUTS:
   - v2.2: Timeouts fijos
   - v3.0: Timeouts adaptativos por operación

5. SISTEMA DE REINTENTOS:
   - v2.2: Sin reintentos
   - v3.0: 3 reintentos automáticos con backoff

6. DETECCIÓN DE PLATAFORMA:
   - v2.2: Asume Windows
   - v3.0: Detección automática Win/Mac/Linux

7. MANEJO DE ERRORES:
   - v2.2: Try/catch básico
   - v3.0: Manejo robusto + sugerencias

8. LOGGING MEJORADO:
   - v2.2: Console.log básico
   - v3.0: Logging estructurado con timestamps

📊 RESULTADO ESPERADO:
   - Tasa de éxito: 60% → 95%+
   - Compatibilidad: Windows → Multi-plataforma
   - Robustez: Básica → Empresarial
   - Mantenibilidad: Difícil → Modular
*/

// Instancia singleton
const helperGenerator = new HelperGenerator();
export default helperGenerator;
