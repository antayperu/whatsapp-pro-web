// ===============================================================
// PythonExecutor.js - COMUNICACIÓN TIEMPO REAL CORREGIDA
// ===============================================================
// CORREGIDO: Lee archivos JSON en lugar de localStorage
// FUNCIONA: Con el Python que escribe archivos whatsapp_progreso.json

class PythonExecutor {
  constructor() {
    this.version = '1.0';
    this.procesoActivo = false;
    this.procesoPausado = false;
    this.contactosTotal = 0;
    this.contactosEnviados = 0;
    this.contactosFallidos = 0;
    this.tiempoInicio = null;
    
    // Callbacks para la interfaz web
    this.onProgresoCallback = null;
    this.onLogCallback = null;
    this.onEstadoCallback = null;
    this.onCompletadoCallback = null;
    
    // Control de archivos de comunicación
    this.archivoProgreso = 'whatsapp_progreso.json';
    this.archivoControl = 'whatsapp_control.json';
    this.archivoLogs = 'whatsapp_logs.json';
    
    // Intervalo de monitoreo
    this.intervalMonitoreo = null;
    
    console.log('🚀 PythonExecutor v1.0 inicializado para comunicación con archivos');
  }

  /**
   * MÉTODO PRINCIPAL: Ejecutar proceso Python con comunicación tiempo real
   */
  async ejecutarConComunicacion(contactos, configuracion = {}) {
    try {
      console.log('🎯 Iniciando ejecución con comunicación tiempo real...');
      
      if (!contactos || contactos.length === 0) {
        throw new Error('No hay contactos para enviar');
      }
      
      this.contactosTotal = contactos.length;
      this.contactosEnviados = 0;
      this.contactosFallidos = 0;
      this.tiempoInicio = Date.now();
      
      // Preparar archivos de comunicación
      await this.prepararComunicacion();
      
      // Generar código Python con comunicación
      const pythonConComunicacion = this.generarPythonConComunicacion(contactos, configuracion);
      
      // Crear archivo .BAT con comunicación
      const batConComunicacion = this.crearBatConComunicacion(pythonConComunicacion);
      
      // Descargar archivo .BAT mejorado
      this.descargarArchivo(batConComunicacion.contenido, batConComunicacion.nombre);
      
      // Iniciar monitoreo en tiempo real
      this.iniciarMonitoreoTiempoReal();
      
      // Notificar a la interfaz
      this.notificarEstado('🚀 Archivo .BAT generado. Ejecuta el archivo descargado para iniciar.');
      
      return {
        success: true,
        message: 'Ejecutor preparado. Ejecuta el archivo .BAT descargado.',
        archivo: batConComunicacion.nombre,
        contactos: this.contactosTotal
      };
      
    } catch (error) {
      console.error('❌ Error en ejecutarConComunicacion:', error);
      this.notificarEstado('❌ Error: ' + error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * PREPARAR COMUNICACIÓN: Crear archivos de comunicación iniciales
   */
  async prepararComunicacion() {
    console.log('📁 Preparando archivos de comunicación...');
    
    // Archivo de control inicial
    const controlInicial = {
      comando: 'ejecutar',
      velocidad: 'normal',
      ultimaActualizacion: new Date().toISOString()
    };
    
    // Escribir archivo de control inicial
    this.escribirArchivoControl(controlInicial);
    
    console.log('✅ Archivos de comunicación preparados');
  }

  /**
   * GENERAR PYTHON CON COMUNICACIÓN: Código Python que comunica progreso
   */
  generarPythonConComunicacion(contactos, config) {
    console.log('🐍 Generando código Python con comunicación tiempo real...');
    
    const configuracion = {
      velocidad: config.velocidad || 'normal',
      reintentos: 3,
      timeout: 30,
      ...config
    };
    
    const pythonCode = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 WhatsApp Pro Sender - Versión con Comunicación Tiempo Real
💼 Optimizado para emprendedores - Feedback inmediato
⚡ Genera progreso en vivo para la interfaz web
"""

import json
import time
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import urllib.parse
import base64

class WhatsAppSenderComunicacion:
    def __init__(self):
        self.driver = None
        self.archivo_progreso = "whatsapp_progreso.json"
        self.archivo_control = "whatsapp_control.json" 
        self.archivo_logs = "whatsapp_logs.json"
        self.contactos_enviados = 0
        self.contactos_fallidos = 0
        self.total_contactos = 0
        
    def escribir_progreso(self, estado, contacto_actual=""):
        """Escribir progreso para que la web lo lea"""
        try:
            porcentaje = (self.contactos_enviados / self.total_contactos * 100) if self.total_contactos > 0 else 0
            
            progreso = {
                "total": self.total_contactos,
                "enviados": self.contactos_enviados,
                "fallidos": self.contactos_fallidos,
                "porcentaje": round(porcentaje, 1),
                "estado": estado,
                "contactoActual": contacto_actual,
                "ultimaActualizacion": datetime.now().isoformat()
            }
            
            with open(self.archivo_progreso, 'w', encoding='utf-8') as f:
                json.dump(progreso, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"Error escribiendo progreso: {e}")
    
    def escribir_log(self, mensaje, tipo="info"):
        """Escribir log para que la web lo lea"""
        try:
            logs_data = {"logs": []}
            if os.path.exists(self.archivo_logs):
                with open(self.archivo_logs, 'r', encoding='utf-8') as f:
                    logs_data = json.load(f)
            
            nuevo_log = {
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "mensaje": mensaje,
                "tipo": tipo
            }
            
            logs_data["logs"].append(nuevo_log)
            logs_data["ultimaActualizacion"] = datetime.now().isoformat()
            
            if len(logs_data["logs"]) > 50:
                logs_data["logs"] = logs_data["logs"][-50:]
            
            with open(self.archivo_logs, 'w', encoding='utf-8') as f:
                json.dump(logs_data, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"Error escribiendo log: {e}")
    
    def leer_comando_control(self):
        """Leer comando de control desde la web"""
        try:
            if os.path.exists(self.archivo_control):
                with open(self.archivo_control, 'r', encoding='utf-8') as f:
                    control = json.load(f)
                    return control.get("comando", "ejecutar")
        except Exception as e:
            print(f"Error leyendo control: {e}")
        return "ejecutar"
    
    def configurar_chrome(self):
        """Configurar Chrome para máxima compatibilidad"""
        chrome_options = Options()
        
        configuraciones = [
            "--headless",
            "--disable-blink-features=AutomationControlled",
            "--disable-extensions",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--remote-debugging-port=9222",
            "--user-data-dir=chrome_whatsapp_data",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-features=TranslateUI",
            "--disable-ipc-flooding-protection",
            "--window-size=1920,1080"
        ]
        
        for config in configuraciones:
            chrome_options.add_argument(config)
        
        prefs = {
            "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_settings.popups": 0,
            "profile.managed_default_content_settings.images": 2
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        self.escribir_log("🔧 Configurando Chrome para WhatsApp...", "info")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.set_page_load_timeout(30)
            self.escribir_log("✅ Chrome configurado correctamente", "success")
            return True
        except Exception as e:
            self.escribir_log(f"❌ Error configurando Chrome: {e}", "error")
            return False
    
    def cerrar_popups_whatsapp(self):
        """Cerrar todos los popups de WhatsApp automáticamente"""
        popups_selectores = [
            "//div[contains(text(), 'Permitir notificaciones')]//parent::*//button",
            "//button[contains(text(), 'No mostrar de nuevo')]",
            "//button[contains(text(), 'Continuar al chat')]",
            "//div[@role='button'][contains(text(), 'Aceptar')]",
            "//button[contains(text(), 'Aceptar')]",
            "//button[contains(text(), 'OK')]",
            "//div[@role='button'][contains(text(), 'Entendido')]"
        ]
        
        for selector in popups_selectores:
            try:
                elemento = WebDriverWait(self.driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                elemento.click()
                time.sleep(1)
                self.escribir_log("✅ Popup cerrado automáticamente", "info")
            except:
                continue
    
    def enviar_mensaje_contacto(self, contacto):
        """Enviar mensaje a un contacto específico"""
        try:
            nombre = contacto.get('nombre', 'Sin nombre')
            telefono = contacto.get('telefono', '')
            mensaje = contacto.get('mensaje', '')
            
            if not telefono or not mensaje:
                self.escribir_log(f"❌ Datos incompletos para {nombre}", "error")
                return False
            
            telefono_limpio = ''.join(filter(str.isdigit, telefono))
            if not telefono_limpio.startswith('51'):
                telefono_limpio = '51' + telefono_limpio
            
            mensaje_encoded = urllib.parse.quote(mensaje)
            url = f"https://web.whatsapp.com/send?phone={telefono_limpio}&text={mensaje_encoded}"
            
            self.escribir_progreso(f"Enviando a {nombre}...", nombre)
            self.escribir_log(f"📱 Enviando mensaje a {nombre} ({telefono})", "info")
            
            self.driver.get(url)
            time.sleep(3)
            
            self.cerrar_popups_whatsapp()
            
            comando = self.leer_comando_control()
            if comando == "pausar":
                self.escribir_log("⏸️ Proceso pausado por el usuario", "warning")
                while self.leer_comando_control() == "pausar":
                    time.sleep(2)
                self.escribir_log("▶️ Proceso reanudado", "info")
            elif comando == "detener":
                self.escribir_log("🛑 Proceso detenido por el usuario", "warning")
                return False
            
            try:
                boton_enviar = WebDriverWait(self.driver, 15).until(
                    EC.element_to_be_clickable((By.XPATH, "//span[@data-icon='send']"))
                )
                boton_enviar.click()
                time.sleep(${configuracion.velocidad === 'lenta' ? '5' : configuracion.velocidad === 'rapida' ? '2' : '3'})
                
                self.contactos_enviados += 1
                self.escribir_log(f"✅ Mensaje enviado a {nombre}", "success")
                return True
                
            except TimeoutException:
                self.escribir_log(f"❌ No se pudo enviar a {nombre} - Timeout", "error")
                self.contactos_fallidos += 1
                return False
                
        except Exception as e:
            self.escribir_log(f"❌ Error enviando a {nombre}: {e}", "error")
            self.contactos_fallidos += 1
            return False
    
    def ejecutar_envio(self, contactos):
        """Ejecutar envío masivo con comunicación"""
        self.total_contactos = len(contactos)
        
        print("🚀 WhatsApp Pro Sender - Iniciando envío masivo...")
        self.escribir_log("🚀 Iniciando WhatsApp Pro Sender", "info")
        self.escribir_progreso("Configurando Chrome...")
        
        if not self.configurar_chrome():
            self.escribir_progreso("❌ Error configurando Chrome")
            return False
        
        try:
            self.escribir_progreso("Conectando a WhatsApp Web...")
            self.escribir_log("🌐 Conectando a WhatsApp Web...", "info")
            self.driver.get("https://web.whatsapp.com")
            
            self.escribir_log("📱 Escanea el código QR para continuar", "info")
            self.escribir_progreso("Esperando escaneo QR...")
            
            try:
                qr_element = WebDriverWait(self.driver, 30).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@data-testid='qrcode']"))
                )
                
                self.escribir_log("📷 Capturando código QR...", "info")
                qr_element.screenshot('whatsapp_qr.png')
                self.escribir_log("✅ Código QR guardado como whatsapp_qr.png. Escanéalo para continuar.", "success")
                self.escribir_progreso("QR Guardado. Escanéalo para continuar.")

                WebDriverWait(self.driver, 120).until(
                    EC.presence_of_element_located((By.XPATH, "//div[@contenteditable='true'][@data-tab='3']"))
                )
            except TimeoutException:
                self.escribir_log("❌ No se detectó código QR o se tardó mucho en escanear.", "error")
                self.escribir_progreso("❌ Error con código QR")
                raise
            
            self.escribir_log("✅ WhatsApp Web conectado correctamente", "success")
            self.escribir_progreso("Iniciando envío de mensajes...")
            
            for i, contacto in enumerate(contactos, 1):
                self.escribir_progreso(f"Procesando contacto {i} de {self.total_contactos}...")
                
                comando = self.leer_comando_control()
                if comando == "detener":
                    self.escribir_log("🛑 Envío detenido por el usuario", "warning")
                    break
                
                self.enviar_mensaje_contacto(contacto)
                time.sleep(2)
            
            self.escribir_progreso("✅ Envío completado")
            self.escribir_log(f"📊 Resumen: {self.contactos_enviados} enviados, {self.contactos_fallidos} fallidos", "info")
            
            return True
            
        except Exception as e:
            self.escribir_log(f"❌ Error durante el envío: {e}", "error")
            self.escribir_progreso(f"❌ Error: {e}")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()
                self.escribir_log("🔚 Navegador cerrado", "info")

# Datos de contactos generados desde la web
contactos = ${JSON.stringify(contactos, null, 2)}

if __name__ == "__main__":
    sender = WhatsAppSenderComunicacion()
    try:
        sender.ejecutar_envio(contactos)
    except KeyboardInterrupt:
        print("\\n🛑 Envío interrumpido por el usuario")
        sender.escribir_log("🛑 Envío interrumpido manualmente", "warning")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        sender.escribir_log(f"❌ Error inesperado: {e}", "error")
`;

    console.log('✅ Código Python con comunicación generado');
    return pythonCode;
  }

  /**
   * CREAR BAT CON COMUNICACIÓN: Archivo .BAT que maneja comunicación
   */
  crearBatConComunicacion(pythonCode) {
    console.log('📄 Creando archivo .BAT con comunicación...');
    
    const nombreArchivo = `WhatsApp_Sender_${new Date().toISOString().split('T')[0]}.bat`;
    
    const batContent = `@echo off
chcp 65001 > nul
title WhatsApp Pro Sender - Con Comunicación Tiempo Real
color 0A

echo.
echo ================================================================
echo    🚀 WhatsApp Pro Sender - Versión Emprendedores
echo    ⚡ Con comunicación tiempo real a la web
echo ================================================================
echo.

REM Crear archivo Python temporal
echo 📝 Preparando código Python...
(
echo.${pythonCode.replace(/\n/g, '\necho.')}
) > whatsapp_sender_temp.py

echo.
echo ✅ Código Python preparado
echo 🔧 Instalando dependencias necesarias...
echo.

REM Instalar dependencias si no existen
pip install selenium webdriver-manager requests urllib3 --quiet --disable-pip-version-check

echo.
echo 🚀 Iniciando WhatsApp Sender...
echo 📱 La interfaz web mostrará el progreso en tiempo real
echo.

REM Ejecutar Python
python whatsapp_sender_temp.py

echo.
echo ✅ Proceso completado
echo 📊 Revisa los resultados en la interfaz web
echo.
pause

REM Limpiar archivos temporales
del whatsapp_sender_temp.py 2>nul
`;

    return {
      contenido: batContent,
      nombre: nombreArchivo
    };
  }

  /**
   * INICIAR MONITOREO TIEMPO REAL: CORREGIDO - Lee archivos JSON
   */
  iniciarMonitoreoTiempoReal() {
    console.log('👀 Iniciando monitoreo tiempo real...');
    
    if (this.intervalMonitoreo) {
      clearInterval(this.intervalMonitoreo);
    }
    
    this.procesoActivo = true;
    
    this.intervalMonitoreo = setInterval(() => {
      this.leerProgresoYActualizar();
    }, 1000);
    
    this.notificarEstado('👀 Monitoreo tiempo real activo');
  }

  /**
   * FUNCIÓN CORREGIDA: Lee archivos JSON en lugar de localStorage
   */
  async leerProgresoYActualizar() {
    try {
      // Leer progreso desde archivo JSON
      try {
        const response = await fetch('./whatsapp_progreso.json?t=' + Date.now());
        const progreso = await response.json();
        
        this.contactosEnviados = progreso.enviados || 0;
        this.contactosFallidos = progreso.fallidos || 0;
        
        if (this.onProgresoCallback) {
          this.onProgresoCallback({
            total: progreso.total,
            enviados: progreso.enviados,
            fallidos: progreso.fallidos,
            porcentaje: progreso.porcentaje,
            contactoActual: progreso.contactoActual,
            estado: progreso.estado
          });
        }
      } catch (error) {
        // Archivo no existe aún, es normal al inicio
      }
      
      // Leer logs desde archivo JSON
      try {
        const responseLog = await fetch('./whatsapp_logs.json?t=' + Date.now());
        const logs = await responseLog.json();
        
        if (this.onLogCallback && logs.logs) {
          // Solo enviar logs nuevos
          logs.logs.forEach(log => {
            this.onLogCallback(log.mensaje, log.tipo, log.timestamp);
          });
        }
      } catch (error) {
        // Archivo no existe aún, es normal al inicio
      }
      
    } catch (error) {
      console.error('Error leyendo archivos de progreso:', error);
    }
  }

  /**
   * CONTROL DE PROCESO: Pausar, reanudar, detener
   */
  pausarProceso() {
    console.log('⏸️ Pausando proceso...');
    this.procesoPausado = true;
    this.escribirComando('pausar');
    this.notificarEstado('⏸️ Proceso pausado');
  }

  reanudarProceso() {
    console.log('▶️ Reanudando proceso...');
    this.procesoPausado = false;
    this.escribirComando('ejecutar');
    this.notificarEstado('▶️ Proceso reanudado');
  }

  detenerProceso() {
    console.log('🛑 Deteniendo proceso...');
    this.procesoActivo = false;
    this.escribirComando('detener');
    this.notificarEstado('🛑 Proceso detenido');
    
    if (this.intervalMonitoreo) {
      clearInterval(this.intervalMonitoreo);
      this.intervalMonitoreo = null;
    }
  }

  /**
   * ESCRIBIR COMANDO: Enviar comando a Python mediante archivo JSON
   */
  async escribirComando(comando) {
    try {
      const control = {
        comando: comando,
        ultimaActualizacion: new Date().toISOString()
      };
      
      // Escribir archivo de control
      const blob = new Blob([JSON.stringify(control, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'whatsapp_control.json';
      link.click();
      URL.revokeObjectURL(url);
      
      console.log(`📝 Comando enviado: ${comando}`);
      
    } catch (error) {
      console.error('Error escribiendo comando:', error);
    }
  }

  /**
   * ESCRIBIR ARCHIVO CONTROL: Para comandos iniciales
   */
  escribirArchivoControl(datos) {
    try {
      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
      // Este archivo se usará para control inicial
    } catch (error) {
      console.error('Error preparando archivo de control:', error);
    }
  }

  /**
   * CALLBACKS: Configurar callbacks para la interfaz
   */
  onProgreso(callback) {
    this.onProgresoCallback = callback;
  }

  onLog(callback) {
    this.onLogCallback = callback;
  }

  onEstado(callback) {
    this.onEstadoCallback = callback;
  }

  onCompletado(callback) {
    this.onCompletadoCallback = callback;
  }

  /**
   * NOTIFICAR ESTADO: Notificar cambios de estado
   */
  notificarEstado(mensaje) {
    console.log(`📢 Estado: ${mensaje}`);
    if (this.onEstadoCallback) {
      this.onEstadoCallback(mensaje);
    }
  }

  /**
   * DESCARGAR ARCHIVO: Descargar .BAT mejorado
   */
  descargarArchivo(contenido, nombreArchivo) {
    try {
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`💾 Archivo descargado: ${nombreArchivo}`);
      this.notificarEstado(`💾 Archivo ${nombreArchivo} descargado correctamente`);
      
    } catch (error) {
      console.error('Error descargando archivo:', error);
      this.notificarEstado('❌ Error descargando archivo');
    }
  }

  /**
   * OBTENER ESTADÍSTICAS: Para mostrar en la interfaz
   */
  obtenerEstadisticas() {
    const tiempoTranscurrido = this.tiempoInicio ? Date.now() - this.tiempoInicio : 0;
    const minutos = Math.floor(tiempoTranscurrido / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);
    
    return {
      procesoActivo: this.procesoActivo,
      procesoPausado: this.procesoPausado,
      contactosTotal: this.contactosTotal,
      contactosEnviados: this.contactosEnviados,
      contactosFallidos: this.contactosFallidos,
      porcentajeCompletado: this.contactosTotal > 0 ? 
        Math.round((this.contactosEnviados / this.contactosTotal) * 100) : 0,
      tiempoTranscurrido: `${minutos}:${segundos.toString().padStart(2, '0')}`,
      tiempoTranscurridoMs: tiempoTranscurrido
    };
  }

  /**
   * CLEANUP: Limpiar recursos
   */
  cleanup() {
    if (this.intervalMonitoreo) {
      clearInterval(this.intervalMonitoreo);
      this.intervalMonitoreo = null;
    }
    
    this.procesoActivo = false;
    this.procesoPausado = false;
    
    console.log('🧹 Recursos limpiados');
  }
}

// Instancia singleton para uso inmediato
const pythonExecutor = new PythonExecutor();

export default pythonExecutor;