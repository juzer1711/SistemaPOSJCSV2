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


### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/POSJCS.git

## 👨‍💻 Equipo de Desarrollo

- Juan Andres Serna Castro  
- Simon Sepulveda  
- Cristian Camilo Ospina  

Proyecto académico con proyección comercial.