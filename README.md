# 🚗 FlotaAtenea - Sistema de Administración de Flota de Vehículos

Sistema completo para la gestión de flotas de vehículos en modalidad leasing, desarrollado con tecnologías modernas y base de datos en Supabase.

## 🎯 Características Principales

### 📊 Dashboard Ejecutivo
- KPIs en tiempo real (utilización, rentabilidad, mantenimiento)
- Gráficos de ingresos y gastos
- Alertas de vencimientos y mantenimientos
- Mapa de ubicación de vehículos

### 🚙 Gestión de Vehículos
- Inventario completo con fotos y documentos
- Seguimiento de estado (disponible, arrendado, mantenimiento)
- Historial completo de cada vehículo
- Programación de mantenimientos preventivos
- Integración con GPS para tracking

### 👥 Gestión de Clientes
- Base de datos de clientes individuales y empresariales
- Historial crediticio y de pagos
- Documentos y contratos digitalizados
- Sistema de comunicación integrado

### 📋 Contratos de Leasing
- Creación automática de contratos
- Gestión de términos y condiciones
- Renovaciones automáticas
- Cálculo de pagos y penalizaciones
- Firma digital

### 🔧 Mantenimiento
- Programación automática basada en kilometraje/tiempo
- Gestión de talleres y proveedores
- Control de costos y garantías
- Historial detallado por vehículo
- Alertas preventivas

### 🛡️ Seguros
- Gestión de pólizas por vehículo
- Control de vencimientos
- Procesamiento de reclamaciones
- Integración con aseguradoras
- Cálculo de primas

### 💰 Facturación y Pagos
- Facturación automática
- Múltiples métodos de pago
- Recordatorios automáticos
- Control de morosidad
- Reportes financieros

## 🛠️ Stack Tecnológico

### Frontend
- **React** con TypeScript
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes
- **React Query** para manejo de estado
- **React Hook Form** para formularios
- **Recharts** para gráficos

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Row Level Security** para permisos
- **Edge Functions** para lógica de negocio
- **Triggers** para automatizaciones

### Herramientas
- **Vite** para desarrollo
- **ESLint + Prettier** para código limpio
- **Husky** para git hooks
- **Vercel** para deployment

## 📁 Estructura del Proyecto

```
FlotaAtenea/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades y configuración
│   ├── types/              # Tipos TypeScript
│   └── styles/             # Estilos globales
├── supabase/
│   ├── migrations/         # Migraciones de BD
│   ├── functions/          # Edge Functions
│   └── seed.sql           # Datos de prueba
├── docs/                   # Documentación
└── public/                 # Assets estáticos
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales
- `vehicles` - Información de vehículos
- `clients` - Clientes individuales y empresariales
- `contracts` - Contratos de leasing
- `payments` - Historial de pagos
- `maintenance` - Servicios y mantenimientos
- `insurance` - Pólizas de seguro
- `users` - Usuarios del sistema
- `notifications` - Sistema de notificaciones

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd FlotaAtenea
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**
```bash
# Crear archivo .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Ejecutar migraciones**
```bash
npx supabase db push
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

## 📈 Roadmap

### Fase 1 - MVP (4-6 semanas)
- [ ] Configuración inicial y base de datos
- [ ] Autenticación y roles
- [ ] CRUD básico de vehículos y clientes
- [ ] Dashboard básico

### Fase 2 - Core Features (6-8 semanas)
- [ ] Sistema de contratos
- [ ] Gestión de pagos
- [ ] Mantenimiento básico
- [ ] Reportes fundamentales

### Fase 3 - Advanced Features (8-10 semanas)
- [ ] Integración GPS
- [ ] Sistema de seguros
- [ ] Automatizaciones
- [ ] App móvil

### Fase 4 - Enterprise (10+ semanas)
- [ ] API pública
- [ ] Integraciones externas
- [ ] BI avanzado
- [ ] Multi-tenancy

## 🤝 Contribución

Este proyecto está en desarrollo activo. Para contribuir:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

Para preguntas o soporte, contacta a: [tu-email@ejemplo.com]

---

**FlotaAtenea** - Transformando la gestión de flotas vehiculares 🚗✨
