# Sistema de Microservicios - Tienda Online 🛍️

Este proyecto es un sistema completo de tienda online construido con microservicios. Cada servicio es una aplicación independiente que se comunica con los demás a través de llamadas HTTP.

## 🚀 Instalación desde Git

### Paso 1: Clonar el Repositorio

```bash
# Usando SSH (recomendado)
git clone git@github.com:Alejandroclaro1227/Prueba_Node.git online-shop

# O usando HTTPS
git clone https://github.com/Alejandroclaro1227/Prueba_Node.git online-shop

# Entrar al directorio del proyecto
cd online-shop
```

### Paso 2: Configurar Git (si no lo has hecho antes)

```bash
# Configurar tu nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu.email@ejemplo.com"

# Si usas SSH, asegúrate de tener tu clave SSH configurada en GitHub
# Para generar una nueva clave SSH:
ssh-keygen -t ed25519 -C "tu.email@ejemplo.com"
```

### Paso 3: Crear y Cambiar de Rama (Opcional)

```bash
# Crear y cambiar a una nueva rama
git checkout -b nombre-de-tu-rama

# O cambiar a una rama existente
git checkout nombre-de-la-rama
```

## 📋 ¿Qué hace cada servicio?

### 1. Servicio de Pedidos (order-service) - Puerto 3000
- Recibe los pedidos de los clientes
- Verifica el inventario comunicándose con inventory-service
- Solicita la entrega a delivery-service
- Mantiene el estado del pedido

### 2. Servicio de Inventario (inventory-service) - Puerto 3001
- Verifica si hay stock disponible
- Actualiza las cantidades de productos
- Previene la venta de productos sin stock

### 3. Servicio de Entregas (delivery-service) - Puerto 3002
- Crea nuevas entregas para pedidos confirmados
- Genera códigos únicos de seguimiento
- Gestiona el estado de las entregas

## 💻 Requisitos del Sistema

- Node.js versión 14 o superior
  - Para verificar tu versión: `node --version`
- npm versión 6 o superior
  - Para verificar tu versión: `npm --version`
- Puertos 3000, 3001 y 3002 disponibles

## 📁 Estructura del Proyecto

```
online-shop/
├── order-service/          # Servicio de pedidos
│   ├── package.json
│   └── server.js
├── inventory-service/      # Servicio de inventario
│   ├── package.json
│   └── server.js
├── delivery-service/       # Servicio de entregas
│   ├── package.json
│   └── server.js
└── test.html              # Página de prueba
```

## 🚀 Guía de Instalación Paso a Paso

### Paso 1: Preparar el Entorno

1. Abre tres terminales diferentes (una para cada servicio)
2. En cada terminal, navega hasta la carpeta del proyecto:
   ```bash
   cd ruta/a/tu/online-shop
   ```

### Paso 2: Instalar Dependencias

En cada servicio (repite estos pasos en cada carpeta de servicio):

1. Navega al directorio del servicio:
   ```bash
   # Terminal 1
   cd inventory-service
   
   # Terminal 2
   cd delivery-service
   
   # Terminal 3
   cd order-service
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```
   Esto instalará Express y otras dependencias necesarias.

### Paso 3: Iniciar los Servicios

⚠️ ¡IMPORTANTE! Los servicios deben iniciarse en este orden específico:

1. Primero, inicia inventory-service:
   ```bash
   # En la terminal de inventory-service
   cd inventory-service
   npm start
   # Deberías ver: "Inventory Service running on port 3001"
   ```

2. Segundo, inicia delivery-service:
   ```bash
   # En la terminal de delivery-service
   cd delivery-service
   npm start
   # Deberías ver: "Delivery Service running on port 3002"
   ```

3. Finalmente, inicia order-service:
   ```bash
   # En la terminal de order-service
   cd order-service
   npm start
   # Deberías ver: "Order Service running on port 3000"
   ```

## 🧪 Pruebas del Sistema

### Método 1: Usando el Navegador (Recomendado para Principiantes)

1. Abre el archivo `test.html` en tu navegador:
   - Haz doble clic en el archivo
   - O arrastra el archivo a tu navegador

2. En la página web verás:
   - Un formulario para crear pedidos
   - Campos para ID del producto y cantidad
   - Botón para enviar el pedido

3. Ejemplo de uso:
   - ID del Producto: "123"
   - Cantidad: 1
   - Click en "Crear Pedido"
   - Verás los mensajes de confirmación en la página

### Método 2: Usando PowerShell (Para Usuarios Avanzados)

1. Crear un nuevo pedido:
   ```powershell
   $body = @{
       productId = "123"
       quantity = 1
   } | ConvertTo-Json

   Invoke-RestMethod `
       -Uri "http://localhost:3000/orders" `
       -Method Post `
       -ContentType "application/json" `
       -Body $body
   ```

2. Verificar un pedido existente:
   ```powershell
   Invoke-RestMethod `
       -Uri "http://localhost:3000/orders/[ID-del-pedido]" `
       -Method Get
   ```

## 📡 API Endpoints Detallados

### Order Service (Puerto 3000)
```
POST /orders
Body: {
    "productId": "string",
    "quantity": number
}
Respuesta: {
    "orderId": "string",
    "status": "string"
}

GET /orders/:id
Respuesta: {
    "orderId": "string",
    "status": "string",
    "deliveryId": "string"
}
```

### Inventory Service (Puerto 3001)
```
POST /check
Body: {
    "productId": "string",
    "quantity": number
}
Respuesta: {
    "available": boolean
}
```

### Delivery Service (Puerto 3002)
```
POST /deliveries
Body: {
    "orderId": "string"
}
Respuesta: {
    "deliveryId": "string",
    "status": "string"
}
```

## ❌ Solución de Problemas Comunes

### 1. Error: "MODULE_NOT_FOUND"
**Problema**: No se encuentran los módulos necesarios
**Solución**: 
- Verifica que estás en el directorio correcto
- Ejecuta `npm install` nuevamente
- Asegúrate que el archivo package.json existe

### 2. Error: "EADDRINUSE"
**Problema**: El puerto ya está en uso
**Solución**:
- Verifica que no hay otra instancia del servicio corriendo
- Comprueba que otros programas no están usando los puertos
- Reinicia el sistema si es necesario

### 3. Error: "ECONNREFUSED"
**Problema**: No hay conexión entre servicios
**Solución**:
- Verifica que todos los servicios están corriendo
- Comprueba el orden de inicio de los servicios
- Usa los endpoints `/health` para verificar cada servicio:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:3000/health"
  Invoke-RestMethod -Uri "http://localhost:3001/health"
  Invoke-RestMethod -Uri "http://localhost:3002/health"
  ```

## 📞 Flujo de Comunicación

1. Cliente → Order Service: Crea un pedido
2. Order Service → Inventory Service: Verifica stock
3. Order Service → Delivery Service: Crea entrega
4. Order Service → Cliente: Confirma pedido

## 🔍 Verificación del Sistema

Para asegurarte de que todo funciona correctamente:

1. Todos los servicios deben estar corriendo sin errores
2. Cada servicio debe responder a su endpoint `/health`
3. Puedes crear un pedido de prueba
4. El pedido debe pasar por todo el flujo correctamente

## 🔄 Flujo de Trabajo con Git

### Comandos Básicos

```bash
# Ver estado de los archivos
git status

# Agregar archivos modificados
git add .

# Crear commit
git commit -m "Descripción de tus cambios"

# Subir cambios a GitHub
git push origin nombre-de-tu-rama
```

### Actualizar Repositorio

```bash
# Obtener cambios del repositorio remoto
git pull origin main

# Si estás en una rama diferente
git pull origin nombre-de-tu-rama
```

### Solución de Problemas con Git

1. **Conflictos en archivos**:
   ```bash
   # Obtener los cambios más recientes
   git fetch origin
   
   # Ver diferencias
   git diff origin/main
   
   # Después de resolver conflictos
   git add .
   git commit -m "Resueltos conflictos de merge"
   ```

2. **Revertir cambios locales**:
   ```bash
   # Revertir un archivo específico
   git checkout -- nombre-del-archivo

   # Revertir todos los cambios
   git reset --hard HEAD
   ```

3. **Problemas con credenciales**:
   ```bash
   # Verificar configuración remota
   git remote -v

   # Cambiar URL remota (si es necesario)
   git remote set-url origin git@github.com:Alejandroclaro1227/Prueba_Node.git
   ```

### Buenas Prácticas

1. **Antes de empezar a trabajar**:
   ```bash
   git pull origin main
   git checkout -b feature/nombre-de-tu-caracteristica
   ```

2. **Antes de hacer push**:
   ```bash
   git add .
   git status  # Revisar cambios
   git commit -m "Descripción clara del cambio"
   git push origin feature/nombre-de-tu-caracteristica
   ```

3. **Mantener el repositorio limpio**:
   ```bash
   # Eliminar ramas locales fusionadas
   git branch --merged | grep -v '^*' | xargs git branch -d

   # Limpiar archivos no rastreados
   git clean -n  # Vista previa
   git clean -f  # Eliminar archivos
   ```

#
