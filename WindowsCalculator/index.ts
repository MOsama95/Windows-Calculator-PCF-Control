import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { BackspaceHandler } from "./InputStrategies/backspace-handler";
import { ClearHandler } from "./InputStrategies/clear-handler";
import { DecimalHandler } from "./InputStrategies/decimal-handler";
import { HandlerStrategy } from "./InputStrategies/handler-strategy";
import { NumberHandler } from "./InputStrategies/number-handler";
import { OperatorHandler } from "./InputStrategies/operator-handler";
import { ZeroHandler } from "./InputStrategies/zero-handler";

export class WindowsCalculator implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _display: HTMLInputElement;
    private _currentValue: string;
    private _computedValue: number;
    private _notifyOutputChanged: () => void;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;
        
        // calculator container
        const calcContainer = document.createElement("div");
        calcContainer.classList.add("calc-container");

        // calculator title head
        const titleHead = document.createElement("h4");
        titleHead.innerHTML = "Calculator";
        titleHead.classList.add("calc-title");
        calcContainer.appendChild(titleHead);

        // calculator display area
        const displayContainer = document.createElement("div");
        displayContainer.classList.add("display-container");
        calcContainer.appendChild(displayContainer);
        this._display = document.createElement("input");
        this._display.type = "text";
        this._display.readOnly = true;
        this._display.classList.add("calc-display");
        displayContainer.appendChild(this._display);
        
        // Button layout
        const buttonLayout = [
            ["⊘", "C","⌫", "/"],
            ["7", "8", "9", "*"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "+"],
            ["⊘", "0", ".", "="]
        ];
        
        // UI buttons 
        buttonLayout.forEach(row => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("calc-row");
            row.forEach(char => {
                const btn = document.createElement("button");
                btn.innerText = char;
                btn.classList.add("calc-btn");
                btn.onclick = () => this.handleInput(char);
                rowDiv.appendChild(btn);
            });
            calcContainer.appendChild(rowDiv);
        });

        // append elements to main container
        this._container.appendChild(calcContainer);

        // Add keyboard support
        this.addKeyboardSupport();

        // Initial value from context
        if (context.parameters.value.raw !== null) {
            this._computedValue = context.parameters.value.raw!;
            this._currentValue = this._computedValue.toString();
            this._display.value = this._currentValue;
        }
    }

    // update view
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Sync external changes
        if (context.parameters.value.raw !== this._computedValue) {
            this._computedValue = context.parameters.value.raw ?? 0;
            this._currentValue = this._computedValue.toString();
            this._display.value = this._currentValue;
        }
    }

    // gets the output
    public getOutputs(): IOutputs {
        return {
            value: this._computedValue
        };
    }

    // destory function
    public destroy(): void {
        // Clean-up if needed
    }

    // support keyboard inputs
    private addKeyboardSupport(): void {
        document.addEventListener("keydown", (event) => {
            if (event.key >= "0" && event.key <= "9") {
                this.handleInput(event.key);
            } else if (["+", "-", "*", "/", ".", "="].includes(event.key)) {
                this.handleInput(event.key);
            } else if (event.key === "Backspace") {
                this.handleInput("⌫");
            } else if (event.key === "Enter") {
                this.handleInput("=");
            } else if (event.key === "Escape") {
                this.handleInput("C");
            }
        });
    }

    // handles and validates inputs of different types
    private handleInput(char: string): void {
        let handler: HandlerStrategy;
        switch (char){
        case"=":
            // calculate result
            this.calculate();
            break;
        case"C":
            // Clear input
            handler = new ClearHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this.calculate();
            break;
        case"⌫":
            // validate backspace entry
            handler = new BackspaceHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this._display.value = this._currentValue;
            break;
        case"⊘":
            // do nothing
            break;
        case"0":
            // validate zero entry
            handler = new ZeroHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this._display.value = this._currentValue;
            break;
        case".":
            // validate decimal dot entry
            handler = new DecimalHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this._display.value = this._currentValue;
            break;
        case"+":
        case"-":
        case"*":
        case"/":
            // validate operators entry
            handler = new OperatorHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this._display.value = this._currentValue;
            break;
        default:
            // validate numbers entry
            handler = new NumberHandler();
            this._currentValue = handler.handle(this._currentValue, char);
            this._display.value = this._currentValue;
            break;
        }
        return;
    }

    // calculate result
    private calculate(): void {
        try {
            let _operators = ["+", "-", "*", "/"];
            if(!_operators.includes(this._currentValue[this._currentValue.length -1])) {
                // expression evaluation
                const regex = /^[0-9+\-*/.]+$/;
                if (regex.test(this._currentValue)) {
                    // update fields with result
                    const result = eval(this._currentValue);
                    this._computedValue = parseFloat(result.toFixed(2));
                    this._currentValue = this._computedValue.toString();
                    this._display.value = this._currentValue;
                    this._notifyOutputChanged();
                } else {
                    this._currentValue = "0";
                    this._display.value = "Invalid Inputs!";
                }
            }
        } catch {
            this._currentValue = "0";
            this._display.value = "Error!";
        }
    }
}
    