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
    regularFrequency: boolean; // CE MÉDICAMENT EST-IL À PRENDRE RÉGULIÈREMENT ?

    // REGULIER
    regularFrequencyMode: string; // COMMENT ? (X FOIS PAR JOUR/SEMAINE/MOIS OU TOUS LES X JOURS)
    regularFrequencyNumber: number; // X ?
    regularFrequencyPeriods: string; // SI X FOIS PAR (JOUR/SEMAINE/MOIS), PÉRIODICITÉ
    regularFrequencyContinuity: string; // EST-CE QUOTIDIEN OU SEULEMENT CERTAINS JOURS ? (DAILY/CUSTOM) 
    regularFrequencyDays: string[]; // SI CERTAINS JOURS, LESQUELS ?

    // PERSONNALISÉ
    endModality: string; // COMMENT S'ARRÊTE LE TRAITEMENT ? (NOMBRE DE PRIS OU DATE DE FIN)
    endDate: string; // DATE DE FIN SI FIN À UNE DATE PRÉCISE
    endQuantity: number; // NOMBRE DE PRIS SI FIN AU BOUT D'UN CERTAIN NOMBRE DE PRIS
    quantity: number; // QUANTITÉ À PRENDRE À CHAQUE PRISE SI QUANTITÉ RÉGULIÈRE
    takes: Take[];
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

export interface NewInstruction extends Instruction {
    completed: boolean;
}
