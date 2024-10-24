import { cardTypes, CreditCardInputsInterface } from "./types";
import { Errors, Icons, Inputs, Options } from "./types";
import creditCardType from "credit-card-type";
import inputmask from "inputmask";

const defaultErrors: Errors = {
  cardNumberInput: "Invalid card number",
  cvvInput: "Invalid CVV number",
  expInput: "Invalid expiry date",
};

const defaultIcons: Icons = {
  default: new URL("./assets/credit-card-duotone.svg", import.meta.url).href,
  visa: new URL("./assets/visa.svg", import.meta.url).href,
  mastercard: new URL("./assets/mastercard.svg", import.meta.url).href,
  "american-express": new URL("./assets/amex.svg", import.meta.url).href,
  discover: new URL("./assets/discover.svg", import.meta.url).href,
  "diners-club": new URL("./assets/diners.svg", import.meta.url).href,
  jcb: new URL("./assets/jcb.svg", import.meta.url).href,
  elo: new URL("./assets/elo.svg", import.meta.url).href,
  mir: new URL("./assets/mir.svg", import.meta.url).href,
  unionpay: new URL("./assets/unionpay.svg", import.meta.url).href,
  hipercard: new URL("./assets/hipercard.svg", import.meta.url).href,
  hiper: new URL("./assets/hiper.svg", import.meta.url).href,
  maestro: new URL("./assets/maestro.svg", import.meta.url).href,
};

export class CreditCardInputs implements CreditCardInputsInterface {
  #codeSize: ReturnType<typeof creditCardType>[number]["code"]["size"] = 3;
  #availableCardNumberLengths: number[] = [];
  #icons: Icons;
  #errors: Errors;
  invalide: Record<keyof Inputs, boolean> = {
    cardNumberInput: false,
    expInput: false,
    cvvInput: false,
  };
  cardType: ReturnType<typeof creditCardType>[number]["type"];
  codeName: ReturnType<typeof creditCardType>[number]["code"]["name"];

  constructor(inputs: Inputs, options?: Options) {
    this.#icons = { ...defaultIcons, ...options?.customIcons };

    this.#errors = { ...defaultErrors, ...options?.customErrors };

    this.init(inputs);
  }

  init(inputs: Inputs) {
    const cardNumberInput = inputs.cardNumberInput;

    const cvvInput = inputs.cvvInput;

    const expInput = inputs.expInput;

    if (cvvInput) {
      const cvvParent = cardNumberInput.parentElement;

      const cvvContainer = document.createElement("div");

      const cvvErrorId = "cvv-input-error";

      cvvContainer.className = "cci__container";

      cvvParent.insertBefore(cvvContainer, cvvInput);

      cvvContainer.appendChild(cvvInput);

      cvvInput.addEventListener("input", () =>
        this.removeError(cvvInput, [this.#codeSize], cvvErrorId, "cvvInput")
      );

      cvvInput.addEventListener("blur", () =>
        this.validateNumberInput(
          cvvInput,
          [this.#codeSize],
          "cvvInput",
          cvvErrorId
        )
      );

      this.maskCvvInput(cvvInput, this.#codeSize);
    }

    if (cardNumberInput) {
      const cardNumberParent = cardNumberInput.parentElement;

      const cardNumberContainer = document.createElement("div");

      const img = document.createElement("img");

      img.className = "cci__container__img";

      cardNumberContainer.className = "cci__container";

      const inputHeight = cardNumberInput.getBoundingClientRect().height;

      cardNumberInput.style.paddingInlineEnd =
        inputHeight * 1.7 > 70 ? 70 + "px" : inputHeight * 1.7 + "px";

      img.id = "credit-card-img";

      img.src = this.#icons.default;

      cardNumberParent.insertBefore(cardNumberContainer, cardNumberInput);

      cardNumberContainer.appendChild(cardNumberInput);

      cardNumberContainer.appendChild(img);

      cardNumberInput.addEventListener(
        "input",
        this.cardNumberTypeChecker.bind(this)
      );

      cardNumberInput.addEventListener("blur", () => {
        this.validateNumberInput(
          cardNumberInput,
          this.#availableCardNumberLengths,
          "cardNumberInput",
          "credit-card-input-error"
        );

        this.maskCvvInput(cvvInput, this.#codeSize);
      });

      this.maskNumberInput(cardNumberInput, { lengths: [10] });
    }

    if (expInput) {
      const expParent = expInput.parentElement;

      const expContainer = document.createElement("div");

      const inputFormat = "mm/yy";

      const expErrorId = "exp-input-error";

      expContainer.className = "cci__container";

      expParent.insertBefore(expContainer, expInput);

      expContainer.appendChild(expInput);

      expInput.addEventListener("blur", () =>
        this.validateExpInput(expInput, inputFormat, "expInput", expErrorId)
      );

      this.maskExpInput(expInput, expErrorId, inputFormat);
    }
  }

  cardNumberTypeChecker(e: Event) {
    const target = e.target as HTMLInputElement;

    const cardTypes = creditCardType(target.value);

    const icon = document.getElementById("credit-card-img") as HTMLImageElement;

    this.removeError(
      target,
      cardTypes[0].lengths,
      "credit-card-input-error",
      "cardNumberInput"
    );

    if (cardTypes.length === 1) {
      this.cardType = cardTypes[0].type;

      this.codeName = cardTypes[0].code.name;

      this.#codeSize = cardTypes[0].code.size;

      this.#availableCardNumberLengths = cardTypes[0].lengths;

      icon.src = this.#icons[cardTypes[0].type];

      this.maskNumberInput(target, cardTypes[0]);
    } else {
      this.cardType = undefined;

      this.codeName = undefined;

      icon.src = this.#icons.default;
    }
  }

  maskNumberInput(
    target: HTMLInputElement,
    cardType: Partial<
      Pick<
        ReturnType<typeof creditCardType>[number],
        "lengths" | "gaps" | "type"
      >
    >
  ) {
    //@ts-ignore
    const mask = "9".repeat(cardType.lengths.at(-1)).split("");

    cardType?.gaps?.forEach((gap, index) => {
      mask.splice(gap + index, 0, " ");
    });

    inputmask(mask.join(""), { placeholder: "", autoUnmask: true }).mask(
      target
    );
  }

  maskCvvInput(
    target: HTMLInputElement,
    size: Partial<ReturnType<typeof creditCardType>[number]["code"]["size"]>
  ) {
    const mask = "9".repeat(size);

    inputmask(mask, { placeholder: "", autoUnmask: true }).mask(target);
  }

  maskExpInput(target: HTMLInputElement, errorId: string, inputFormat: string) {
    target.placeholder = "MM/YY";

    inputmask("datetime", {
      inputFormat,
      placeholder: "",
      autoUnmask: true,
      jitMasking: true,
      showMaskOnFocus: false,
      showMaskOnHover: false,
      oncomplete: () => {
        const errorElement = document.getElementById(errorId);

        this.invalide["expInput"] = false;

        if (errorElement) {
          errorElement.remove();
        }
      },
    }).mask(target);
  }

  removeError(
    target: HTMLInputElement,
    availableLengths: number[],
    errorId: string,
    targetType: keyof Inputs
  ) {
    const parent = target.parentElement;

    const errorElement = parent.querySelector(`#${errorId}`);

    if (availableLengths.includes(target.value.length)) {
      this.invalide[targetType] = false;

      if (errorElement) {
        parent.removeChild(errorElement);
      }
    }
  }

  validateNumberInput(
    target: HTMLInputElement,
    availableLengths: number[],
    targetType: keyof Inputs,
    errorId: string
  ): void {
    const error = document.getElementById(errorId);

    if (
      target.value.length &&
      !availableLengths.includes(target.value.length) &&
      !error
    ) {
      const errorElement = document.createElement("p");

      const parent = target.parentElement;

      this.invalide[targetType] = true;

      errorElement.classList.add("cci__error");

      errorElement.id = errorId;

      errorElement.innerText = this.#errors[targetType];

      parent.appendChild(errorElement);
    }
  }

  validateExpInput(
    target: HTMLInputElement,
    inputFormat: string,
    targetType: keyof Inputs,
    errorId: string
  ): void {
    const now = new Date();

    const expDate = new Date();

    const month = target.value.split("/")[0];

    const year =
      now.getFullYear().toString().slice(0, 2) + target.value.split("/")[1];

    month && expDate.setMonth(parseInt(month));

    year && expDate.setFullYear(parseInt(year));

    const isValid =
      Inputmask.isValid(target.value, {
        alias: "datetime",
        inputFormat,
      }) && expDate > now;

    const error = document.getElementById(errorId);

    if (!isValid && !error && target.value.length) {
      const errorElement = document.createElement("p");

      const parent = target.parentElement;

      this.invalide[targetType] = true;

      errorElement.classList.add("cci__error");

      errorElement.id = errorId;

      errorElement.innerText = this.#errors[targetType];

      parent.appendChild(errorElement);
    }
  }
}

export const addNewCard = creditCardType.addCard;

export const updateCard: (
  type: cardTypes | string,
  options: Partial<
    Pick<ReturnType<typeof creditCardType>[number], "type" | "code" | "gaps">
  >
) => void = creditCardType.updateCard;
