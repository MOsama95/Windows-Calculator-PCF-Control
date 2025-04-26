// Strategy Interface
export abstract class HandlerStrategy {
    protected readonly _operators = ["+", "-", "*", "/"];

    // handles and validate input
    abstract handle(currentValue:string, input:string): string;
    
    // get last entered number
    public getLastNumber(currentValue:string):string{
        // Find the index of the last typed operator if exist
        let lastOpIndex = -1;
        for (const op of this._operators) {
            const index = currentValue.lastIndexOf(op);
            if (index > lastOpIndex) {
                lastOpIndex = index;
            }
        }
        // if an operator is found, entered value is the input after the operator
        if (lastOpIndex !== -1) {
            if(lastOpIndex < currentValue.length - 1) {
                currentValue = currentValue.substring(lastOpIndex + 1);
            }
            else if (lastOpIndex == currentValue.length - 1) {
                currentValue = "";
            }
        }
        return currentValue;
    }
}