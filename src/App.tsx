import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/LoginForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserProfile } from "./components/UserProfile";
import { 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Search, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Stethoscope,
  Brain,
  Dumbbell,
  Apple,
  Ear,
  Smile,
  Shield,
  UserCheck,
  Building2,
  Eye,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Phone,
  MapPin,
  Camera,
  Mic,
  Save,
  Send,
  Home,
  ChevronDown,
  Filter,
  Bell,
  Wifi,
  WifiOff,
  ClipboardList,
  Heart,
  Briefcase,
  TrendingUp,
  AlertCircle,
  Download,
  Upload,
  Calendar as CalendarIcon,
  UserPlus,
  FileCheck,
  Target,
  Globe,
  LogOut
} from "lucide-react";
import { AuthService } from "./services/authService";

// Configuración completa de todos los roles de usuario
export const USER_ROLES = {
  medico: {
    name: "Médico",
    icon: Stethoscope,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "familias", label: "Familias", icon: Users },
      { key: "consultas-asignadas", label: "Consultas Asignadas", icon: Calendar },
      { key: "consultas-realizadas", label: "Consultas Realizadas", icon: CheckCircle },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-epidemio", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  psicologo: {
    name: "Psicólogo",
    icon: Brain,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "consultas-asignadas", label: "Consultas Asignadas", icon: Calendar },
      { key: "consultas-realizadas", label: "Consultas Realizadas", icon: CheckCircle },
      { key: "educacion-salud", label: "Educación en Salud", icon: FileText },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-psicologia", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  fisioterapeuta: {
    name: "Fisioterapeuta",
    icon: Dumbbell,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "terapias-asignadas", label: "Terapias Asignadas", icon: Calendar },
      { key: "terapias-realizadas", label: "Terapias Realizadas", icon: CheckCircle },
      { key: "educacion-salud", label: "Educación en Salud", icon: FileText },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-fisioterapia", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  nutricionista: {
    name: "Nutricionista",
    icon: Apple,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "consultas-asignadas", label: "Consultas Asignadas", icon: Calendar },
      { key: "consultas-realizadas", label: "Consultas Realizadas", icon: CheckCircle },
      { key: "educacion-salud", label: "Educación en Salud", icon: FileText },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-nutricion", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  fonoaudiologo: {
    name: "Fonoaudiólogo",
    icon: Ear,
    color: "emerald",
    mainSections: [
      { key: "consultas-asignadas", label: "Consultas Asignadas", icon: Calendar },
      { key: "consultas-realizadas", label: "Consultas Realizadas", icon: CheckCircle },
      { key: "educacion-salud", label: "Educación en Salud", icon: FileText },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-fonoaudiologia", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  odontologo: {
    name: "Odontólogo",
    icon: Smile,
    color: "emerald",
    mainSections: [
      { key: "consultas-asignadas", label: "Consultas Asignadas", icon: Calendar },
      { key: "consultas-realizadas", label: "Consultas Realizadas", icon: CheckCircle },
      { key: "educacion-salud", label: "Educación en Salud", icon: FileText },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-odontologia", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  enfermero_jefe: {
    name: "Enfermero Jefe",
    icon: Shield,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "caracterizaciones", label: "Caracterizaciones", icon: FileText },
      { key: "planes-cuidado", label: "Planes de Cuidado", icon: Activity },
      { key: "consultas-asignadas", label: "Consultas", icon: Calendar },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-enfermeria", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  auxiliar_enfermeria: {
    name: "Auxiliar de Enfermería",
    icon: UserCheck,
    color: "emerald",
    mainSections: [
      { key: "crear-familia", label: "Crear Familia", icon: Users },
      { key: "caracterizaciones", label: "Caracterizaciones", icon: FileText },
      { key: "planes-cuidado", label: "Planes de Cuidado", icon: Heart },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-auxiliar", label: "Dashboard", icon: BarChart3 },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  administrativo: {
    name: "Administrativo",
    icon: Briefcase,
    color: "emerald",
    mainSections: [
      { key: "gestion-citas", label: "Gestión de Citas", icon: CalendarIcon },
      { key: "reportes-admin", label: "Reportes", icon: BarChart3 },
      { key: "validacion-registros", label: "Validación", icon: FileCheck },
      { key: "bitacora", label: "Bitácora", icon: Activity }
    ],
    sidebarSections: [
      { key: "bd-pacientes", label: "BD Pacientes", icon: Search },
      { key: "dashboard-admin", label: "Dashboard", icon: TrendingUp },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  },
  ente_salud_publica: {
    name: "Ente de Salud Pública",
    icon: Globe,
    color: "emerald",
    mainSections: [
      { key: "dashboard-epidemio", label: "Dashboard Epidemiológico", icon: TrendingUp },
      { key: "reportes-publicos", label: "Reportes", icon: BarChart3 },
      { key: "alertas-epidemio", label: "Alertas", icon: AlertCircle },
      { key: "supervision-coberturas", label: "Supervisión", icon: Target }
    ],
    sidebarSections: [
      { key: "bd-pacientes-agregada", label: "BD Agregada", icon: Search },
      { key: "panel-nacional", label: "Panel Nacional", icon: Globe },
      { key: "configuracion", label: "Configuración", icon: Settings },
      { key: "ayuda", label: "Ayuda", icon: HelpCircle }
    ]
  }
};

// Hook para detectar el tipo de dispositivo
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });
  
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceType;
};

// Componentes base responsivos
const ResponsiveCard = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-2xl shadow-soft border border-sinbad-300 p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

const ResponsiveField = ({ label, children, required = false, hint }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-eden-700">
      {label} {required && <span className="text-eden-600">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-eden-500">{hint}</p>}
  </div>
);

const ResponsiveInput = (props: any) => (
  <input
    {...props}
    className={`w-full px-3 py-2 md:py-3 border border-sinbad-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm md:text-base transition-colors ${props.className || ""}`}
  />
);

const ResponsiveSelect = ({ options = [], ...rest }: any) => (
  <select
    {...rest}
    className="w-full px-3 py-2 md:py-3 border border-sinbad-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm md:text-base bg-white transition-colors"
  >
    {options.map((o: any) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const ResponsiveBadge = ({ children, tone = "stone" }: { children: React.ReactNode; tone?: string }) => {
  const colors = {
    // Badges funcionales por tipo de información
    health: "border-bondi-200 text-bondi-700 bg-bondi-50", // Información de salud
    admin: "border-san-marino text-san-marino bg-san-marino-50", // Información administrativa
    data: "border-eden-200 text-eden-700 bg-eden-50", // Información de datos
    warning: "border-janna-300 text-eden-800 bg-janna-100", // Advertencias
    neutral: "border-sinbad-300 text-sinbad-700 bg-sinbad-100", // Información neutra
    
    // Mantener compatibilidad con nombres anteriores
    green: "border-bondi-200 text-bondi-700 bg-bondi-50",
    amber: "border-janna-300 text-eden-800 bg-janna-100",
    rose: "border-eden-200 text-eden-700 bg-eden-50",
    blue: "border-san-marino text-san-marino bg-san-marino-50",
    stone: "border-sinbad-300 text-sinbad-700 bg-sinbad-100",
    bondi: "border-bondi-200 text-bondi-700 bg-bondi-50",
    marino: "border-san-marino text-san-marino bg-san-marino-50",
    eden: "border-eden-200 text-eden-700 bg-eden-50",
    sinbad: "border-sinbad-300 text-sinbad-700 bg-sinbad-100",
    janna: "border-janna-300 text-eden-800 bg-janna-100"
  };
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border font-medium ${colors[tone] || colors.stone}`}>
      {children}
    </span>
  );
};

const ResponsiveButton = ({ children, variant = "primary", size = "md", className = "", ...props }: {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
  [key: string]: any;
}) => {
  const variants = {
    primary: "bg-bondi-blue text-white hover:bg-bondi-600 shadow-soft", // Salud y acciones principales
    secondary: "bg-janna-100 text-eden-700 hover:bg-janna-200 border border-janna-300", // Alertas y advertencias
    outline: "border border-eden-200 text-eden-700 hover:bg-sinbad-50 hover:border-san-marino", // Datos y contenido
    success: "bg-bondi-blue text-white hover:bg-bondi-600 shadow-soft", // Confirmaciones de salud
    warning: "bg-janna-500 text-eden-800 hover:bg-janna-600 shadow-soft", // Advertencias
    danger: "bg-eden-600 text-white hover:bg-eden-700 shadow-soft", // Datos críticos
    admin: "bg-san-marino text-white hover:bg-san-marino-600 shadow-soft", // Navegación y administración
    info: "bg-sinbad-600 text-eden-800 hover:bg-sinbad-700 shadow-soft" // Información general
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 md:py-3 text-sm md:text-base",
    lg: "px-6 py-3 md:py-4 text-base md:text-lg"
  };
  
  return (
    <button
      {...props}
      className={`rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Componente de navegación móvil
const MobileNavItem = ({ label, icon: Icon, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
      active 
        ? "bg-san-marino-50 text-san-marino-700 border border-san-marino-200 shadow-soft" 
        : "text-eden-600 hover:bg-sinbad-50 hover:text-san-marino-700"
    }`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="font-medium flex-1 text-sm">{label}</span>
    {badge && (
      <span className="bg-janna-200 text-eden-800 text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-medium">
        {badge}
      </span>
    )}
  </button>
);

// Vistas principales
function InicioView({ currentRole, deviceType }: any) {
  const roleConfig = USER_ROLES[currentRole];
  const [isOnline, setIsOnline] = useState(false);
  
  const kpis = [
    { label: "Registros hoy", value: 42, icon: FileText },
    { label: "Consultas", value: 19, icon: Calendar },
    { label: "Caracterizaciones", value: 12, icon: Users },
    { label: "Demandas inducidas", value: 7, icon: Target },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Estado de conexión */}
      <ResponsiveCard className="bg-gradient-to-r from-sinbad-100 to-janna-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-4 h-4 text-bondi-blue" /> : <WifiOff className="w-4 h-4 text-janna-600" />}
            <span className="text-sm font-medium text-eden-700">
              {isOnline ? "En línea" : "Sin conexión"}
            </span>
          </div>
          <ResponsiveBadge tone={isOnline ? "health" : "warning"}>
            {isOnline ? "Sincronizado" : "3 pendientes"}
          </ResponsiveBadge>
        </div>
      </ResponsiveCard>

      {/* KPIs */}
      <ResponsiveCard>
        <h3 className="font-semibold text-eden-800 mb-4">Resumen de actividad</h3>
        <div className={`grid gap-3 ${
          deviceType === 'mobile' ? 'grid-cols-2' : 
          deviceType === 'tablet' ? 'grid-cols-2 md:grid-cols-4' : 
          'grid-cols-4'
        }`}>
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-sinbad-100 rounded-xl p-3 md:p-4 border border-sinbad-300 hover:shadow-soft transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-eden-600" />
                  <div className="text-xs text-eden-600">{kpi.label}</div>
                </div>
                <div className="text-xl md:text-2xl font-semibold text-eden-800">{kpi.value}</div>
              </div>
            );
          })}
        </div>
      </ResponsiveCard>

      {/* Acciones rápidas */}
      <ResponsiveCard>
        <h3 className="font-semibold text-eden-800 mb-4">Acciones rápidas</h3>
        <div className={`grid gap-3 ${
          deviceType === 'mobile' ? 'grid-cols-2' : 
          deviceType === 'tablet' ? 'grid-cols-3' : 
          'grid-cols-6'
        }`}>
          {roleConfig.mainSections.slice(0, 6).map((section) => {
            const Icon = section.icon;
            return (
              <ResponsiveButton
                key={section.key}
                variant="secondary"
                className="flex flex-col items-center gap-2 h-16 md:h-20 hover:shadow-soft"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs">{section.label.split(' ')[0]}</span>
              </ResponsiveButton>
            );
          })}
        </div>
      </ResponsiveCard>

      {/* Próximas citas - Solo en desktop y tablet */}
      {deviceType !== 'mobile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ResponsiveCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-eden-800">Próximas citas</h3>
              <ResponsiveBadge tone="bondi">3</ResponsiveBadge>
            </div>
            <div className="space-y-3">
              {[
                { nombre: "María González", hora: "09:30", tipo: "Control" },
                { nombre: "Carlos Rodríguez", hora: "10:15", tipo: "Primera vez" },
                { nombre: "Ana Martínez", hora: "11:00", tipo: "Seguimiento" }
              ].map((cita, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-sinbad-50 rounded-lg border border-sinbad-200 hover:shadow-soft transition-all">
                  <div>
                    <div className="font-medium text-eden-800 text-sm">{cita.nombre}</div>
                    <div className="text-xs text-eden-600">{cita.tipo}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-eden-800 text-sm">{cita.hora}</div>
                    <ResponsiveBadge tone="health">Confirmada</ResponsiveBadge>
                  </div>
                </div>
              ))}
            </div>
          </ResponsiveCard>

          <ResponsiveCard>
            <h3 className="font-semibold text-eden-800 mb-4">Alertas del sistema</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-janna-100 rounded-lg border border-janna-200">
                <AlertTriangle className="w-5 h-5 text-janna-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-eden-800">Campos incompletos</div>
                  <div className="text-xs text-eden-600">HC: antecedentes familiares</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-bondi-50 rounded-lg border border-bondi-200">
                <CheckCircle className="w-5 h-5 text-bondi-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-bondi-800">Exportación exitosa</div>
                  <div className="text-xs text-bondi-600">Última exportación RIPS</div>
                </div>
              </div>
            </div>
          </ResponsiveCard>
        </div>
      )}
    </div>
  );
}

function FamiliasView({ deviceType }: any) {
  const [familias, setFamilias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMunicipio, setFilterMunicipio] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await AuthService.getFamilias();
        if (isMounted) setFamilias(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Error cargando familias');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-eden-800">Familias</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-sinbad-200 hover:bg-sinbad-50 hover:border-san-marino transition-all">
              <Filter className="w-4 h-4 text-eden-600" />
            </button>
            <button className="p-2 rounded-lg border border-sinbad-200 hover:bg-sinbad-50 hover:border-san-marino transition-all">
              <Search className="w-4 h-4 text-eden-600" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-sm text-eden-500">Cargando familias...</div>
        )}
        {error && (
          <div className="text-sm text-eden-600">{error}</div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <ResponsiveField label="Buscar por apellido">
                <ResponsiveInput
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  placeholder="Ej: García"
                />
              </ResponsiveField>
              <ResponsiveField label="Filtrar por municipio">
                <ResponsiveInput
                  value={filterMunicipio}
                  onChange={(e: any) => setFilterMunicipio(e.target.value)}
                  placeholder="Ej: Cali"
                />
              </ResponsiveField>
            </div>
            {familias.length === 0 && (
              <div className="text-sm text-eden-500">No hay familias registradas.</div>
            )}
            {familias
              .filter((f: any) =>
                (!searchTerm || (f.apellido_principal || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!filterMunicipio || (f.municipio || '').toLowerCase().includes(filterMunicipio.toLowerCase()))
              )
              .map((fam: any) => (
              <button
                key={fam.familia_id}
                onClick={() => {
                  // Señal al contenedor principal mediante evento custom
                  const ev: any = new CustomEvent('openFamiliaDetalle', { detail: fam });
                  window.dispatchEvent(ev);
                }}
                className="w-full p-4 bg-sinbad-50 rounded-xl text-left hover:bg-sinbad-100 hover:shadow-soft transition-all border border-sinbad-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-eden-800">{fam.apellido_principal}</h4>
                      {typeof fam.integrantes_count === 'number' && (
                        <ResponsiveBadge tone="admin">{fam.integrantes_count}</ResponsiveBadge>
                      )}
                    </div>
                    <p className="text-sm text-eden-600 mb-2">
                      {fam.direccion} • {fam.barrio_vereda || fam.municipio}
                    </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-eden-400" />
                      <span className="text-sm text-eden-600">{fam.municipio}</span>
                      {fam.telefono_contacto && (
                        <>
                          <span className="text-eden-300">•</span>
                          <Phone className="w-4 h-4 text-eden-400" />
                          <span className="text-sm text-eden-600">{fam.telefono_contacto}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-eden-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </ResponsiveCard>
    </div>
  );
}

// Vista: Detalle de Familia
function DetalleFamiliaView({ familia, onBack, onShowCaracterizacion, onShowPaciente }: {
  familia: any;
  onBack: () => void;
  onShowCaracterizacion: (familia: any, caracterizacion: any) => void;
  onShowPaciente: (paciente: any, familia: any) => void;
}) {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [caracterizacion, setCaracterizacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    tipo_documento: 'CC',
    numero_documento: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fecha_nacimiento: '',
    genero: 'M',
    telefono: '',
    email: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pacientesData, caracterizacionData] = await Promise.all([
        AuthService.getPacientesByFamilia(familia.familia_id),
        AuthService.getCaracterizacionFamilia(familia.familia_id)
      ]);
      setPacientes(pacientesData);
      setCaracterizacion(caracterizacionData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [familia?.familia_id]);

  const handleCreate = async () => {
    await AuthService.crearPaciente({
      familia_id: familia.familia_id,
      tipo_documento: form.tipo_documento,
      numero_documento: form.numero_documento,
      primer_nombre: form.primer_nombre,
      segundo_nombre: form.segundo_nombre || null,
      primer_apellido: form.primer_apellido,
      segundo_apellido: form.segundo_apellido || null,
      fecha_nacimiento: form.fecha_nacimiento || null,
      genero: form.genero || null,
      telefono: form.telefono || null,
      email: form.email || null
    });
    setShowForm(false);
    await loadData();
  };

  const handleShowCaracterizacion = () => {
    if (onShowCaracterizacion) {
      onShowCaracterizacion(familia, caracterizacion);
    }
  };

  const handleShowPaciente = (paciente: any) => {
    if (onShowPaciente) {
      onShowPaciente(paciente, familia);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <ResponsiveCard>
          <div className="text-center py-8">
            <div className="text-sm text-stone-500">Cargando datos de la familia...</div>
          </div>
        </ResponsiveCard>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900">Familia {familia.apellido_principal}</h3>
            <div className="text-sm text-stone-600">{familia.direccion} • {familia.municipio}</div>
            {caracterizacion?.familia?.fecha_caracterizacion && (
              <div className="text-xs text-bondi-600 mt-1">
                Caracterizada el {new Date(caracterizacion.familia.fecha_caracterizacion).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <ResponsiveButton variant="secondary" onClick={onBack}>Volver</ResponsiveButton>
            <ResponsiveButton variant="admin" onClick={handleShowCaracterizacion}>
              {caracterizacion?.tiene_caracterizacion ? 'Editar Caracterización' : 'Realizar Caracterización'}
            </ResponsiveButton>
            <ResponsiveButton onClick={() => setShowForm(true)}>Agregar Paciente</ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>

      {/* Información de caracterización familiar si existe */}
      {caracterizacion?.tiene_caracterizacion && (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-3">Información de Caracterización</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-stone-500">Tipo de Familia</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.tipo_familia || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Zona</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.zona || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Estrato</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.estrato || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Territorio</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.territorio || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Riesgo Familiar</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.riesgo_familiar || 'No evaluado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Nº Ficha</div>
              <div className="text-sm font-medium text-stone-900">
                {caracterizacion.familia.numero_ficha || 'No asignado'}
              </div>
            </div>
          </div>
        </ResponsiveCard>
      )}

      <ResponsiveCard>
        <h4 className="font-semibold text-stone-900 mb-3">Integrantes</h4>
        {pacientes.length === 0 ? (
          <div className="text-sm text-stone-500">No hay pacientes en esta familia.</div>
        ) : (
          <div className="space-y-2">
            {pacientes.map((p: any) => (
              <button
                key={p.paciente_id}
                onClick={() => handleShowPaciente(p)}
                className="w-full p-3 bg-stone-50 rounded-lg flex items-center justify-between hover:bg-stone-100 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-stone-900 text-sm">
                    {p.primer_nombre} {p.segundo_nombre} {p.primer_apellido} {p.segundo_apellido}
                  </div>
                  <div className="text-xs text-stone-500">{p.tipo_documento} {p.numero_documento}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>
        )}
      </ResponsiveCard>

      {showForm && (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-3">Nuevo Paciente</h4>
          <div className={`grid gap-3 ${'grid-cols-1 md:grid-cols-2'}`}>
            <ResponsiveField label="Tipo documento">
              <ResponsiveSelect value={form.tipo_documento} onChange={(e: any) => setForm({ ...form, tipo_documento: e.target.value })}
                options={[{value:'CC',label:'CC'},{value:'TI',label:'TI'},{value:'CE',label:'CE'}]} />
            </ResponsiveField>
            <ResponsiveField label="Número documento">
              <ResponsiveInput value={form.numero_documento} onChange={(e: any) => setForm({ ...form, numero_documento: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Primer nombre">
              <ResponsiveInput value={form.primer_nombre} onChange={(e: any) => setForm({ ...form, primer_nombre: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Segundo nombre">
              <ResponsiveInput value={form.segundo_nombre} onChange={(e: any) => setForm({ ...form, segundo_nombre: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Primer apellido">
              <ResponsiveInput value={form.primer_apellido} onChange={(e: any) => setForm({ ...form, primer_apellido: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Segundo apellido">
              <ResponsiveInput value={form.segundo_apellido} onChange={(e: any) => setForm({ ...form, segundo_apellido: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Fecha nacimiento">
              <ResponsiveInput type="date" value={form.fecha_nacimiento} onChange={(e: any) => setForm({ ...form, fecha_nacimiento: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Género">
              <ResponsiveSelect value={form.genero} onChange={(e: any) => setForm({ ...form, genero: e.target.value })}
                options={[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}]} />
            </ResponsiveField>
            <ResponsiveField label="Teléfono">
              <ResponsiveInput value={form.telefono} onChange={(e: any) => setForm({ ...form, telefono: e.target.value })} />
            </ResponsiveField>
            <ResponsiveField label="Email">
              <ResponsiveInput value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
            </ResponsiveField>
          </div>
          <div className="flex gap-3 pt-4">
            <ResponsiveButton variant="secondary" onClick={() => setShowForm(false)}>Cancelar</ResponsiveButton>
            <ResponsiveButton onClick={handleCreate}>Guardar Paciente</ResponsiveButton>
          </div>
        </ResponsiveCard>
      )}
    </div>
  );
}

// Vista: Detalle del Paciente
function DetallePacienteView({ paciente, familia, caracterizacion, onBack }: any) {
  const [pacienteData, setPacienteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar los datos de caracterización del paciente específico
    if (caracterizacion?.integrantes) {
      const pacienteConCaracterizacion = caracterizacion.integrantes.find(
        (p: any) => p.paciente_id === paciente.paciente_id
      );
      setPacienteData(pacienteConCaracterizacion || paciente);
    } else {
      setPacienteData(paciente);
    }
    setLoading(false);
  }, [paciente, caracterizacion]);

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <ResponsiveCard>
          <div className="text-center py-8">
            <div className="text-sm text-stone-500">Cargando datos del paciente...</div>
          </div>
        </ResponsiveCard>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header del paciente */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-stone-100">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-stone-900">
              {paciente.primer_nombre} {paciente.segundo_nombre} {paciente.primer_apellido} {paciente.segundo_apellido}
            </h3>
            <p className="text-sm text-stone-500">
              {paciente.tipo_documento} {paciente.numero_documento} • {paciente.genero}
            </p>
            {paciente.fecha_nacimiento && (
              <p className="text-xs text-stone-400">
                Nacido: {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <ResponsiveBadge tone="admin">
              {familia.apellido_principal}
            </ResponsiveBadge>
          </div>
        </div>
      </ResponsiveCard>

      {/* Datos de caracterización del paciente */}
      {pacienteData?.fecha_caracterizacion ? (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-3">Caracterización Individual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-stone-500">Rol Familiar</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.rol_familiar || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Ocupación</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.ocupacion || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Nivel Educativo</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.nivel_educativo || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Grupo Poblacional</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.grupo_poblacional || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Régimen de Afiliación</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.regimen_afiliacion || 'No especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Pertenencia Étnica</div>
              <div className="text-sm font-medium text-stone-900">
                {pacienteData.pertenencia_etnica || 'No especificado'}
              </div>
            </div>
            {pacienteData.discapacidad && pacienteData.discapacidad.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-xs text-stone-500">Discapacidad</div>
                <div className="text-sm font-medium text-stone-900">
                  {pacienteData.discapacidad.join(', ')}
                </div>
              </div>
            )}
            {pacienteData.victima_violencia && (
              <div className="md:col-span-2">
                <ResponsiveBadge tone="warning">Víctima de Violencia</ResponsiveBadge>
              </div>
            )}
          </div>
          
          {/* Datos de salud si existen */}
          {pacienteData.datos_salud && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <h5 className="font-medium text-stone-900 mb-2">Datos de Salud</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pacienteData.datos_salud.peso && (
                  <div>
                    <div className="text-xs text-stone-500">Peso</div>
                    <div className="text-sm font-medium text-stone-900">
                      {pacienteData.datos_salud.peso} kg
                    </div>
                  </div>
                )}
                {pacienteData.datos_salud.talla && (
                  <div>
                    <div className="text-xs text-stone-500">Talla</div>
                    <div className="text-sm font-medium text-stone-900">
                      {pacienteData.datos_salud.talla} cm
                    </div>
                  </div>
                )}
                {pacienteData.datos_salud.diagnostico && (
                  <div>
                    <div className="text-xs text-stone-500">Diagnóstico Nutricional</div>
                    <div className="text-sm font-medium text-stone-900">
                      {pacienteData.datos_salud.diagnostico}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ResponsiveCard>
      ) : (
        <ResponsiveCard>
          <div className="text-center py-6">
            <div className="text-sm text-stone-500 mb-2">Sin caracterización individual</div>
            <div className="text-xs text-stone-400">
              Este paciente no tiene datos de caracterización individual registrados
            </div>
          </div>
        </ResponsiveCard>
      )}

      {/* Información de la familia */}
      <ResponsiveCard>
        <h4 className="font-semibold text-stone-900 mb-3">Información Familiar</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-stone-500">Familia</div>
            <div className="text-sm font-medium text-stone-900">{familia.apellido_principal}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Dirección</div>
            <div className="text-sm font-medium text-stone-900">
              {familia.direccion}, {familia.municipio}
            </div>
          </div>
          {familia.telefono_contacto && (
            <div>
              <div className="text-xs text-stone-500">Teléfono de Contacto</div>
              <div className="text-sm font-medium text-stone-900">{familia.telefono_contacto}</div>
            </div>
          )}
        </div>
      </ResponsiveCard>

      {/* Acciones disponibles */}
      <ResponsiveCard>
        <h4 className="font-semibold text-stone-900 mb-3">Acciones Disponibles</h4>
        <div className="flex flex-wrap gap-2">
          <ResponsiveButton 
            variant="admin" 
            size="sm"
            onClick={() => {
              // TODO: Implementar navegación a historia clínica
              alert('Función de Historia Clínica en desarrollo');
            }}
          >
            Historia Clínica
          </ResponsiveButton>
          <ResponsiveButton 
            variant="admin" 
            size="sm"
            onClick={() => {
              // TODO: Implementar navegación a consulta médica
              alert('Función de Consulta Médica en desarrollo');
            }}
          >
            Consulta Médica
          </ResponsiveButton>
          <ResponsiveButton 
            variant="admin" 
            size="sm"
            onClick={() => {
              // TODO: Implementar navegación a seguimiento
              alert('Función de Seguimiento en desarrollo');
            }}
          >
            Seguimiento
          </ResponsiveButton>
          <ResponsiveButton 
            variant="admin" 
            size="sm"
            onClick={() => {
              // Navegar a vista de planes de cuidado
              const ev: any = new CustomEvent('openPlanesCuidado', { 
                detail: { paciente, familia } 
              });
              window.dispatchEvent(ev);
            }}
          >
            Plan de Cuidado
          </ResponsiveButton>
          <ResponsiveButton 
            variant="admin" 
            size="sm"
            onClick={() => {
              // Navegar a vista de demandas inducidas
              const ev: any = new CustomEvent('openDemandasInducidas', { 
                detail: { paciente, familia } 
              });
              window.dispatchEvent(ev);
            }}
          >
            Demandas Inducidas
          </ResponsiveButton>
        </div>
      </ResponsiveCard>
    </div>
  );
}

function ConsultasAsignadasView({ deviceType }: any) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [demandasInducidas, setDemandasInducidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'consultas' | 'demandas'>('demandas');
  
  const pacientes = [
    { id: 1, nombre: "María González", documento: "1030456789", edad: 45, estado: "Pendiente", hora: "09:30", urgente: false },
    { id: 2, nombre: "Carlos Rodríguez", documento: "1030567890", edad: 32, estado: "En curso", hora: "10:15", urgente: true },
    { id: 3, nombre: "Ana Martínez", documento: "1030678901", edad: 28, estado: "Completada", hora: "11:00", urgente: false }
  ];

  const loadDemandasInducidas = async () => {
    try {
      setLoading(true);
      const user = AuthService.getCurrentUser();
      if (user?.id) {
        const data = await AuthService.getDemandasAsignadas(Number(user.id));
        setDemandasInducidas(data);
      }
    } catch (error) {
      console.error('Error cargando demandas inducidas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandasInducidas();
  }, []);

  if (selectedPatient) {
    return <HistoriaClinicaView patient={selectedPatient} onBack={() => setSelectedPatient(null)} deviceType={deviceType} />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-900">Consultas Médicas</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex space-x-1 bg-stone-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setActiveTab('demandas')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'demandas'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Demandas Inducidas
          </button>
          <button
            onClick={() => setActiveTab('consultas')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'consultas'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Consultas Programadas
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'demandas' ? (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bondi-500 mx-auto"></div>
                <span className="ml-3 text-stone-600">Cargando demandas...</span>
              </div>
            ) : demandasInducidas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-stone-500 mb-2">No hay demandas inducidas asignadas</div>
                <div className="text-xs text-stone-400">
                  Las demandas inducidas aparecerán aquí cuando te sean asignadas
                </div>
              </div>
            ) : (
              demandasInducidas.map((demanda) => (
                <button
                  key={demanda.demanda_id}
                  onClick={() => setSelectedPatient({
                    id: demanda.paciente_id,
                    nombre: `${demanda.primer_nombre} ${demanda.primer_apellido}`,
                    documento: demanda.numero_documento,
                    demanda: demanda
                  })}
                  className="w-full p-4 bg-stone-50 rounded-xl text-left hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-stone-900">
                          {demanda.primer_nombre} {demanda.primer_apellido}
                        </h4>
                        <ResponsiveBadge tone="admin">Demanda Inducida</ResponsiveBadge>
                      </div>
                      <p className="text-sm text-stone-500 mb-2">
                        {demanda.numero_documento} • Familia {demanda.apellido_principal}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">
                          {new Date(demanda.fecha_demanda).toLocaleDateString()}
                        </span>
                        <ResponsiveBadge tone={
                          demanda.estado === 'Realizada' ? 'health' :
                          demanda.estado === 'Asignada' ? 'admin' : 'warning'
                        }>
                          {demanda.estado}
                        </ResponsiveBadge>
                      </div>
                      
                      {demanda.diligenciamiento && demanda.diligenciamiento.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-stone-500 mb-1">Diligenciamiento:</div>
                          <div className="text-sm text-stone-700">
                            {demanda.diligenciamiento.slice(0, 2).join(', ')}
                            {demanda.diligenciamiento.length > 2 && ` +${demanda.diligenciamiento.length - 2} más`}
                          </div>
                        </div>
                      )}
                      
                      {demanda.remision_a && demanda.remision_a.length > 0 && (
                        <div>
                          <div className="text-xs text-stone-500 mb-1">Remisión a:</div>
                          <div className="text-sm text-stone-700">
                            {demanda.remision_a.slice(0, 2).join(', ')}
                            {demanda.remision_a.length > 2 && ` +${demanda.remision_a.length - 2} más`}
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {pacientes.map((paciente) => (
              <button
                key={paciente.id}
                onClick={() => setSelectedPatient(paciente)}
                className="w-full p-4 bg-stone-50 rounded-xl text-left hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-stone-900">{paciente.nombre}</h4>
                      {paciente.urgente && <ResponsiveBadge tone="rose">Urgente</ResponsiveBadge>}
                    </div>
                    <p className="text-sm text-stone-500 mb-2">{paciente.documento} • {paciente.edad} años</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span className="text-sm text-stone-600">{paciente.hora}</span>
                      <ResponsiveBadge tone={
                        paciente.estado === 'Completada' ? 'health' :
                        paciente.estado === 'En curso' ? 'admin' : 'warning'
                      }>
                        {paciente.estado}
                      </ResponsiveBadge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </ResponsiveCard>
    </div>
  );
}

function HistoriaClinicaView({ patient, onBack, deviceType }: any) {
  const [activeTab, setActiveTab] = useState("consulta");
  
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header del paciente */}
      <ResponsiveCard>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-stone-100">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-stone-900">{patient.nombre}</h3>
            <p className="text-sm text-stone-500">{patient.documento} • {patient.edad} años</p>
          </div>
          <ResponsiveBadge tone={patient.urgente ? "rose" : "blue"}>
            {patient.urgente ? "Urgente" : "Regular"}
          </ResponsiveBadge>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
          {[
            { key: "consulta", label: "Consulta" },
            { key: "receta", label: "Receta" },
            { key: "examenes", label: "Exámenes" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ResponsiveCard>

      {/* Contenido según tab activo */}
      {activeTab === "consulta" && <ConsultaFormView deviceType={deviceType} />}
      {activeTab === "receta" && <RecetaFormView deviceType={deviceType} />}
      {activeTab === "examenes" && <ExamenesFormView deviceType={deviceType} />}
    </div>
  );
}

function ConsultaFormView({ deviceType }: any) {
  return (
    <ResponsiveCard>
      <h4 className="font-semibold text-stone-900 mb-4">Historia Clínica</h4>
      <div className="space-y-4">
        <ResponsiveField label="Motivo de consulta" required>
          <ResponsiveInput placeholder="Describe el motivo principal..." />
        </ResponsiveField>
        
        <ResponsiveField label="Enfermedad actual">
          <textarea
            className="w-full px-3 py-2 md:py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base resize-none"
            rows={3}
            placeholder="Inicio, duración, características..."
          />
        </ResponsiveField>
        
        <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <ResponsiveField label="Presión arterial">
            <ResponsiveInput placeholder="120/80" />
          </ResponsiveField>
          <ResponsiveField label="Frecuencia cardíaca">
            <ResponsiveInput placeholder="72 lpm" />
          </ResponsiveField>
        </div>
        
        <ResponsiveField label="Examen físico">
          <textarea
            className="w-full px-3 py-2 md:py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base resize-none"
            rows={3}
            placeholder="Hallazgos relevantes..."
          />
        </ResponsiveField>
        
        <ResponsiveField label="Diagnóstico principal (CIE-10)" required>
          <ResponsiveInput placeholder="Ej: J00 - Rinofaringitis aguda" />
        </ResponsiveField>
        
        <ResponsiveField label="Plan de tratamiento">
          <textarea
            className="w-full px-3 py-2 md:py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base resize-none"
            rows={3}
            placeholder="Tratamiento, educación, controles..."
          />
        </ResponsiveField>
        
        {/* Botones de acción */}
        {deviceType === 'mobile' && (
          <div className="flex gap-3 pt-4">
            <ResponsiveButton variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Foto
            </ResponsiveButton>
            <ResponsiveButton variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <Mic className="w-4 h-4" />
              Audio
            </ResponsiveButton>
          </div>
        )}
        
        <div className={`flex gap-3 ${deviceType === 'mobile' ? 'flex-col' : 'flex-row'}`}>
          <ResponsiveButton variant="secondary" className={`${deviceType === 'mobile' ? 'w-full' : 'flex-1'} flex items-center justify-center gap-2`}>
            <Save className="w-4 h-4" />
            Guardar
          </ResponsiveButton>
          <ResponsiveButton className={`${deviceType === 'mobile' ? 'w-full' : 'flex-1'} flex items-center justify-center gap-2`}>
            <Send className="w-4 h-4" />
            Finalizar
          </ResponsiveButton>
        </div>
      </div>
    </ResponsiveCard>
  );
}

function RecetaFormView({ deviceType }: any) {
  const [medicamentos, setMedicamentos] = useState([
    { id: 1, nombre: "Paracetamol 500mg", dosis: "1 tableta", frecuencia: "Cada 8 horas", dias: "5" }
  ]);
  
  return (
    <ResponsiveCard>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-stone-900">Recetario Digital</h4>
        <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3 mb-4">
        {medicamentos.map((med) => (
          <div key={med.id} className="p-3 bg-stone-50 rounded-lg">
            <div className="font-medium text-stone-900">{med.nombre}</div>
            <div className="text-sm text-stone-600 mt-1">
              {med.dosis} • {med.frecuencia} • {med.dias} días
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <ResponsiveField label="Agregar medicamento">
          <ResponsiveInput placeholder="Nombre del medicamento..." />
        </ResponsiveField>
        
        <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <ResponsiveField label="Dosis">
            <ResponsiveInput placeholder="1 tableta" />
          </ResponsiveField>
          <ResponsiveField label="Frecuencia">
            <ResponsiveInput placeholder="Cada 8h" />
          </ResponsiveField>
        </div>
        
        <ResponsiveButton className="w-full">Agregar a receta</ResponsiveButton>
        
        <div className={`flex gap-3 ${deviceType === 'mobile' ? 'flex-col' : 'flex-row'}`}>
          <ResponsiveButton variant="secondary" className="flex-1">
            Vista previa
          </ResponsiveButton>
          <ResponsiveButton className="flex-1">
            Imprimir
          </ResponsiveButton>
        </div>
      </div>
    </ResponsiveCard>
  );
}

function ExamenesFormView({ deviceType }: any) {
  return (
    <ResponsiveCard>
      <h4 className="font-semibold text-stone-900 mb-4">Órdenes de Exámenes</h4>
      <div className="space-y-4">
        <ResponsiveField label="Tipo de examen" required>
          <ResponsiveSelect options={[
            { value: "", label: "Seleccionar examen" },
            { value: "hemograma", label: "Cuadro hemático completo" },
            { value: "glicemia", label: "Glicemia en ayunas" },
            { value: "orina", label: "Parcial de orina" },
            { value: "radiografia", label: "Radiografía de tórax" }
          ]} />
        </ResponsiveField>
        
        <ResponsiveField label="Justificación clínica" required>
          <textarea
            className="w-full px-3 py-2 md:py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base resize-none"
            rows={3}
            placeholder="Justificación médica para el examen..."
          />
        </ResponsiveField>
        
        <ResponsiveField label="Prioridad">
          <ResponsiveSelect options={[
            { value: "rutinaria", label: "Rutinaria" },
            { value: "urgente", label: "Urgente" },
            { value: "prioritaria", label: "Prioritaria" }
          ]} />
        </ResponsiveField>
        
        <div className={`flex gap-3 ${deviceType === 'mobile' ? 'flex-col' : 'flex-row'}`}>
          <ResponsiveButton variant="secondary" className="flex-1">
            Guardar orden
          </ResponsiveButton>
          <ResponsiveButton className="flex-1">
            Generar e imprimir
          </ResponsiveButton>
        </div>
      </div>
    </ResponsiveCard>
  );
}

function BDPacientesView({ deviceType }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("documento");
  
  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <h3 className="font-semibold text-stone-900 mb-4">Buscar Pacientes</h3>
        
        <div className="space-y-4">
          <ResponsiveField label="Tipo de búsqueda">
            <ResponsiveSelect 
              value={searchType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchType(e.target.value)}
              options={[
                { value: "documento", label: "Por documento" },
                { value: "nombre", label: "Por nombre" },
                { value: "familia", label: "Por familia" }
              ]} 
            />
          </ResponsiveField>
          
          <ResponsiveField label="Término de búsqueda">
            <ResponsiveInput 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder={
                searchType === "documento" ? "Número de documento..." :
                searchType === "nombre" ? "Nombre del paciente..." :
                "Apellido de familia..."
              }
            />
          </ResponsiveField>
          
          <ResponsiveButton className="w-full flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Buscar
          </ResponsiveButton>
        </div>
      </ResponsiveCard>
      
      {searchTerm && (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-3">Resultados</h4>
          <div className="text-center py-8 text-stone-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-stone-300" />
            <p>Ingrese un término de búsqueda</p>
          </div>
        </ResponsiveCard>
      )}
    </div>
  );
}

function CrearFamiliaView({ deviceType }: any) {
  const [form, setForm] = useState({
    apellido_principal: '',
    direccion: '',
    barrio_vereda: '',
    municipio: '',
    telefono_contacto: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const user = AuthService.getCurrentUser();

  const handleChange = (field: string) => (e: any) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await AuthService.crearFamilia({
        apellido_principal: form.apellido_principal,
        direccion: form.direccion,
        barrio_vereda: form.barrio_vereda || null,
        municipio: form.municipio,
        telefono_contacto: form.telefono_contacto || null,
        creado_por_uid: Number(user?.id)
      });
      setForm({ apellido_principal: '', direccion: '', barrio_vereda: '', municipio: '', telefono_contacto: '' });
      alert('Familia creada exitosamente');
    } catch (e: any) {
      setSubmitError(e?.message || 'Error al guardar la familia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <h3 className="font-semibold text-stone-900 mb-4">Nueva Familia</h3>
        
        <div className="space-y-4">
          <ResponsiveField label="Jefe de familia" required>
            <ResponsiveInput placeholder="Apellido principal" value={form.apellido_principal} onChange={handleChange('apellido_principal')} />
          </ResponsiveField>
          
          <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <ResponsiveField label="Barrio/Vereda">
              <ResponsiveInput placeholder="Barrio o vereda" value={form.barrio_vereda} onChange={handleChange('barrio_vereda')} />
            </ResponsiveField>
            <ResponsiveField label="Municipio" required>
              <ResponsiveInput placeholder="Municipio" value={form.municipio} onChange={handleChange('municipio')} />
            </ResponsiveField>
          </div>
          
          <ResponsiveField label="Dirección" required>
            <ResponsiveInput placeholder="Dirección completa" value={form.direccion} onChange={handleChange('direccion')} />
          </ResponsiveField>
          
          <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <ResponsiveField label="Teléfono">
              <ResponsiveInput type="tel" placeholder="Teléfono" value={form.telefono_contacto} onChange={handleChange('telefono_contacto')} />
            </ResponsiveField>
            <div />
          </div>
          
          {submitError && <div className="text-sm text-red-600">{submitError}</div>}
          
          <div className={`flex gap-3 pt-4 ${deviceType === 'mobile' ? 'flex-col' : 'flex-row'}`}>
            <ResponsiveButton variant="secondary" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </ResponsiveButton>
            <ResponsiveButton className="flex-1">
              Crear Caracterización
            </ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  );
}

// Vista: Formulario de Caracterización
function FormularioCaracterizacionView({ familia, caracterizacionExistente, onSave, onCancel }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<any>({
    // Datos familiares
    numero_ficha: '',
    zona: 'Urbana',
    territorio: '',
    estrato: null,
    tipo_familia: '',
    riesgo_familiar: '',
    fecha_caracterizacion: new Date().toISOString().split('T')[0],
    info_vivienda: {
      funcionalidad: [],
      sobrecarga: [],
      ecomapa: [],
      observaciones: '',
      te_quiere: false,
      nn_discapacidad_adulto_mayor_enfermedad: false
    },
    situaciones_proteccion: [],
    condiciones_salud_publica: [],
    practicas_cuidado: {
      hab_saludables: false,
      rec_socioemoc: false,
      cuidado_y_protec: false,
      relaciones_sanas: false,
      red_colect: false,
      autonomia_adu_mayor: false,
      pract_prevencion_e: false,
      prac_saberes_anc: false,
      prac_derech: false
    },
    // Datos de integrantes
    integrantes: []
  });
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);

  // Cargar datos existentes y pacientes
  useEffect(() => {
    const loadData = async () => {
      try {
        const pacientesData = await AuthService.getPacientesByFamilia(familia.familia_id);
        setPacientes(pacientesData);
        
        // Inicializar formulario de integrantes
        const integrantesForm = pacientesData.map((p: any) => ({
          paciente_id: p.paciente_id,
          fecha_caracterizacion: new Date().toISOString().split('T')[0],
          rol_familiar: '',
          ocupacion: '',
          nivel_educativo: '',
          grupo_poblacional: '',
          regimen_afiliacion: '',
          pertenencia_etnica: '',
          discapacidad: [],
          victima_violencia: false,
          datos_pyp: {},
          datos_salud: {}
        }));
        
        setFormData(prev => ({
          ...prev,
          integrantes: integrantesForm
        }));
        
        // Si hay caracterización existente, cargarla
        if (caracterizacionExistente?.tiene_caracterizacion) {
          const familiaData = caracterizacionExistente.familia;
          setFormData(prev => ({
            ...prev,
            numero_ficha: familiaData.numero_ficha || '',
            zona: familiaData.zona || 'Urbana',
            territorio: familiaData.territorio || '',
            estrato: familiaData.estrato || null,
            tipo_familia: familiaData.tipo_familia || '',
            riesgo_familiar: familiaData.riesgo_familiar || '',
            fecha_caracterizacion: familiaData.fecha_caracterizacion || new Date().toISOString().split('T')[0],
            info_vivienda: familiaData.info_vivienda || prev.info_vivienda,
            situaciones_proteccion: familiaData.situaciones_proteccion || [],
            condiciones_salud_publica: familiaData.condiciones_salud_publica || [],
            practicas_cuidado: familiaData.practicas_cuidado || prev.practicas_cuidado
          }));
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
  }, [familia.familia_id, caracterizacionExistente]);

  const tabs = [
    { key: 'ubicacion', label: 'Ubicación', icon: MapPin },
    { key: 'estructura', label: 'Estructura Familiar', icon: Users },
    { key: 'proteccion', label: 'Protección y Salud', icon: Shield },
    { key: 'practicas', label: 'Prácticas de Cuidado', icon: Heart },
    { key: 'integrantes', label: 'Integrantes', icon: User }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const payload = {
        familia_id: familia.familia_id,
        datos_familia: {
          numero_ficha: formData.numero_ficha,
          zona: formData.zona,
          territorio: formData.territorio,
          estrato: formData.estrato,
          tipo_familia: formData.tipo_familia,
          riesgo_familiar: formData.riesgo_familiar,
          fecha_caracterizacion: formData.fecha_caracterizacion,
          info_vivienda: formData.info_vivienda,
          situaciones_proteccion: formData.situaciones_proteccion,
          condiciones_salud_publica: formData.condiciones_salud_publica,
          practicas_cuidado: formData.practicas_cuidado
        },
        integrantes: formData.integrantes
      };
      
      await AuthService.crearCaracterizacion(payload);
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error guardando caracterización:', error);
      alert('Error al guardar la caracterización. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateIntegrante = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      integrantes: prev.integrantes.map((integrante, i) => 
        i === index ? { ...integrante, [field]: value } : integrante
      )
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Ubicación
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveField label="Número de Ficha">
                <ResponsiveInput
                  value={formData.numero_ficha}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, numero_ficha: e.target.value }))}
                  placeholder="Ej: 14250"
                />
              </ResponsiveField>
              <ResponsiveField label="Zona">
                <ResponsiveSelect
                  value={formData.zona}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, zona: e.target.value }))}
                  options={[
                    { value: 'Urbana', label: 'Urbana' },
                    { value: 'Rural', label: 'Rural' }
                  ]}
                />
              </ResponsiveField>
              <ResponsiveField label="Territorio/Comuna">
                <ResponsiveInput
                  value={formData.territorio}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, territorio: e.target.value }))}
                  placeholder="Ej: Comuna 19"
                />
              </ResponsiveField>
              <ResponsiveField label="Estrato">
                <ResponsiveInput
                  type="number"
                  value={formData.estrato || ''}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, estrato: parseInt(e.target.value) || null }))}
                  placeholder="1-6"
                />
              </ResponsiveField>
            </div>
          </div>
        );

      case 1: // Estructura Familiar
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveField label="Tipo de Familia">
                <ResponsiveSelect
                  value={formData.tipo_familia}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, tipo_familia: e.target.value }))}
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: 'Biparental', label: 'Biparental' },
                    { value: 'Monoparental', label: 'Monoparental' },
                    { value: 'Ext. Bipar', label: 'Extendida Biparental' },
                    { value: 'Ext. Monop', label: 'Extendida Monoparental' },
                    { value: 'Comp. Bipa', label: 'Compuesta Biparental' },
                    { value: 'Comp. Monop', label: 'Compuesta Monoparental' },
                    { value: 'Uniper', label: 'Unipersonal' }
                  ]}
                />
              </ResponsiveField>
              <ResponsiveField label="Riesgo Familiar">
                <ResponsiveSelect
                  value={formData.riesgo_familiar}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, riesgo_familiar: e.target.value }))}
                  options={[
                    { value: '', label: 'Seleccionar...' },
                    { value: '1. Ausencia', label: '1. Ausencia' },
                    { value: '2. Sobrecarga', label: '2. Sobrecarga' },
                    { value: '3. Sobrecarga Intensa', label: '3. Sobrecarga Intensa' },
                    { value: '0 a 3 Disfunción', label: '0 a 3 Disfunción' },
                    { value: '4 a 6 Func. Mode', label: '4 a 6 Funcional Moderada' },
                    { value: '7 a 10 Alta Func', label: '7 a 10 Alta Funcionalidad' }
                  ]}
                />
              </ResponsiveField>
            </div>
            
            <ResponsiveField label="Observaciones">
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={3}
                value={formData.info_vivienda.observaciones}
                onChange={(e: any) => updateFormData('info_vivienda', 'observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
              />
            </ResponsiveField>
          </div>
        );

      case 2: // Protección y Salud
        return (
          <div className="space-y-4">
            <ResponsiveField label="Situaciones de Especial Protección">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['NNA', 'GESTANTES', 'ADULTOS MAYORES', 'TB', 'LEPRA', 'ESCABIOSIS', 'MALARIA', 'DENGUE', 'CHAGAS'].map(option => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.situaciones_proteccion.includes(option)}
                      onChange={(e: any) => {
                        const newValue = e.target.checked
                          ? [...formData.situaciones_proteccion, option]
                          : formData.situaciones_proteccion.filter((item: string) => item !== option);
                        setFormData(prev => ({ ...prev, situaciones_proteccion: newValue }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </ResponsiveField>
          </div>
        );

      case 3: // Prácticas de Cuidado
        return (
          <div className="space-y-4">
            <ResponsiveField label="Prácticas Protectoras">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.practicas_cuidado).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e: any) => updateFormData('practicas_cuidado', key, e.target.checked)}
                    />
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </ResponsiveField>
          </div>
        );

      case 4: // Integrantes
        return (
          <div className="space-y-4">
            {pacientes.map((paciente, index) => (
              <ResponsiveCard key={paciente.paciente_id}>
                <h5 className="font-medium text-stone-900 mb-3">
                  {paciente.primer_nombre} {paciente.primer_apellido}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResponsiveField label="Rol Familiar">
                    <ResponsiveSelect
                      value={formData.integrantes[index]?.rol_familiar || ''}
                      onChange={(e: any) => updateIntegrante(index, 'rol_familiar', e.target.value)}
                      options={[
                        { value: '', label: 'Seleccionar...' },
                        { value: 'Jefe', label: 'Jefe' },
                        { value: 'Cónyuge', label: 'Cónyuge' },
                        { value: 'Hijo', label: 'Hijo' },
                        { value: 'Hermano', label: 'Hermano' },
                        { value: 'Padre', label: 'Padre' },
                        { value: 'Otro', label: 'Otro' }
                      ]}
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Ocupación">
                    <ResponsiveInput
                      value={formData.integrantes[index]?.ocupacion || ''}
                      onChange={(e: any) => updateIntegrante(index, 'ocupacion', e.target.value)}
                      placeholder="Ocupación actual"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Nivel Educativo">
                    <ResponsiveInput
                      value={formData.integrantes[index]?.nivel_educativo || ''}
                      onChange={(e: any) => updateIntegrante(index, 'nivel_educativo', e.target.value)}
                      placeholder="Ej: Primaria, Bachillerato, Universitario"
                    />
                  </ResponsiveField>
                  <ResponsiveField label="Grupo Poblacional">
                    <ResponsiveSelect
                      value={formData.integrantes[index]?.grupo_poblacional || ''}
                      onChange={(e: any) => updateIntegrante(index, 'grupo_poblacional', e.target.value)}
                      options={[
                        { value: '', label: 'Seleccionar...' },
                        { value: 'NNA', label: 'Niño, Niña, Adolescente' },
                        { value: 'Gestante', label: 'Gestante' },
                        { value: 'Adulto Mayor', label: 'Adulto Mayor' }
                      ]}
                    />
                  </ResponsiveField>
                </div>
              </ResponsiveCard>
            ))}
          </div>
        );

      default:
        return <div>Contenido no disponible</div>;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <ResponsiveCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900">Caracterización de Familia</h3>
            <div className="text-sm text-stone-600">{familia.apellido_principal}</div>
          </div>
          <div className="flex gap-3">
            <ResponsiveButton variant="secondary" onClick={onCancel}>
              Cancelar
            </ResponsiveButton>
            <ResponsiveButton onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Caracterización'}
            </ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>

      {/* Tabs */}
      <ResponsiveCard>
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1 mb-6">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(index)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === index
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido del tab activo */}
        {renderTabContent()}
      </ResponsiveCard>
    </div>
  );
}

// Vista: Plan de Cuidado Familiar
function PlanCuidadoView({ paciente, familia, onBack }: any) {
  const [planes, setPlanes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    fecha_entrega: new Date().toISOString().split('T')[0],
    plan_asociado: [],
    condicion_identificada: '',
    logro_salud: '',
    cuidados_salud: '',
    demandas_inducidas_desc: '',
    educacion_salud: '',
    estado: 'Activo',
    fecha_aceptacion: ''
  });

  const loadPlanes = async () => {
    try {
      setLoading(true);
      const data = await AuthService.getPlanesCuidadoPaciente(paciente.paciente_id);
      setPlanes(data);
    } catch (error) {
      console.error('Error cargando planes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPlanes(); }, [paciente.paciente_id]);

  const handleSave = async () => {
    try {
      const user = AuthService.getCurrentUser();
      await AuthService.crearPlanCuidado({
        ...form,
        familia_id: familia.familia_id,
        paciente_principal_id: paciente.paciente_id,
        creado_por_uid: Number(user?.id) || 1
      });
      setShowForm(false);
      await loadPlanes();
    } catch (error) {
      console.error('Error guardando plan:', error);
      alert('Error al guardar el plan de cuidado');
    }
  };

  const togglePlanAsociado = (opcion: string) => {
    setForm(prev => ({
      ...prev,
      plan_asociado: prev.plan_asociado.includes(opcion)
        ? prev.plan_asociado.filter((item: string) => item !== opcion)
        : [...prev.plan_asociado, opcion]
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <ResponsiveCard>
          <div className="text-center py-8">
            <div className="text-sm text-stone-500">Cargando planes de cuidado...</div>
          </div>
        </ResponsiveCard>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <ResponsiveCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900">Plan de Cuidado Familiar</h3>
            <div className="text-sm text-stone-600">
              {paciente.primer_nombre} {paciente.primer_apellido} • {familia.apellido_principal}
            </div>
          </div>
          <div className="flex gap-3">
            <ResponsiveButton variant="secondary" onClick={onBack}>
              Volver
            </ResponsiveButton>
            <ResponsiveButton onClick={() => setShowForm(true)}>
              Nuevo Plan
            </ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>

      {/* Lista de planes existentes */}
      {planes.length > 0 ? (
        <div className="space-y-4">
          {planes.map((plan) => (
            <ResponsiveCard key={plan.plan_id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-stone-900">{plan.condicion_identificada}</h4>
                  <div className="text-sm text-stone-600">
                    {plan.estado}
                  </div>
                  <div className="text-xs text-stone-500">
                    Entregado: {new Date(plan.fecha_entrega).toLocaleDateString()}
                    {plan.fecha_aceptacion && (
                      <> • Aceptado: {new Date(plan.fecha_aceptacion).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
                <ResponsiveBadge tone={plan.estado === 'Activo' ? 'health' : 'neutral'}>
                  {plan.estado}
                </ResponsiveBadge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-stone-500">Logro en salud a establecerse</div>
                  <div className="text-sm text-stone-900">{plan.logro_salud}</div>
                </div>
                
                <div>
                  <div className="text-xs text-stone-500">Cuidados de la salud</div>
                  <div className="text-sm text-stone-900">{plan.cuidados_salud}</div>
                </div>
                
                {plan.plan_asociado && plan.plan_asociado.length > 0 && (
                  <div>
                    <div className="text-xs text-stone-500">Plan familiar asociado</div>
                    <div className="text-sm text-stone-900">
                      {plan.plan_asociado.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </ResponsiveCard>
          ))}
        </div>
      ) : (
        <ResponsiveCard>
          <div className="text-center py-8">
            <div className="text-sm text-stone-500 mb-2">No hay planes de cuidado registrados</div>
            <div className="text-xs text-stone-400">
              Crea el primer plan de cuidado para este paciente
            </div>
          </div>
        </ResponsiveCard>
      )}

      {/* Formulario de nuevo plan */}
      {showForm && (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-4">Nuevo Plan de Cuidado</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveField label="Fecha de Entrega" required>
                <ResponsiveInput
                  type="date"
                  value={form.fecha_entrega}
                  onChange={(e: any) => setForm(prev => ({ ...prev, fecha_entrega: e.target.value }))}
                />
              </ResponsiveField>
              <ResponsiveField label="Fecha de Aceptación">
                <ResponsiveInput
                  type="date"
                  value={form.fecha_aceptacion}
                  onChange={(e: any) => setForm(prev => ({ ...prev, fecha_aceptacion: e.target.value }))}
                />
              </ResponsiveField>
            </div>

            <ResponsiveField label="Condición/Situación Identificada" required>
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={3}
                value={form.condicion_identificada}
                onChange={(e: any) => setForm(prev => ({ ...prev, condicion_identificada: e.target.value }))}
                placeholder="Describe la condición o situación identificada..."
              />
            </ResponsiveField>

            <ResponsiveField label="Logro en salud a establecerse" required>
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={3}
                value={form.logro_salud}
                onChange={(e: any) => setForm(prev => ({ ...prev, logro_salud: e.target.value }))}
                placeholder="Describe el logro en salud que se quiere establecer..."
              />
            </ResponsiveField>

            <ResponsiveField label="Cuidados de la salud">
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={3}
                value={form.cuidados_salud}
                onChange={(e: any) => setForm(prev => ({ ...prev, cuidados_salud: e.target.value }))}
                placeholder="Describe los cuidados de salud necesarios..."
              />
            </ResponsiveField>

            <ResponsiveField label="Demandas inducidas">
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={2}
                value={form.demandas_inducidas_desc}
                onChange={(e: any) => setForm(prev => ({ ...prev, demandas_inducidas_desc: e.target.value }))}
                placeholder="Describe las demandas inducidas..."
              />
            </ResponsiveField>

            <ResponsiveField label="Educación en salud">
              <textarea
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-eden-500 focus:border-eden-500 text-sm resize-none"
                rows={2}
                value={form.educacion_salud}
                onChange={(e: any) => setForm(prev => ({ ...prev, educacion_salud: e.target.value }))}
                placeholder="Describe la educación en salud necesaria..."
              />
            </ResponsiveField>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Plan familiar asociado</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Hábitos saludables',
                  'Cuidado gestante lactante',
                  'Nutrición infantil y desparasitación',
                  'Envejecimiento saludable',
                  'Planificación familiar',
                  'Enfermedades crónicas',
                  'Cuidado menor de 5 años',
                  'Prevención dengue',
                  'EDA',
                  'IRA',
                  'Osteomuscular',
                  'ITS',
                  'Salud sexual en la adolescencia',
                  'Nutrición adultos',
                  'Salud mental',
                  'Prevención violencias',
                  'Otros'
                ].map((opcion) => (
                  <label key={opcion} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-stone-300"
                      checked={form.plan_asociado.includes(opcion)}
                      onChange={() => togglePlanAsociado(opcion)}
                    />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <ResponsiveButton variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton onClick={handleSave}>
                Guardar Plan
              </ResponsiveButton>
            </div>
          </div>
        </ResponsiveCard>
      )}
    </div>
  );
}

// Vista: Demandas Inducidas
function DemandasInducidasView({ paciente, familia, onBack }: any) {
  const [demandas, setDemandas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    numero_formulario: '',
    fecha_demanda: new Date().toISOString().split('T')[0],
    diligenciamiento: [],
    remision_a: [],
    estado: 'Pendiente',
    asignado_a_uid: null,
    seguimiento: {}
  });

  const loadDemandas = async () => {
    try {
      setLoading(true);
      const data = await AuthService.getDemandasInducidasPaciente(paciente.paciente_id);
      setDemandas(data);
    } catch (error) {
      console.error('Error cargando demandas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandas();
  }, [paciente.paciente_id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDemanda = async () => {
    try {
      const newDemanda = {
        ...form,
        paciente_id: paciente.paciente_id,
        solicitado_por_uid: 1 // TODO: Reemplazar con el UID del usuario logueado
      };
      await AuthService.crearDemandaInducida(newDemanda);
      setShowForm(false);
      setForm({
        numero_formulario: '',
        fecha_demanda: new Date().toISOString().split('T')[0],
        diligenciamiento: [],
        remision_a: [],
        estado: 'Pendiente',
        asignado_a_uid: null,
        seguimiento: {}
      });
      loadDemandas();
    } catch (error) {
      console.error('Error guardando demanda:', error);
      alert('Error guardando demanda. Verifique la consola.');
    }
  };

  if (loading) {
    return (
      <ResponsiveCard>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bondi-500"></div>
          <span className="ml-3 text-stone-600">Cargando demandas...</span>
        </div>
      </ResponsiveCard>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <ResponsiveCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-900">Demandas Inducidas</h3>
            <div className="text-sm text-stone-600">
              {paciente.primer_nombre} {paciente.primer_apellido} • {familia.apellido_principal}
            </div>
          </div>
          <div className="flex gap-3">
            <ResponsiveButton variant="secondary" onClick={onBack}>
              Volver
            </ResponsiveButton>
            <ResponsiveButton onClick={() => setShowForm(true)}>
              Crear Demanda
            </ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>

      {showForm && (
        <ResponsiveCard>
          <h4 className="font-semibold text-stone-900 mb-4">Nueva Demanda Inducida</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveField label="Número de Formulario">
                <ResponsiveInput
                  type="text"
                  name="numero_formulario"
                  value={form.numero_formulario}
                  onChange={handleFormChange}
                  placeholder="Ej: 29251"
                />
              </ResponsiveField>
              <ResponsiveField label="Fecha de Demanda">
                <ResponsiveInput
                  type="date"
                  name="fecha_demanda"
                  value={form.fecha_demanda}
                  onChange={handleFormChange}
                />
              </ResponsiveField>
              <ResponsiveField label="Estado">
                <ResponsiveSelect
                  name="estado"
                  value={form.estado}
                  onChange={handleFormChange}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Asignada">Asignada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Cancelada">Cancelada</option>
                </ResponsiveSelect>
              </ResponsiveField>
              <ResponsiveField label="Asignado a (UID)">
                <ResponsiveInput
                  type="number"
                  name="asignado_a_uid"
                  value={form.asignado_a_uid || ''}
                  onChange={handleFormChange}
                  placeholder="Ej: 1 (ID del profesional)"
                />
              </ResponsiveField>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Diligenciamiento</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Atención para el cuidado preconcepcional',
                  'Planificación familiar',
                  'Control prenatal',
                  'Control puerperal',
                  'Crecimiento y desarrollo',
                  'Vacunación',
                  'Nutrición infantil',
                  'Salud oral',
                  'Salud mental',
                  'Enfermedades crónicas'
                ].map((opcion) => (
                  <label key={opcion} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-stone-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({
                            ...prev,
                            diligenciamiento: [...prev.diligenciamiento, opcion]
                          }));
                        } else {
                          setForm(prev => ({
                            ...prev,
                            diligenciamiento: prev.diligenciamiento.filter((item: string) => item !== opcion)
                          }));
                        }
                      }}
                    />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Remisión a</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Psicología',
                  'Trabajo social',
                  'Medicina general',
                  'Fisioterapia',
                  'Nutrición',
                  'Enfermería',
                  'Fonoaudiología',
                  'Terapia respiratoria'
                ].map((opcion) => (
                  <label key={opcion} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-stone-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({
                            ...prev,
                            remision_a: [...prev.remision_a, opcion]
                          }));
                        } else {
                          setForm(prev => ({
                            ...prev,
                            remision_a: prev.remision_a.filter((item: string) => item !== opcion)
                          }));
                        }
                      }}
                    />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <ResponsiveButton variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton onClick={handleSaveDemanda}>
                Guardar Demanda
              </ResponsiveButton>
            </div>
          </div>
        </ResponsiveCard>
      )}

      <ResponsiveCard>
        <h4 className="font-semibold text-stone-900 mb-3">Demandas Registradas</h4>
        {demandas.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-sm text-stone-500 mb-2">No hay demandas inducidas registradas</div>
            <div className="text-xs text-stone-400">
              Crea la primera demanda inducida para este paciente
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {demandas.map((demanda) => (
              <div key={demanda.demanda_id} className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-stone-900">
                      Formulario #{demanda.numero_formulario || demanda.demanda_id}
                    </div>
                    <div className="text-sm text-stone-600">
                      Fecha: {new Date(demanda.fecha_demanda).toLocaleDateString()}
                    </div>
                  </div>
                  <ResponsiveBadge tone={demanda.estado === 'Realizada' ? 'success' : demanda.estado === 'Pendiente' ? 'warning' : 'info'}>
                    {demanda.estado}
                  </ResponsiveBadge>
                </div>
                
                {demanda.diligenciamiento && demanda.diligenciamiento.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-stone-500 mb-1">Diligenciamiento:</div>
                    <div className="text-sm text-stone-700">
                      {demanda.diligenciamiento.join(', ')}
                    </div>
                  </div>
                )}
                
                {demanda.remision_a && demanda.remision_a.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-stone-500 mb-1">Remisión a:</div>
                    <div className="text-sm text-stone-700">
                      {demanda.remision_a.join(', ')}
                    </div>
                  </div>
                )}
                
                {demanda.asignado_a_nombre && (
                  <div className="text-xs text-stone-500">
                    Asignado a: {demanda.asignado_a_nombre}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ResponsiveCard>
    </div>
  );
}

// Componente principal
export default function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [currentRole, setCurrentRole] = useState("medico");
  const [currentPage, setCurrentPage] = useState("inicio");
  const [selectedFamilia, setSelectedFamilia] = useState<any | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<any | null>(null);
  const [showPlanCuidado, setShowPlanCuidado] = useState(false);
  const [showDemandasInducidas, setShowDemandasInducidas] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const deviceType = useDeviceType();

  // Listeners para navegación
  useEffect(() => {
    const handlerFamilia = (e: any) => {
      setSelectedFamilia(e.detail);
      setCurrentPage('familia-detalle');
    };

    const handlerPlanesCuidado = (e: any) => {
      setSelectedPaciente(e.detail.paciente);
      setSelectedFamilia(e.detail.familia);
      setShowPlanCuidado(true);
    };

    const handlerDemandasInducidas = (e: any) => {
      setSelectedPaciente(e.detail.paciente);
      setSelectedFamilia(e.detail.familia);
      setShowDemandasInducidas(true);
    };

    window.addEventListener('openFamiliaDetalle', handlerFamilia as any);
    window.addEventListener('openPlanesCuidado', handlerPlanesCuidado as any);
    window.addEventListener('openDemandasInducidas', handlerDemandasInducidas as any);
    
    return () => {
      window.removeEventListener('openFamiliaDetalle', handlerFamilia as any);
      window.removeEventListener('openPlanesCuidado', handlerPlanesCuidado as any);
      window.removeEventListener('openDemandasInducidas', handlerDemandasInducidas as any);
    };
  }, []);
  
  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} isLoading={isLoading} />;
  }

  // Usar el rol del usuario autenticado
  const userRole = user?.role || currentRole;
  const roleConfig = USER_ROLES[userRole as keyof typeof USER_ROLES];
  const RoleIcon = roleConfig.icon;

  const renderPage = () => {
    // Manejar vistas especiales que no están en currentPage
    if (showPlanCuidado && selectedPaciente && selectedFamilia) {
      return (
        <PlanCuidadoView
          paciente={selectedPaciente}
          familia={selectedFamilia}
          onBack={() => {
            setShowPlanCuidado(false);
            setCurrentPage("paciente-detalle");
          }}
        />
      );
    }

    if (showDemandasInducidas && selectedPaciente && selectedFamilia) {
      return (
        <DemandasInducidasView
          paciente={selectedPaciente}
          familia={selectedFamilia}
          onBack={() => {
            setShowDemandasInducidas(false);
            setCurrentPage("paciente-detalle");
          }}
        />
      );
    }

    switch (currentPage) {
      case "inicio":
        return <InicioView currentRole={userRole} deviceType={deviceType} />;
      case "crear-familia":
        return <CrearFamiliaView deviceType={deviceType} />;
      case "familias":
        return <FamiliasView deviceType={deviceType} />;
      case "familia-detalle":
        return selectedFamilia ? (
          <DetalleFamiliaView
            familia={selectedFamilia}
            onBack={() => setCurrentPage("familias")}
            onShowCaracterizacion={(familia: any, caracterizacion: any) => {
              setSelectedFamilia({ ...familia, caracterizacion });
              setCurrentPage("caracterizacion");
            }}
            onShowPaciente={(paciente: any, familia: any) => {
              setSelectedPaciente(paciente);
              setSelectedFamilia(familia);
              setCurrentPage("paciente-detalle");
            }}
          />
        ) : (
          <ResponsiveCard>Seleccione una familia desde la lista.</ResponsiveCard>
        );
      case "paciente-detalle":
        return selectedPaciente && selectedFamilia ? (
          <DetallePacienteView
            paciente={selectedPaciente}
            familia={selectedFamilia}
            caracterizacion={null} // Se cargará desde el contexto de la familia
            onBack={() => setCurrentPage("familia-detalle")}
          />
        ) : (
          <ResponsiveCard>Error: Datos del paciente no disponibles.</ResponsiveCard>
        );
            case "caracterizacion":
              return selectedFamilia ? (
                <FormularioCaracterizacionView
                  familia={selectedFamilia}
                  caracterizacionExistente={selectedFamilia.caracterizacion}
                  onSave={() => {
                    setCurrentPage("familia-detalle");
                  }}
                  onCancel={() => {
                    setCurrentPage("familia-detalle");
                  }}
                />
              ) : (
                <ResponsiveCard>Error: Familia no seleccionada.</ResponsiveCard>
              );
      case "consultas-asignadas":
      case "terapias-asignadas":
        return <ConsultasAsignadasView deviceType={deviceType} />;
      case "bd-pacientes":
      case "bd-pacientes-agregada":
        return <BDPacientesView deviceType={deviceType} />;
      default:
        return (
          <ResponsiveCard>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                En desarrollo
              </h3>
              <p className="text-stone-600 text-sm">
                Esta sección estará disponible próximamente
              </p>
            </div>
          </ResponsiveCard>
        );
    }
  };

  // Vista móvil
  if (deviceType === 'mobile') {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Header móvil */}
        <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 rounded-lg hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100">
                <RoleIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-stone-500">APS</div>
                <div className="text-sm font-semibold text-stone-900">{roleConfig.name}</div>
              </div>
            </div>
            
            <UserProfile user={{ name: user?.name || '', role: userRole }} onLogout={logout} />
          </div>
        </header>

        {/* Contenido principal */}
        <main className="px-4 py-4 pb-20">
          {renderPage()}
        </main>

        {/* Navegación inferior */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-2">
          <div className="flex justify-around">
            {roleConfig.mainSections.slice(0, 4).map((section) => {
              const Icon = section.icon;
              const isActive = currentPage === section.key;
              return (
                <button
                  key={section.key}
                  onClick={() => setCurrentPage(section.key)}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                    isActive ? "text-emerald-600 bg-emerald-50" : "text-stone-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{section.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Menú lateral móvil */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
            <div className="w-80 h-full bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-stone-200">
                <h3 className="font-semibold text-stone-900">Menú</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Selector de rol */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Cambiar rol
                  </label>
                  <div className="p-3 bg-stone-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-stone-700">{roleConfig.name}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{user?.name}</div>
                  </div>
                </div>
                
                {/* Menú principal */}
                <div>
                  <h4 className="text-sm font-medium text-stone-700 mb-2">Menú Principal</h4>
                  <div className="space-y-1">
                    <MobileNavItem
                      label="Inicio"
                      icon={Home}
                      active={currentPage === "inicio"}
                      onClick={() => {
                        setCurrentPage("inicio");
                        setShowMobileMenu(false);
                      }}
                    />
                    {roleConfig.mainSections.map((section) => (
                      <MobileNavItem
                        key={section.key}
                        label={section.label}
                        icon={section.icon}
                        active={currentPage === section.key}
                        onClick={() => {
                          setCurrentPage(section.key);
                          setShowMobileMenu(false);
                        }}
                        badge={section.key === "consultas-asignadas" ? "3" : undefined}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Herramientas */}
                <div>
                  <h4 className="text-sm font-medium text-stone-700 mb-2">Herramientas</h4>
                  <div className="space-y-1">
                    {roleConfig.sidebarSections.map((section) => (
                      <MobileNavItem
                        key={section.key}
                        label={section.label}
                        icon={section.icon}
                        active={currentPage === section.key}
                        onClick={() => {
                          setCurrentPage(section.key);
                          setShowMobileMenu(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Cerrar sesión */}
                <div className="pt-4 border-t border-stone-200">
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista desktop y tablet
  return (
    <div className="min-h-screen bg-sinbad-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-sinbad-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-san-marino to-bondi-blue flex items-center justify-center shadow-soft">
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-eden-600">Programa APS</div>
              <div className="text-base font-semibold text-eden-800">Plataforma de Registro Clínico</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Selector de rol */}
            <div className="flex items-center gap-2 px-3 py-2 bg-san-marino-50 rounded-lg border border-san-marino-200">
              <RoleIcon className="w-4 h-4 text-san-marino-600" />
              <span className="text-sm font-medium text-san-marino-700">{roleConfig.name}</span>
            </div>
            <ResponsiveBadge tone="warning">Offline</ResponsiveBadge>
            <ResponsiveButton size="sm">Sincronizar</ResponsiveButton>
            <UserProfile user={{ name: user?.name || '', role: userRole }} onLogout={logout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl border border-sinbad-200 p-4 h-fit shadow-soft">
          <div className="space-y-1">
            <button
              onClick={() => setCurrentPage("inicio")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left transition-all ${
                currentPage === "inicio" ? "bg-san-marino-50 text-san-marino-700 border border-san-marino-200 shadow-soft" : "text-eden-600 hover:bg-sinbad-50 hover:text-san-marino-700"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </button>
            
            {/* Secciones principales */}
            <div className="pt-4">
              <h4 className="text-xs font-medium text-eden-500 uppercase tracking-wider mb-2 px-4">
                Menú Principal
              </h4>
              {roleConfig.mainSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setCurrentPage(section.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left transition-all ${
                      currentPage === section.key ? "bg-san-marino-50 text-san-marino-700 border border-san-marino-200 shadow-soft" : "text-eden-600 hover:bg-sinbad-50 hover:text-san-marino-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                    {section.key === "consultas-asignadas" && (
                      <ResponsiveBadge tone="warning">3</ResponsiveBadge>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Herramientas */}
            <div className="pt-4">
              <h4 className="text-xs font-medium text-eden-500 uppercase tracking-wider mb-2 px-4">
                Herramientas
              </h4>
              {roleConfig.sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setCurrentPage(section.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left transition-all ${
                      currentPage === section.key ? "bg-san-marino-50 text-san-marino-700 border border-san-marino-200 shadow-soft" : "text-eden-600 hover:bg-sinbad-50 hover:text-san-marino-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <section className="space-y-6">
          <ProtectedRoute requiredRole={userRole}>
            {renderPage()}
          </ProtectedRoute>
        </section>
      </main>
    </div>
  );
}