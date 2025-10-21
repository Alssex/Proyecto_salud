# Salud Digital APS - Sistema de Gestión

## 📋 Descripción

Sistema de gestión para programas de Atención Primaria en Salud (APS) que optimiza el registro de información clínica y administrativa.

## 🏥 Características Principales

- **Historia Clínica Digital** por especialidades médicas
- **Gestión de Familias y Pacientes** 
- **Recetario Digital** con control de medicamentos
- **Órdenes de Laboratorio** y procedimientos
- **Dashboard Epidemiológico** y reportes
- **Multi-rol** para diferentes profesionales de la salud

## 🗄️ Base de Datos - Estructura Corregida ✅

### 📊 Modelo Hub-and-Spoke Implementado

### 🏗️ Estructura de Tablas

#### **Módulo Común**
- `Roles` - Tipos de usuarios del sistema
- `Equipos_Basicos` - Equipos de salud
- `Usuarios` - Profesionales y personal
- `Familias` - Grupos familiares
- `Pacientes` - Datos de pacientes
- `Planes_Cuidado_Familiar` - Planes de cuidado
- `Demandas_Inducidas` - Necesidades identificadas

#### **Hub Central**
- `Atenciones_Clinicas` - Registro central de atenciones médicas

#### **Spokes Clínicos (Especialidades)**
- `HC_Medicina_General` - Historia clínica medicina general
- `HC_Psicologia` - Historia clínica psicología
- `HC_Fisioterapia` - Historia clínica fisioterapia
- `HC_Nutricion` - Historia clínica nutrición
- `HC_Fonoaudiologia` - Historia clínica fonoaudiología
- `HC_Odontologia` - Historia clínica odontología

#### **Entidades de Salida (CORREGIDAS ✅)**
- `Recetas_Medicas` - **DERIVADA de HC_Medicina_General**
- `Ordenes_Laboratorio` - **DERIVADA de HC_Medicina_General**

## 🔗 Relaciones Corregidas - Implementadas

👥 Roles del Sistema
Médico - Consultas, diagnósticos, tratamientos, recetas, órdenes

Psicólogo - Evaluaciones psicológicas

Fisioterapeuta - Terapias de rehabilitación

Nutricionista - Planes alimentarios

Fonoaudiólogo - Terapias de habla y audición

Odontólogo - Salud oral

Enfermero Jefe - Gestión de cuidados

Auxiliar de Enfermería - Apoyo en cuidados

Administrativo - Gestión administrativa

🚀 Instalación y Ejecución
Backend
bash
cd backend
npm install
npm run dev
Frontend
bash
npm install
npm run dev
🔧 Tecnologías
Frontend: React 18 + TypeScript + Vite + Tailwind CSS

Backend: Node.js + Express + SQLite

Base de Datos: SQLite con 16 tablas

Herramientas: DBeaver para gestión de BD

📊 Estado del Proyecto
✅ Completado
Estructura de base de datos completa (16 tablas)

Relaciones corregidas entre entidades clínicas

Modelo Hub-and-Spoke implementado

Tablas derivadas correctamente asociadas

Campos requeridos para sistema médico

Base de datos validada y funcionando
