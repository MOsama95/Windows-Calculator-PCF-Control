import { HandlerStrategy } from './handler-strategy';
export class NumberHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        // get the last entered number
        const enteredValue = this.getLastNumber(currentValue);

        // skip leading zero
        if(enteredValue === "0") {
            currentValue = currentValue.slice(0, -1);
        }

        // append char to the expression
        currentValue += input;
        
        return currentValue;
    }
}