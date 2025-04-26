import { HandlerStrategy } from './handler-strategy';
export class ZeroHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        // get the last entered number
        const enteredValue = this.getLastNumber(currentValue);
        
        // prevent multiple zeros if no number is entered
        if("0" !== enteredValue){
            // append char to the expression
            currentValue += "0";
        }
        return currentValue;
    }
}