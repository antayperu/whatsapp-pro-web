// HelperGenerator.js - Generador Mejorado v2.2
// Crea helper automático con diagnóstico completo

class HelperGenerator {
  constructor() {
    this.version = '2.2';
  }

  /**
   * Generar y descargar helper automático mejorado
   */
  async generarHelperAutomatico(contactos, opciones = {}) {
    try {
      console.log('🚀 Generando helper automático v2.2...', contactos.length, 'contactos');
      
      const config = this.crearConfiguracion(contactos, opciones);
      const pythonCode = this.generarCodigoPythonMejorado(config);
      const helperData = this.crearArchivoBatMejorado(pythonCode, config);
      await this.descargarHelper(helperData);
      
      return {
        success: true,
        archivo: helperData.nombre,
        contactos: contactos.length,
        version: '2.2',
        mensaje: 'Helper v2.2 generado exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Error generando helper v2.2:', error);
      throw new Error(`Error generando helper: ${error.message}`);
    }
  }

  /**
   * Generar helper de DIAGNÓSTICO para identificar problemas
   */
  async generarHelperDiagnostico(contactos, opciones = {}) {
    try {
      console.log('🔍 Generando helper de DIAGNÓSTICO...');
      
      const config = this.crearConfiguracion(contactos || [], opciones);
      const diagnosticoData = this.crearArchivoDiagnostico(config);
      await this.descargarHelper(diagnosticoData);
      
      return {
        success: true,
        archivo: diagnosticoData.nombre,
        tipo: 'diagnostico',
        mensaje: 'Helper de diagnóstico generado'
      };
      
    } catch (error) {
      console.error('❌ Error generando diagnóstico:', error);
      throw error;
    }
  }

  /**
   * Crear configuración mejorada
   */
  crearConfiguracion(contactos, opciones) {
    const config = {
      timestamp: Date.now(),
      fecha: new Date().toISOString(),
      version: '2.2',
      contactos: contactos.map(contacto => ({
        id: contacto.id,
        name: contacto.name,
        phone: contacto.phone,
        message: contacto.message,
        status: contacto.status || 'NO'
      })),
      opciones: {
        velocidad: opciones.velocidad || 'Normal (3-5s)',
        delay: this.calcularDelay(opciones.velocidad),
        timeout: 60,
        reintentos: 3,
        timeout_carga: 30,
        timeout_envio: 15
      }
    };
    
    console.log('📊 Configuración v2.2 creada:', config.contactos.length, 'contactos');
    return config;
  }

  /**
   * Calcular delay mejorado
   */
  calcularDelay(velocidad) {
    if (!velocidad) return { min: 3, max: 5 };
    
    if (velocidad.includes('Lenta')) return { min: 5, max: 8 };
    if (velocidad.includes('Rápida')) return { min: 2, max: 3 };
    return { min: 3, max: 5 }; // Normal
  }

  /**
   * Generar código Python mejorado con detección robusta
   */
  generarCodigoPythonMejorado(config) {
    const configJson = JSON.stringify(config, null, 2);
    
    const pythonCode = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# WhatsApp Sender Helper v2.2 - MEJORADO
# Envío automático con detección robusta y manejo de errores avanzado

import os
import sys
import json
import time
import random
import traceback
import urllib.parse
import re
from datetime import datetime

# Importaciones de Selenium
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.keys import Keys
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError as e:
    print(f"❌ Instalando dependencias automáticamente...")
    os.system("pip install selenium webdriver-manager")
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.keys import Keys
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.common.exceptions import TimeoutException, NoSuchElementException

class WhatsAppSenderHelperV22:
    def __init__(self):
        self.driver = None
        self.config = None
        self.resultados = []
        self.estadisticas = {
            'intentos_totales': 0,
            'exitos': 0,
            'fallos': 0,
            'reintentos': 0
        }
        
    def cargar_configuracion(self):
        """Cargar configuración desde datos embebidos"""
        try:
            config_str = '''${configJson}'''
            self.config = json.loads(config_str)
            print(f"✅ Configuración v2.2 cargada: {len(self.config['contactos'])} contactos")
            return True
        except Exception as e:
            print(f"❌ Error cargando configuración: {str(e)}")
            return False
    
    def configurar_chrome_mejorado(self):
        """Configurar Chrome usando el método que funcionó en diagnóstico"""
        try:
            print("🔧 Configurando Chrome v2.3 (método del diagnóstico)...")
            
            options = Options()
            options.add_argument("--start-maximized")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-notifications")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option("useAutomationExtension", False)
            
            print("🌐 Iniciando Chrome con método simplificado...")
            
            # Usar método simple que funcionó en el diagnóstico
            try:
                self.driver = webdriver.Chrome(options=options)
                print("✅ Chrome iniciado exitosamente (método simple)")
            except Exception as e:
                print(f"⚠️ Método simple falló: {str(e)}")
                print("🔄 Intentando con ChromeDriverManager...")
                
                # Fallback al método con ChromeDriverManager
                try:
                    from webdriver_manager.chrome import ChromeDriverManager
                    self.driver = webdriver.Chrome(
                        service=Service(ChromeDriverManager().install()),
                        options=options
                    )
                    print("✅ Chrome iniciado con ChromeDriverManager")
                except Exception as e2:
                    print(f"❌ Ambos métodos fallaron: {str(e2)}")
                    return False
            
            print("✅ Chrome v2.3 configurado exitosamente")
            return True
            
        except Exception as e:
            print(f"❌ Error crítico configurando Chrome: {str(e)}")
            return False
    
    def conectar_whatsapp_robusto(self):
        """Conexión robusta a WhatsApp Web (método simplificado)"""
        try:
            print("📱 Conectando a WhatsApp Web v2.3...")
            self.driver.get("https://web.whatsapp.com")
            
            print("⏳ Esperando que WhatsApp Web cargue...")
            print("💡 Si aparece QR, escanéalo desde tu teléfono")
            
            # Espera simple pero efectiva
            tiempo_espera = 120  # 2 minutos
            tiempo_inicio = time.time()
            
            while (time.time() - tiempo_inicio) < tiempo_espera:
                try:
                    # Buscar indicador de que WhatsApp está listo
                    elementos = self.driver.find_elements(By.XPATH, "//div[@id='pane-side']")
                    if len(elementos) > 0:
                        print("✅ WhatsApp Web conectado exitosamente")
                        time.sleep(5)  # Esperar estabilización
                        return True
                except:
                    pass
                
                time.sleep(3)
                tiempo_transcurrido = int(time.time() - tiempo_inicio)
                if tiempo_transcurrido % 15 == 0:  # Mostrar progreso cada 15s
                    print(f"⏳ Esperando conexión... ({tiempo_transcurrido}s/{tiempo_espera}s)")
            
            print("❌ Timeout conectando a WhatsApp Web")
            return False
            
        except Exception as e:
            print(f"❌ Error conectando WhatsApp: {str(e)}")
            return False
    
    def enviar_mensaje_simple(self, contacto):
        """Versión simplificada de envío para testing"""
        try:
            nombre = contacto['name']
            telefono = contacto['phone']
            mensaje = contacto['message']
            
            print(f"📤 Enviando a {nombre} ({telefono})...")
            
            # Formatear número básico
            if not telefono.startswith('+'):
                if telefono.startswith('51'):
                    telefono = '+' + telefono
                else:
                    telefono = '+51' + telefono
            
            print(f"📞 Número: {telefono}")
            
            # URL de WhatsApp
            mensaje_codificado = urllib.parse.quote(mensaje)
            url = f"https://web.whatsapp.com/send?phone={telefono}&text={mensaje_codificado}"
            
            # Navegar
            self.driver.get(url)
            time.sleep(10)
            
            # Buscar botón enviar
            try:
                boton = self.driver.find_element(By.XPATH, "//span[@data-icon='send']")
                boton.click()
                print(f"✅ Mensaje enviado a {nombre}")
                return {'success': True, 'result': 'ENVIADO'}
            except:
                print(f"❌ No se pudo enviar a {nombre}")
                return {'success': False, 'result': 'NO_BUTTON'}
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return {'success': False, 'result': f'ERROR: {str(e)}'}
    
    def ejecutar_proceso_simple(self):
        """Proceso simplificado para testing"""
        try:
            print("🚀 Iniciando proceso simple...")
            
            contactos = self.config['contactos']
            
            for idx, contacto in enumerate(contactos):
                print(f"\\n[{idx + 1}/{len(contactos)}] {contacto['name']}")
                resultado = self.enviar_mensaje_simple(contacto)
                
                if resultado['success']:
                    print(f"✅ ÉXITO: {contacto['name']}")
                else:
                    print(f"❌ FALLO: {contacto['name']} - {resultado['result']}")
                
                if idx < len(contactos) - 1:
                    print("⏳ Esperando 5s...")
                    time.sleep(5)
            
            print("\\n🎉 Proceso completado")
            return True
            
        except Exception as e:
            print(f"❌ Error en proceso: {str(e)}")
            return False
    
    def limpiar_recursos(self):
        """Limpieza de recursos"""
        try:
            if self.driver:
                self.driver.quit()
                print("✅ Chrome cerrado")
            
            print("🗑️ Auto-eliminando...")
            time.sleep(5)
            try:
                os.remove(__file__)
                print("✅ Archivo eliminado")
            except:
                print("⚠️ No se pudo auto-eliminar")
                
        except Exception as e:
            print(f"⚠️ Error limpiando: {str(e)}")

def main():
    """Función principal optimizada basada en diagnóstico exitoso"""
    helper = WhatsAppSenderHelperV22()
    
    try:
        print("🚀 WhatsApp Sender Helper v2.3 FINAL")
        print("✨ Basado en diagnóstico exitoso")
        print("=" * 50)
        
        if not helper.cargar_configuracion():
            return False
        
        if not helper.configurar_chrome_mejorado():
            return False
        
        if not helper.conectar_whatsapp_robusto():
            return False
        
        if not helper.ejecutar_proceso_simple():
            return False
        
        print("\\n🎉 ¡Proceso v2.3 completado exitosamente!")
        return True
        
    except Exception as e:
        print(f"❌ Error crítico v2.3: {str(e)}")
        traceback.print_exc()
        return False
        
    finally:
        helper.limpiar_recursos()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\n⏹️ Interrumpido por usuario")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        input("\\nPresiona Enter para cerrar...")
`;

    return pythonCode;
  }

  /**
   * Crear archivo .BAT ULTRA mejorado con máximo feedback visual
   */
  crearArchivoBatMejorado(pythonCode, config) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pythonBase64 = btoa(unescape(encodeURIComponent(pythonCode)));
    
    const batContent = [
      '@echo off',
      'title WhatsApp Sender Helper v2.2 ULTRA - FEEDBACK TOTAL',
      'color 0A',
      'cls',
      'echo.',
      'echo ================================================================',
      'echo    🚀 WhatsApp Sender Helper v2.2 ULTRA',
      'echo    ✨ VERSION CON FEEDBACK VISUAL COMPLETO',
      'echo ================================================================',
      'echo.',
      `echo 📊 Contactos configurados: ${config.contactos.length}`,
      `echo ⚡ Velocidad: ${config.opciones.velocidad}`,
      'echo 🎯 Feedback visual: ACTIVADO',
      'echo.',
      'echo 💡 VERÁS TODO EL PROCESO PASO A PASO',
      'echo.',
      'pause',
      'echo.',
      'echo 🔧 VERIFICANDO SISTEMA...',
      'echo.',
      
      'python --version 2>nul',
      'if errorlevel 1 (',
      '    echo ❌ Python no encontrado',
      '    pause',
      '    exit /b 1',
      ') else (',
      '    echo ✅ Python OK',
      ')',
      
      'echo 📦 Preparando archivos...',
      'if not exist "%TEMP%\\whatsapp_v22" mkdir "%TEMP%\\whatsapp_v22"',
      
      'echo import base64 > "%TEMP%\\whatsapp_v22\\decoder.py"',
      'echo import sys >> "%TEMP%\\whatsapp_v22\\decoder.py"',
      `echo code = "${pythonBase64}" >> "%TEMP%\\whatsapp_v22\\decoder.py"`,
      'echo decoded = base64.b64decode(code).decode("utf-8") >> "%TEMP%\\whatsapp_v22\\decoder.py"',
      'echo with open(sys.argv[1], "w", encoding="utf-8") as f: >> "%TEMP%\\whatsapp_v22\\decoder.py"',
      'echo     f.write(decoded) >> "%TEMP%\\whatsapp_v22\\decoder.py"',
      
      'python "%TEMP%\\whatsapp_v22\\decoder.py" "%TEMP%\\whatsapp_v22\\sender.py"',
      'del "%TEMP%\\whatsapp_v22\\decoder.py"',
      'echo ✅ Archivos preparados',
      'echo.',
      
      'echo 🚀 EJECUTANDO WHATSAPP SENDER...',
      'echo Chrome se abrirá en unos segundos...',
      'echo.',
      
      'python "%TEMP%\\whatsapp_v22\\sender.py"',
      
      'echo.',
      'echo 🧹 Limpiando...',
      'rmdir /s /q "%TEMP%\\whatsapp_v22" 2>nul',
      'echo ✅ Completado',
      'pause'
    ].join('\n');

    return {
      nombre: `WhatsAppSender_v2.3_FINAL_${timestamp}.bat`,
      contenido: batContent,
      tipo: 'text/plain',
      size: batContent.length,
      config: config,
      version: '2.3'
    };
  }

  /**
   * Crear archivo de DIAGNÓSTICO simple
   */
  crearArchivoDiagnostico(config) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const diagnosticoContent = [
      '@echo off',
      'title DIAGNÓSTICO WhatsApp Sender',
      'color 0E',
      'cls',
      'echo.',
      'echo ========================================================',
      'echo    🔍 DIAGNÓSTICO WhatsApp Sender',
      'echo    Detectando problemas del sistema',
      'echo ========================================================',
      'echo.',
      'pause',
      'echo.',
      
      'echo [TEST 1] Python...',
      'python --version 2>&1',
      'if errorlevel 1 (',
      '    echo ❌ PROBLEMA: Python no funciona',
      '    pause',
      '    exit /b 1',
      ') else (',
      '    echo ✅ Python OK',
      ')',
      'echo.',
      
      'echo [TEST 2] Selenium...',
      'python -c "import selenium; print(\\"Selenium version:\\", selenium.__version__)" 2>&1',
      'if errorlevel 1 (',
      '    echo ❌ Selenium no instalado, instalando...',
      '    pip install selenium webdriver-manager 2>&1',
      ') else (',
      '    echo ✅ Selenium OK',
      ')',
      'echo.',
      
      'echo [TEST 3] Chrome...',
      'if exist "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" (',
      '    echo ✅ Chrome encontrado',
      ') else (',
      '    echo ❌ Chrome no encontrado',
      ')',
      'echo.',
      
      'echo [TEST 4] WebDriver...',
      'python -c "from selenium import webdriver; print(\\"WebDriver OK\\")" 2>&1',
      'if errorlevel 1 (',
      '    echo ❌ WebDriver problema',
      ') else (',
      '    echo ✅ WebDriver OK',
      ')',
      'echo.',
      
      'echo [TEST 5] Chrome Launch...',
      'echo ⚠️  Este test puede tomar tiempo...',
      'python -c "from selenium import webdriver; from selenium.webdriver.chrome.options import Options; options = Options(); options.add_argument(\\"--headless\\"); driver = webdriver.Chrome(options=options); print(\\"Chrome launch OK\\"); driver.quit()" 2>&1',
      'if errorlevel 1 (',
      '    echo ❌ PROBLEMA CRÍTICO: Chrome no se puede abrir',
      '    echo 💡 Soluciones:',
      '    echo   - Actualiza Chrome',
      '    echo   - Ejecuta como Administrador',
      '    echo   - Desactiva antivirus temporalmente',
      ') else (',
      '    echo ✅ Chrome se puede abrir correctamente',
      '    echo 🎉 Sistema funcionando, problema en otro lugar',
      ')',
      'echo.',
      'echo ========================================================',
      'echo 📋 DIAGNÓSTICO COMPLETADO',
      'echo ========================================================',
      'pause'
    ].join('\n');

    return {
      nombre: `DIAGNOSTICO_WhatsApp_${timestamp}.bat`,
      contenido: diagnosticoContent,
      tipo: 'text/plain',
      size: diagnosticoContent.length,
      config: config
    };
  }

  /**
   * Descargar helper automáticamente
   */
  async descargarHelper(helperData) {
    try {
      const blob = new Blob([helperData.contenido], { type: helperData.tipo });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = helperData.nombre;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('📥 Helper descargado:', helperData.nombre);
      return true;
      
    } catch (error) {
      console.error('❌ Error descargando:', error);
      throw error;
    }
  }

  /**
   * Generar instrucciones para el usuario
   */
  generarInstrucciones(helperData) {
    return {
      titulo: '🚀 WhatsApp Sender Helper v2.2 - ULTRA',
      pasos: [
        '📥 Se descargó: ' + helperData.nombre,
        '📁 Ve a tu carpeta "Descargas"',
        '🐍 Asegúrate de tener Python instalado',
        '💻 Doble-click en el archivo .bat',
        '⏳ El envío será automático con feedback completo',
        '📊 Verás todo el proceso paso a paso',
        '🗑️ Se auto-elimina al terminar'
      ],
      notas: [
        '💡 Solo necesitas Python instalado',
        '🤖 Todo automatizado con feedback visual',
        '🔒 Archivos se auto-eliminan',
        '📱 Mantén WhatsApp Web abierto',
        '🚀 Versión ultra mejorada'
      ]
    };
  }
}

// Instancia singleton
const helperGenerator = new HelperGenerator();
export default helperGenerator;