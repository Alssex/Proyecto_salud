// Tipos para el sistema de caracterización APS

export interface CaracterizacionFamilia {
  numero_ficha?: string;
  zona?: string;
  territorio?: string;
  estrato?: number;
  tipo_familia?: string;
  riesgo_familiar?: string;
  fecha_caracterizacion?: string;
  info_vivienda?: {
    funcionalidad?: string[];
    sobrecarga?: string[];
    ecomapa?: string[];
    observaciones?: string;
    te_quiere?: boolean;
    nn_discapacidad_adulto_mayor_enfermedad?: boolean;
  };
  situaciones_proteccion?: string[];
  condiciones_salud_publica?: string[];
  practicas_cuidado?: {
    hab_saludables?: boolean;
    rec_socioemoc?: boolean;
    cuidado_y_protec?: boolean;
    relaciones_sanas?: boolean;
    red_colect?: boolean;
    autonomia_adu_mayor?: boolean;
    pract_prevencion_e?: boolean;
    prac_saberes_anc?: boolean;
    prac_derech?: boolean;
  };
}

export interface CaracterizacionPaciente {
  paciente_id: number;
  fecha_caracterizacion?: string;
  rol_familiar?: string;
  ocupacion?: string;
  nivel_educativo?: string;
  grupo_poblacional?: string;
  regimen_afiliacion?: string;
  pertenencia_etnica?: string;
  discapacidad?: string[];
  victima_violencia?: boolean;
  datos_pyp?: {
    cumple_esquema_pym?: boolean;
    odont_pym?: boolean;
    lactancia?: boolean;
    fluor?: boolean;
    profilaxis?: boolean;
    vacunacion?: boolean;
    micronutientes?: boolean;
    suplementacion?: string[];
    preconcepcional?: string[];
    motivo_no_atencion_pym?: string[];
    si_es_menor_6_meses_lactancia?: boolean;
    si_es_menor_2_anos_meses_lact?: number;
    menor_de_5_anos?: boolean;
  };
  datos_salud?: {
    peso?: number;
    talla?: number;
    diagnostico?: string;
    signos_desnutricion_aguda?: string[];
    enf_ultimo_mes?: boolean;
    cuales_enf_ultimo_mes?: string;
    tto?: boolean;
    motivo_no_atencion?: string[];
  };
  creado_por_uid?: number;
  fecha_creacion?: string;
}

export interface CaracterizacionPayload {
  familia_id: number;
  datos_familia: CaracterizacionFamilia;
  integrantes: CaracterizacionPaciente[];
}

export interface CaracterizacionResponse {
  familia: CaracterizacionFamilia & {
    familia_id: number;
    apellido_principal: string;
    direccion: string;
    barrio_vereda?: string;
    municipio: string;
    telefono_contacto?: string;
    creado_por_uid: number;
    creado_por_nombre: string;
  };
  integrantes: Array<CaracterizacionPaciente & {
    numero_documento: string;
    tipo_documento: string;
    primer_nombre: string;
    segundo_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    fecha_nacimiento?: string;
    genero?: string;
  }>;
  tiene_caracterizacion: boolean;
}

// Opciones para dropdowns y selects
export const OPCIONES_TIPO_FAMILIA = [
  'Biparental',
  'Monoparental', 
  'Ext. Bipar',
  'Ext. Monop',
  'Comp. Bipa',
  'Comp. Monop',
  'Uniper'
];

export const OPCIONES_RIESGO_FAMILIAR = [
  '1. Ausencia',
  '2. Sobrecarga',
  '3. Sobrecarga Intensa',
  '0 a 3 Disfunción',
  '4 a 6 Func. Mode',
  '7 a 10 Alta Func'
];

export const OPCIONES_ROL_FAMILIAR = [
  'Jefe',
  'Cónyuge',
  'Hijo',
  'Hermano',
  'Padre',
  'Otro'
];

export const OPCIONES_GRUPO_POBLACIONAL = [
  'NNA',
  'Gestante',
  'Adulto Mayor'
];

export const OPCIONES_REGIMEN_AFILIACION = [
  'Subsidiado',
  'Contributivo',
  'Especial',
  'Excepción',
  'No afiliado',
  'EAPB'
];

export const OPCIONES_PERTENENCIA_ETNICA = [
  'Indígena',
  'Rom',
  'Raizal',
  'Palenquero',
  'Negro, Afro',
  'Otro',
  'Ninguna',
  'Comunidad o pueblo indígena'
];

export const OPCIONES_DISCAPACIDAD = [
  'Física',
  'Auditiva',
  'Visual',
  'Sordoceguera',
  'Intelectual',
  'Psicosocial',
  'Múltiple',
  'Otra',
  'Ninguna'
];

export const OPCIONES_SITUACIONES_PROTECCION = [
  'NNA',
  'GESTANTES',
  'ADULTOS MAYORES',
  'TB',
  'LEPRA',
  'ESCABIOSIS',
  'MALARIA',
  'DENGUE',
  'CHAGAS',
  'Hep. A',
  'ENF. HUÉRFANA O TERMINAL',
  'INMUNOPREVENIBLE',
  'OTRAS',
  'NINGUNA',
  'Sucesos vitales normativos o no norm',
  'Vulnerabilidad Social',
  'Cuidado de salud críticos',
  'ANTECEDENTES CA, HTA, DIABETES, ASMA, CARDIACA, OTRA',
  'TTO'
];

export const OPCIONES_OBTIENE_ALIMENTO = [
  'CULTIVA',
  'CRÍA',
  'CAZERÍA',
  'RECOLECCIÓN',
  'TRUEQUE',
  'COMPRA',
  'Asis estado',
  'OTRA'
];
