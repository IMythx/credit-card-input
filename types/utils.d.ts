import { cardTypes, CreditCardInputsInterface } from "./types";
import { Inputs, Options } from "./types";
import creditCardType from "credit-card-type";
export declare class CreditCardInputs implements CreditCardInputsInterface {
    #private;
    invalide: Record<keyof Inputs, boolean>;
    cardType: ReturnType<typeof creditCardType>[number]["type"];
    codeName: ReturnType<typeof creditCardType>[number]["code"]["name"];
    constructor(inputs: Inputs, options?: Options);
    init(inputs: Inputs): void;
    cardNumberTypeChecker(e: Event): void;
    maskNumberInput(target: HTMLInputElement, cardType: Partial<Pick<ReturnType<typeof creditCardType>[number], "lengths" | "gaps" | "type">>): void;
    maskCvvInput(target: HTMLInputElement, size: Partial<ReturnType<typeof creditCardType>[number]["code"]["size"]>): void;
    maskExpInput(target: HTMLInputElement, errorId: string, inputFormat: string): void;
    removeError(target: HTMLInputElement, availableLengths: number[], errorId: string, targetType: keyof Inputs): void;
    validateNumberInput(target: HTMLInputElement, availableLengths: number[], targetType: keyof Inputs, errorId: string): void;
    validateExpInput(target: HTMLInputElement, inputFormat: string, targetType: keyof Inputs, errorId: string): void;
}
export declare const addNewCard: (config: import("credit-card-type/dist/types").CreditCardType) => void;
export declare const updateCard: (type: cardTypes | string, options: Partial<Pick<ReturnType<typeof creditCardType>[number], "type" | "code" | "gaps">>) => void;
