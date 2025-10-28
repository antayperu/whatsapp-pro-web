#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# WhatsApp Sender Test v10 - Modo incognito para estabilidad

import time
import urllib.parse
import sys
import os
import random

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.keys import Keys
    from webdriver_manager.chrome import ChromeDriverManager
    selenium_disponible = True
    print("Selenium disponible - Modo automático activado")
except ImportError:
    selenium_disponible = False
    print("Selenium no disponible - Instala con: pip install selenium webdriver-manager")
    sys.exit(1)

# Contacto único para prueba
contactos = [
    {"name": "Camilo 1", "phone": "+51921566036", "message": "Hola, soy Mayra Alejandra Ortega Camacho, hija de Camilo Ortega "}
]

def configurar_chrome_optimizado():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
    
    # Modo incognito para replicar el éxito
    options.add_argument("--incognito")
    
    # Persistencia limitada (para incognito, usa un dir temporal)
    user_data_dir = os.path.join(os.getcwd(), "WhatsAppPrivateSession")
    os.makedirs(user_data_dir, exist_ok=True)
    options.add_argument(f"--user-data-dir={user_data_dir}")
    
    driver_path = ChromeDriverManager().install()
    service = Service(driver_path)
    return webdriver.Chrome(service=service, options=options)

def verificar_whatsapp_listo(driver, max_intentos=10):
    print("📱 Conectando a WhatsApp Web... Escanea el QR si aparece")
    for i in range(max_intentos):
        try:
            WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, "//div[@id='pane-side']")))
            print("✅ WhatsApp Web conectado exitosamente")
            return True
        except Exception as e:
            tiempo_transcurrido = (i+1)*10
            print(f"⏳ Cargando WhatsApp Web... {tiempo_transcurrido}s")
            if i == max_intentos - 1:
                print(f"❌ Fallo: La página no cargó. Verifica tu conexión o bloqueo de WhatsApp. Error: {str(e)}")
            time.sleep(10)
    return False

def esperar_chat_listo_inteligente(driver, max_tiempo=15):
    indicadores_listo = [
        "//span[@data-icon='send']",
        "//div[@contenteditable='true'][@data-tab='10']",
        "//footer//div[@contenteditable='true']",
        "//div[@aria-placeholder='Type a message']"
    ]
    
    tiempo_inicio = time.time()
    while time.time() - tiempo_inicio < max_tiempo:
        for indicador in indicadores_listo:
            try:
                elemento = driver.find_element(By.XPATH, indicador)
                if elemento.is_displayed() and elemento.is_enabled():
                    return True, time.time() - tiempo_inicio
            except:
                pass
        time.sleep(0.5)
    return False, max_tiempo

def detectar_numero_invalido_rapido(driver):
    patrones_error = [
        "//div[contains(text(), 'El número de teléfono')]",
        "//div[contains(text(), 'Phone number')]",
        "//div[contains(text(), 'Número de telefone')]"
    ]
    try:
        for patron in patrones_error:
            try:
                error_elemento = WebDriverWait(driver, 3).until(
                    EC.presence_of_element_located((By.XPATH, patron))
                )
                if error_elemento:
                    return True, error_elemento.text
            except:
                continue
        return False, None
    except:
        return False, None

def enviar_mensaje_automatico(driver, contacto, indice, total):
    try:
        numero = contacto['phone']
        nombre = contacto['name']
        mensaje = contacto['message']
        print(f"[{indice+1}/{total}] Enviando a {nombre} ({numero})")
        mensaje_codificado = urllib.parse.quote(mensaje)
        url_wa = f"https://web.whatsapp.com/send?phone={numero}&text={mensaje_codificado}"
        driver.get(url_wa)
        
        chat_listo, tiempo_carga = esperar_chat_listo_inteligente(driver)
        if not chat_listo:
            print(f"  ❌ Timeout: Chat no cargó para {nombre}")
            return False, "TIMEOUT_CHAT"
        
        es_invalido, mensaje_error = detectar_numero_invalido_rapido(driver)
        if es_invalido:
            print(f"  ❌ Número inválido: {nombre}")
            return False, "NUMERO_INVALIDO"
        
        selectores_envio = [
            "//span[@data-icon='send']",
            "//span[@data-icon='send']/parent::button",
            "//button[@aria-label='Enviar']",
            "//button[@aria-label='Send']"
        ]
        
        enviado = False
        for selector in selectores_envio:
            try:
                boton_enviar = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                boton_enviar.click()
                enviado = True
                break
            except:
                continue
        
        if not enviado:
            campos_mensaje = [
                "//div[@contenteditable='true'][@data-tab='10']",
                "//div[@aria-placeholder='Type a message']",
                "//footer//div[@contenteditable='true']"
            ]
            for campo in campos_mensaje:
                try:
                    cuadro_texto = driver.find_element(By.XPATH, campo)
                    cuadro_texto.send_keys(Keys.ENTER)
                    enviado = True
                    break
                except:
                    continue
        
        if enviado:
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//span[@data-icon='msg-dblcheck' or @data-icon='msg-check']"))
                )
                print(f"  🎉 ÉXITO: Mensaje enviado a {nombre}")
                return True, "ENVIADO"
            except:
                print(f"  ⚠️ Enviado pero no confirmado")
                return True, "ENVIADO_SIN_CONFIRM"
        else:
            print(f"  ❌ No se pudo enviar con ningún método")
            return False, "FALLO_ENVIO"

    except Exception as e:
        print(f"  💥 ERROR CRÍTICO enviando a {nombre}: {str(e)}")
        return False, f"ERROR_CRITICO: {str(e)}"

def main():
    print("=" * 60)
    print("WhatsApp Sender Test v10 - Modo incognito para estabilidad")
    print("=" * 60)
    print(f"Contactos cargados: {len(contactos)}")
    
    if selenium_disponible:
        driver = configurar_chrome_optimizado()
        if driver:
            driver.get("https://web.whatsapp.com")
            if verificar_whatsapp_listo(driver):
                exitosos = 0
                for i, contacto in enumerate(contactos):
                    exito, resultado = enviar_mensaje_automatico(driver, contacto, i, len(contactos))
                    if exito:
                        exitosos += 1
                    time.sleep(random.uniform(3, 5))
                print(f"✅ Exitosos: {exitosos}")
                driver.quit()
            else:
                driver.quit()
    input("Presiona Enter para cerrar...")

if __name__ == "__main__":
    main()