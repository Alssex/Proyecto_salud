// src/services/authService.ts
import { User, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:3001/api';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  roleId: number;
  team: string;
  document: string;
}

export interface LoginResponse {
  success: boolean;
  user: ApiUser;
}

export class AuthService {
  private static readonly SESSION_KEY = 'aps_user_session';

  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('Intentando login con:', credentials);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: credentials.username, 
          password: credentials.password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error de autenticación');
      }

      const result: LoginResponse = await response.json();
      
      if (!result.success || !result.user) {
        throw new Error('Error en la respuesta del servidor');
      }

      // Mapear el usuario de la API al formato que espera tu frontend
      const user: User = {
        id: result.user.id.toString(),
        username: result.user.email,
        role: this.mapRole(result.user.role),
        name: result.user.name
      };

      // Datos adicionales para guardar en sesión (no requeridos por el tipo User)
      const sessionData = {
        ...user,
        email: result.user.email,
        team: result.user.team,
        document: result.user.document
      } as any;

      console.log('Login exitoso:', user);
      
      // Guardar sesión en localStorage
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      
      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(error instanceof Error ? error.message : 'Error de conexión con el servidor');
    }
  }

  static async getPacientesByFamilia(familiaId: number) {
    const response = await fetch(`${API_URL}/familias/${familiaId}/pacientes`);
    if (!response.ok) throw new Error('Error obteniendo pacientes');
    return response.json();
  }

  static async crearPaciente(data: {
    familia_id: number;
    numero_documento: string;
    tipo_documento: string;
    primer_nombre: string;
    segundo_nombre?: string | null;
    primer_apellido: string;
    segundo_apellido?: string | null;
    fecha_nacimiento?: string | null;
    genero?: string | null;
    telefono?: string | null;
    email?: string | null;
  }) {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'No se pudo crear el paciente');
    }
    return response.json();
  }
  // Mapear roles de la base de datos a los roles de tu frontend
  private static mapRole(dbRole: string): string {
    const roleMap: { [key: string]: string } = {
      'Médico': 'medico',
      'Psicólogo': 'psicologo',
      'Fisioterapeuta': 'fisioterapeuta',
      'Nutricionista': 'nutricionista',
      'Fonoaudiólogo': 'fonoaudiologo',
      'Odontólogo': 'odontologo',
      'Enfermero Jefe': 'enfermero_jefe',
      'Auxiliar de enfermería': 'auxiliar_enfermeria',
      'Administrativo': 'administrativo',
      'Ente de Salud Pública': 'ente_salud_publica',
      'Administrador': 'administrador'
    };
    
    return roleMap[dbRole] || dbRole.toLowerCase();
  }

  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Error parsing session data:', error);
      this.logout();
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  }

  // Nuevos métodos para obtener datos de la base de datos
  static async getFamilias() {
    try {
      const response = await fetch(`${API_URL}/familias`);
      if (!response.ok) throw new Error('Error obteniendo familias');
      return response.json();
    } catch (error) {
      console.error('Error fetching familias:', error);
      throw error;
    }
  }

  static async crearFamilia(data: {
    apellido_principal: string;
    direccion: string;
    barrio_vereda?: string | null;
    municipio: string;
    telefono_contacto?: string | null;
    creado_por_uid: number;
  }) {
    const response = await fetch(`${API_URL}/familias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'No se pudo crear la familia');
    }
    return response.json();
  }

  static async getUsuariosPorRol(rol: string) {
    try {
      const response = await fetch(`${API_URL}/usuarios/rol/${rol}`);
      if (!response.ok) throw new Error('Error obteniendo usuarios');
      return response.json();
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  }

  // Health check del servidor
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Servidor no disponible:', error);
      return false;
    }
  }

  // ==================== MÉTODOS DE CARACTERIZACIÓN ====================

  static async crearCaracterizacion(data: any) {
    try {
      const response = await fetch(`${API_URL}/caracterizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error creando caracterización');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en crearCaracterizacion:', error);
      throw error;
    }
  }

  static async getCaracterizacionFamilia(familiaId: number) {
    try {
      const response = await fetch(`${API_URL}/familias/${familiaId}/caracterizacion`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay caracterización
        }
        throw new Error('Error obteniendo caracterización');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en getCaracterizacionFamilia:', error);
      throw error;
    }
  }

  static async getPacienteDetalle(pacienteId: number) {
    try {
      // Por ahora, obtener el paciente con su caracterización desde la familia
      // En el futuro esto podría ser un endpoint específico
      const response = await fetch(`${API_URL}/pacientes/${pacienteId}`);
      
      if (!response.ok) {
        throw new Error('Error obteniendo detalle del paciente');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en getPacienteDetalle:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE PLANES DE CUIDADO ====================

  static async getPlanesCuidadoPaciente(pacienteId: number) {
    try {
      const response = await fetch(`${API_URL}/pacientes/${pacienteId}/planes-cuidado`);
      if (!response.ok) throw new Error('Error obteniendo planes de cuidado');
      return response.json();
    } catch (error) {
      console.error('Error en getPlanesCuidadoPaciente:', error);
      throw error;
    }
  }

  static async crearPlanCuidado(data: any) {
    try {
      const response = await fetch(`${API_URL}/planes-cuidado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error creando plan de cuidado');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en crearPlanCuidado:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE DEMANDAS INDUCIDAS ====================

  static async getDemandasInducidasPaciente(pacienteId: number) {
    try {
      const response = await fetch(`${API_URL}/pacientes/${pacienteId}/demandas-inducidas`);
      if (!response.ok) throw new Error('Error obteniendo demandas inducidas');
      return response.json();
    } catch (error) {
      console.error('Error en getDemandasInducidasPaciente:', error);
      throw error;
    }
  }

  static async crearDemandaInducida(data: any) {
    try {
      const response = await fetch(`${API_URL}/demandas-inducidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error creando demanda inducida');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error en crearDemandaInducida:', error);
      throw error;
    }
  }

  static async getDemandasAsignadas(usuarioId: number) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${usuarioId}/demandas-asignadas`);
      if (!response.ok) throw new Error('Error obteniendo demandas asignadas');
      return response.json();
    } catch (error) {
      console.error('Error en getDemandasAsignadas:', error);
      throw error;
    }
  }
}