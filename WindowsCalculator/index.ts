import { IInputs, IOutputs } from "./generated/ManifestTypes";

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

        // Create display area
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
        
        // insert UI buttons 
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

        // append to main container
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

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Sync external changes
        if (context.parameters.value.raw !== this._computedValue) {
            this._computedValue = context.parameters.value.raw ?? 0;
            this._currentValue = this._computedValue.toString();
            this._display.value = this._currentValue;
        }
    }

    public getOutputs(): IOutputs {
        return {
            value: this._computedValue
        };
    }

    public destroy(): void {
        // Clean-up if needed
    }

    private handleInput(char: string): void {
        switch (char){
        case"=":
            // calculate result
            this.calculate();
            break;
        case"C":
            // Clear input
            this._currentValue = "0";
            this.calculate();
            break;
        case"⌫":
            // Remove last character
            if(this._currentValue.length > 1) {
                this._currentValue = this._currentValue.slice(0, -1);
                this.calculate();
            }
            // Clear input
            else {
                this._currentValue = "0";
                this.calculate();
            }
            break;
        case"⊘":
            // do nothing
            break;
        case"0":
            if(char !== this._currentValue){
                // append char to the expression
                this._currentValue += char;
                this._display.value = this._currentValue;
            }
            break;
        case".":
            if(this._currentValue.length == 0 || 
              (this._currentValue.length > 0 && char != this._currentValue[this._currentValue.length-1])){
                // append char to the expression
                this._currentValue += char;
                this._display.value = this._currentValue;
            }
            break;
        case"+":
        case"-":
        case"*":
        case"/":
            if(this._currentValue.length == 0) {
                // do nothing
            } 
            const operators = ["+", "-", "*", "/"];
            if(operators.includes(this._currentValue[this._currentValue.length-1]) ){
                // overwrite repeated operators
                this._currentValue = this._currentValue.slice(0, -1);
                this._currentValue += char;
                this._display.value = this._currentValue;
            } else {
                // append char to the expression
                this._currentValue += char;
                this._display.value = this._currentValue;
            }
            break;
        default:
            if(this._currentValue === "0") {
                // append char to the expression
                this._currentValue = char;
                this._display.value = this._currentValue;
            } else {
                // append char to the expression
                this._currentValue += char;
                this._display.value = this._currentValue;   
            }
            break;
        }
        return;
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

    // calculate reult
    private calculate(): void {
        try {
            // Safe-ish expression evaluation
            const regex = /^[0-9+\-*/.]+$/;
            if (regex.test(this._currentValue)) {
                const result = eval(this._currentValue);
                this._computedValue = parseFloat(result.toFixed(2));
                this._currentValue = this._computedValue.toString();
                this._display.value = this._currentValue;
                this._notifyOutputChanged();
            } else {
                this._currentValue = "0";
                this._display.value = "Invalid Inputs!";
            }
        } catch {
            this._currentValue = "0";
            this._display.value = "Error!";
        }
    }
}
    