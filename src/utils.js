var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CreditCardInputs_codeSize, _CreditCardInputs_availableCardNumberLengths, _CreditCardInputs_icons, _CreditCardInputs_errors;
import creditCardType from "credit-card-type";
import inputmask from "inputmask";
import defaultIcon from "./assets/credit-card-duotone.svg";
import visaIcon from "./assets/visa.svg";
import mastercardIcon from "./assets/mastercard.svg";
import amexIcon from "./assets/amex.svg";
import discoverIcon from "./assets/discover.svg";
import dinersClubIcon from "./assets/diners.svg";
import jcbIcon from "./assets/jcb.svg";
import eloIcon from "./assets/elo.svg";
import mirIcon from "./assets/mir.svg";
import unionpayIcon from "./assets/unionpay.svg";
import hipercardIcon from "./assets/hipercard.svg";
import hiperIcon from "./assets/hiper.svg";
import maestroIcon from "./assets/maestro.svg";
const defaultErrors = {
    cardNumberInput: "Invalid card number",
    cvvInput: "Invalid CVV number",
    expInput: "Invalid expiry date",
};
const defaultIcons = {
    default: defaultIcon,
    visa: visaIcon,
    mastercard: mastercardIcon,
    "american-express": amexIcon,
    discover: discoverIcon,
    "diners-club": dinersClubIcon,
    jcb: jcbIcon,
    elo: eloIcon,
    mir: mirIcon,
    unionpay: unionpayIcon,
    hipercard: hipercardIcon,
    hiper: hiperIcon,
    maestro: maestroIcon,
};
export class CreditCardInputs {
    constructor(inputs, options) {
        _CreditCardInputs_codeSize.set(this, 3);
        _CreditCardInputs_availableCardNumberLengths.set(this, []);
        _CreditCardInputs_icons.set(this, void 0);
        _CreditCardInputs_errors.set(this, void 0);
        this.invalide = {
            cardNumberInput: false,
            expInput: false,
            cvvInput: false,
        };
        __classPrivateFieldSet(this, _CreditCardInputs_icons, Object.assign(Object.assign({}, defaultIcons), options === null || options === void 0 ? void 0 : options.customIcons), "f");
        __classPrivateFieldSet(this, _CreditCardInputs_errors, Object.assign(Object.assign({}, defaultErrors), options === null || options === void 0 ? void 0 : options.customErrors), "f");
        this.init(inputs);
    }
    init(inputs) {
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
            cvvInput.addEventListener("input", () => this.removeError(cvvInput, [__classPrivateFieldGet(this, _CreditCardInputs_codeSize, "f")], cvvErrorId, "cvvInput"));
            cvvInput.addEventListener("blur", () => this.validateNumberInput(cvvInput, [__classPrivateFieldGet(this, _CreditCardInputs_codeSize, "f")], "cvvInput", cvvErrorId));
            this.maskCvvInput(cvvInput, __classPrivateFieldGet(this, _CreditCardInputs_codeSize, "f"));
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
            img.src = __classPrivateFieldGet(this, _CreditCardInputs_icons, "f").default;
            cardNumberParent.insertBefore(cardNumberContainer, cardNumberInput);
            cardNumberContainer.appendChild(cardNumberInput);
            cardNumberContainer.appendChild(img);
            cardNumberInput.addEventListener("input", this.cardNumberTypeChecker.bind(this));
            cardNumberInput.addEventListener("blur", () => {
                this.validateNumberInput(cardNumberInput, __classPrivateFieldGet(this, _CreditCardInputs_availableCardNumberLengths, "f"), "cardNumberInput", "credit-card-input-error");
                this.maskCvvInput(cvvInput, __classPrivateFieldGet(this, _CreditCardInputs_codeSize, "f"));
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
            expInput.addEventListener("blur", () => this.validateExpInput(expInput, inputFormat, "expInput", expErrorId));
            this.maskExpInput(expInput, expErrorId, inputFormat);
        }
    }
    cardNumberTypeChecker(e) {
        const target = e.target;
        const cardTypes = creditCardType(target.value);
        const icon = document.getElementById("credit-card-img");
        this.removeError(target, cardTypes[0].lengths, "credit-card-input-error", "cardNumberInput");
        if (cardTypes.length === 1) {
            this.cardType = cardTypes[0].type;
            this.codeName = cardTypes[0].code.name;
            __classPrivateFieldSet(this, _CreditCardInputs_codeSize, cardTypes[0].code.size, "f");
            __classPrivateFieldSet(this, _CreditCardInputs_availableCardNumberLengths, cardTypes[0].lengths, "f");
            icon.src = __classPrivateFieldGet(this, _CreditCardInputs_icons, "f")[cardTypes[0].type];
            this.maskNumberInput(target, cardTypes[0]);
        }
        else {
            this.cardType = undefined;
            this.codeName = undefined;
            icon.src = __classPrivateFieldGet(this, _CreditCardInputs_icons, "f").default;
        }
    }
    maskNumberInput(target, cardType) {
        var _a;
        const mask = "9".repeat(cardType.lengths.at(-1)).split("");
        (_a = cardType === null || cardType === void 0 ? void 0 : cardType.gaps) === null || _a === void 0 ? void 0 : _a.forEach((gap, index) => {
            mask.splice(gap + index, 0, " ");
        });
        inputmask(mask.join(""), { placeholder: "", autoUnmask: true }).mask(target);
    }
    maskCvvInput(target, size) {
        const mask = "9".repeat(size);
        inputmask(mask, { placeholder: "", autoUnmask: true }).mask(target);
    }
    maskExpInput(target, errorId, inputFormat) {
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
    removeError(target, availableLengths, errorId, targetType) {
        const parent = target.parentElement;
        const errorElement = parent.querySelector(`#${errorId}`);
        if (availableLengths.includes(target.value.length)) {
            this.invalide[targetType] = false;
            if (errorElement) {
                parent.removeChild(errorElement);
            }
        }
    }
    validateNumberInput(target, availableLengths, targetType, errorId) {
        const error = document.getElementById(errorId);
        if (target.value.length &&
            !availableLengths.includes(target.value.length) &&
            !error) {
            const errorElement = document.createElement("p");
            const parent = target.parentElement;
            this.invalide[targetType] = true;
            errorElement.classList.add("cci__error");
            errorElement.id = errorId;
            errorElement.innerText = __classPrivateFieldGet(this, _CreditCardInputs_errors, "f")[targetType];
            parent.appendChild(errorElement);
        }
    }
    validateExpInput(target, inputFormat, targetType, errorId) {
        const now = new Date();
        const expDate = new Date();
        const month = target.value.split("/")[0];
        const year = now.getFullYear().toString().slice(0, 2) + target.value.split("/")[1];
        month && expDate.setMonth(parseInt(month));
        year && expDate.setFullYear(parseInt(year));
        const isValid = Inputmask.isValid(target.value, {
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
            errorElement.innerText = __classPrivateFieldGet(this, _CreditCardInputs_errors, "f")[targetType];
            parent.appendChild(errorElement);
        }
    }
}
_CreditCardInputs_codeSize = new WeakMap(), _CreditCardInputs_availableCardNumberLengths = new WeakMap(), _CreditCardInputs_icons = new WeakMap(), _CreditCardInputs_errors = new WeakMap();
export const addNewCard = creditCardType.addCard;
export const updateCard = creditCardType.updateCard;
