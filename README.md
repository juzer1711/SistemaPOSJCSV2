# 🧾 POSJCS - Sistema Punto de Venta

POSJCS es un sistema POS (Point of Sale) desarrollado como proyecto académico con visión comercial, diseñado inicialmente para una papelería familiar, pero pensado para escalar y adaptarse a múltiples tipos de negocios.

El sistema permite la gestión de usuarios, clientes, productos y ventas, con una arquitectura moderna basada en tecnologías ampliamente utilizadas en el mercado.

---

## 🚀 Tecnologías Utilizadas

### 🔙 Backend
- Java
- Spring Boot
- Spring Security
- MySQL
- Postman (Pruebas API)

### 🎨 Frontend
- React (Create React App)
- Axios
- MUI (Material UI)

### 🗄 Base de Datos
- MySQL (XAMPP)
- Nombre de la base de datos: `encuadernacionchisley`

---

## 📌 Estado Actual del Proyecto

Actualmente el sistema cuenta con:

✔ Gestión de Usuarios  
✔ Gestión de Clientes  
✔ Gestión de Productos  
✔ Registro de Ventas  
✔ CRUD completo en todas las entidades  
✔ Autenticación mediante JWT  
✔ Rol administrador y cajero  
✔ Pruebas funcionales del backend con Postman  

🔜 Próximamente:
- Módulo de caja
- Cuadre de caja
- Reportes
- Inventario
- Facturas

---

## 🏗 Arquitectura General

El proyecto está dividido en dos aplicaciones principales:

### Backend (Spring Boot)
- API REST
- Puerto por defecto: `8080`
- Autenticación basada en JWT
- Seguridad con Spring Security
- Persistencia con JPA/Hibernate

### Frontend (React)
- Puerto por defecto: `3000`
- Comunicación con backend mediante Axios
- Interfaz construida con Material UI

---

## ⚙️ Instalación y Ejecución

### 1️⃣ Requisitos Previos

- Java 17+
- Node.js
- Maven
- XAMPP (MySQL)

---

### 2️⃣ Configurar Base de Datos

1. Iniciar XAMPP.
2. Crear la base de datos:
encuadernacionchisley
3. Verificar configuración en `application.properties`.

---

### 3️⃣ Ejecutar Backend

Desde la carpeta del backend:
mvn spring-boot:run
El servidor iniciará en:
http://localhost:8080

---

### 4️⃣ Ejecutar Frontend

Desde la carpeta del frontend:
npm install
npm start
La aplicación iniciará en:
http://localhost:3000


---

## 🤝 Buenas Prácticas de Trabajo Colaborativo (GitHub)

Para mantener un desarrollo organizado y profesional, el equipo debe seguir las siguientes prácticas:

### 🌿 1️⃣ Uso de Ramas (Branching)

- ❌ No trabajar directamente sobre `main`
- ✅ Crear una rama por funcionalidad o mejora:

Ejemplo:

feature/login
feature/modulo-caja
fix/error-validacion

Comando:

git checkout -b feature/nombre-funcionalidad

---

### 📝 2️⃣ Commits Claros y Descriptivos

Evitar mensajes como:

update
cambios
arreglos

Usar mensajes descriptivos:

feat: agregar registro de ventas
fix: corregir validación de usuario
refactor: mejorar estructura del servicio de productos

Formato recomendado:

tipo: descripción corta

Tipos comunes:
- feat (nueva funcionalidad)
- fix (corrección de error)
- refactor (mejora interna sin cambiar funcionalidad)
- docs (documentación)
- style (formato/código visual)
- test (pruebas)

---

### 🔄 3️⃣ Pull Requests

Antes de fusionar cambios a `main`:

1. Subir la rama al repositorio.
2. Crear un Pull Request.
3. Esperar revisión de al menos un integrante.
4. Confirmar que el proyecto compile correctamente.

---

### 📌 4️⃣ Actualizar la Rama Antes de Hacer Merge

Siempre actualizar la rama con los cambios recientes de `main`:

git checkout main
git pull origin main
git checkout feature/mi-rama
git merge main

Esto evita conflictos grandes.

---

### 🧠 5️⃣ Buenas Prácticas Generales

- No subir archivos innecesarios (node_modules, target, etc.)
- Verificar que el proyecto compile antes de hacer commit.
- Probar endpoints antes de subir cambios.
- Mantener el código limpio y organizado.
- Seguir la misma estructura y estilo de programación.

---

### 🔐 6️⃣ Seguridad

- No subir contraseñas reales.
- No subir credenciales de base de datos productivas.
- Usar variables de entorno cuando sea necesario.

---

### 🎯 Objetivo

Mantener un desarrollo profesional, organizado y escalable, simulando un entorno real de trabajo en equipo.

## 👨‍💻 Equipo de Desarrollo

- Juan Andres Serna Castro  
- Simon Sepulveda  
- Cristian Camilo Ospina  

Proyecto académico con proyección comercial.