export interface Institution {
  id: number;
  name: string;
  acronym: string;
}

export interface InstitutionComponent {
  id: number;
  name: string;
  institution: number;
}

export interface InstitutionStore {
  institutions: Institution[];
  institutionComponents: InstitutionComponent[];
}