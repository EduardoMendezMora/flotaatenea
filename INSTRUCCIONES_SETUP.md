# 🚀 Instrucciones de Configuración - FlotaAtenea

## Configuración Manual de Supabase

Debido a problemas con la ejecución automática de scripts, sigue estos pasos para configurar manualmente la base de datos:

### Paso 1: Acceder a Supabase Dashboard
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto FlotaAtenea

### Paso 2: Ejecutar Scripts SQL
Ve a **SQL Editor** en el panel izquierdo y ejecuta los siguientes scripts **EN ORDEN**:

#### 1. Configuración Principal
```sql
-- Copia y pega el contenido completo del archivo:
-- supabase/complete_setup.sql
```

#### 2. Políticas de Seguridad
```sql
-- Copia y pega el contenido completo del archivo:
-- supabase/rls_policies.sql
```

#### 3. Datos de Ejemplo
```sql
-- Copia y pega el contenido completo del archivo:
-- supabase/sample_data.sql
```

### Paso 3: Verificar Configuración
Después de ejecutar los scripts, verifica que las tablas se crearon correctamente:

1. Ve a **Table Editor**
2. Deberías ver las siguientes tablas:
   - users
   - clients
   - vehicles
   - contracts
   - payments
   - maintenance
   - insurance
   - claims
   - notifications

### Paso 4: Configurar Autenticación
1. Ve a **Authentication > Settings**
2. Asegúrate de que esté habilitado "Enable email confirmations"
3. En **Authentication > Users**, crea manualmente los usuarios de prueba:

#### Usuarios de Prueba:
- **Admin**: admin@flotaatenea.com / password123
- **Manager**: manager@flotaatenea.com / password123
- **Operator**: operator@flotaatenea.com / password123
- **Viewer**: viewer@flotaatenea.com / password123

### Paso 5: Ejecutar la Aplicación
Una vez configurada la base de datos:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Credenciales de Acceso
Usa cualquiera de estos usuarios para probar la aplicación:
- Email: admin@flotaatenea.com
- Password: password123

## Estructura de la Base de Datos

### Tablas Principales:
- **users**: Usuarios del sistema con roles
- **clients**: Clientes individuales y empresas
- **vehicles**: Inventario de vehículos
- **contracts**: Contratos de leasing
- **payments**: Pagos y cuotas
- **maintenance**: Mantenimiento de vehículos
- **insurance**: Pólizas de seguro
- **claims**: Reclamos de seguros
- **notifications**: Notificaciones del sistema

### Roles de Usuario:
- **admin**: Acceso completo al sistema
- **manager**: Gestión de contratos y reportes
- **operator**: Operaciones diarias
- **viewer**: Solo lectura

## Solución de Problemas

### Si los scripts no se ejecutan:
1. Verifica que tengas permisos de administrador en Supabase
2. Ejecuta los scripts uno por uno, no todos juntos
3. Si hay errores, revisa los mensajes y ajusta según sea necesario

### Si la aplicación no se conecta:
1. Verifica que las variables de entorno en `.env.local` sean correctas
2. Asegúrate de que Supabase esté configurado correctamente
3. Revisa la consola del navegador para errores específicos

## Próximos Pasos
Una vez que la aplicación esté funcionando:
1. Explora el dashboard principal
2. Prueba las diferentes secciones (Vehículos, Clientes, Contratos, etc.)
3. Revisa los reportes y gráficos
4. Personaliza según tus necesidades específicas
