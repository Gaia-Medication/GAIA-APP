export interface Treatment {
    name: string;
    description: string;
    doctor: string;
    userId: number;
    startDate: Date;
    instructions: Instruction[];
}

export interface Instruction {
    CIS: number;
    name: string;
    frequencyMode: FrequencyMode; // "REGULAR" ou "FLEXIBLE"
    quantityMode: QuantityMode;   // "REGULAR" ou "CUSTOM"

    // Fréquence régulière
    regularIntervalType: RegularIntervalType; // X_TIMES_PER_DAY, X_TIMES_PER_WEEK, EVERY_X_DAYS
    regularIntervalCount: number;             // Valeur numérique ex.: 3
    regularIntervalUnit: RegularIntervalUnit; // day, week, month
    regularContinuityMode: RegularContinuityMode; // DAILY / CUSTOM
    regularContinuityDays: string[];          // ["Mon", "Wed", "Fri"] si CUSTOM

    // Personnalisé (fin du traitement)
    endCondition: EndCondition;  // DATE ou NUMBER_OF_TAKES
    endDate?: string;            // Date de fin si endCondition = DATE
    endTakesCount?: number;      // Nombre total de prises si endCondition = NUMBER_OF_TAKES

    // Quantité
    quantityPerTake?: number; // Dose par prise (si quantité régulière)
    takes: Take[];           // Liste de prises détaillées si quantité custom
}

export interface Take {
    userId: number;
    treatmentName: string; // TODO: Check if removable (treatment name is accessible 2 levels above)
    CIS: number; // TODO: Check if removable (CIS is accessible 1 level above)
    date: string;
    quantity: number;
    taken: boolean;
    review: string;
    pain: number;
}

export interface CustomTake {
    CIS: number;
    date: string;
    quantity: number;
}

export interface NewInstruction extends Instruction {
    completed: boolean;
}

export interface IDrug { // TODO: CREATE A GOOD INTERFACE
    CIS: number;
    name: string;
    shape: string;
    administration_way: string;
    marketed: string;
    titulaire: string;
    ATC: string;
    indications_therapeutiques: string;
    generique: string;
    endDate: Date;
    quantity: number;
    takes: Take[];
}


// ENUMS
// Mode de quantité : régulier ou personnalisé
export enum QuantityMode {
    REGULAR = "REGULAR",
    CUSTOM = "CUSTOM"
}

// Mode de fréquence : régulier ou flexible
export enum FrequencyMode {
    REGULAR = "REGULAR",
    FLEXIBLE = "FLEXIBLE"
}

// Type de régularité : x fois par jour, x fois par semaine, tous les x jours
export enum RegularIntervalType {
    X_TIMES_PER_DAY = "xTimesPerDay",
    X_TIMES_PER_WEEK = "xTimesPerWeek",
    EVERY_X_DAYS = "everyXDays",
}

// Unité de temps : jour, semaine, mois...
export enum RegularIntervalUnit {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
}

// Mode de continuité (tous les jours ou jours spécifiques)
export enum RegularContinuityMode {
    DAILY = "DAILY",   // Tous les jours
    CUSTOM = "CUSTOM", // Jours spécifiques
}

// Mode de fin de traitement
export enum EndCondition {
    DATE = "DATE",
    NUMBER_OF_TAKES = "NUMBER_OF_TAKES",
}
