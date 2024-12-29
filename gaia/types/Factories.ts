import { Instruction, NewInstruction } from "./Medical";
import { SearchDrug } from "./Search";

export const NewInstructionFactory = (drug: SearchDrug): NewInstruction => {
    return {
        CIS: drug.CIS,
        name: drug.Name,
        regularFrequency: false,
        regularFrequencyMode: "",
        regularFrequencyNumber: 0,
        regularFrequencyPeriods: "",
        regularFrequencyContinuity: "",
        regularFrequencyDays: [],
        endModality: "",
        endDate: new Date().toISOString(),
        endQuantity: 0,
        quantity: 0,
        takes: [],
        completed: false
    };
}