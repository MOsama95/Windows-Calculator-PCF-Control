import { HandlerStrategy } from './handler-strategy';
export class DecimalHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        // get the last entered number
        const enteredValue = this.getLastNumber(currentValue);

        // if entered value does not contain dot, append it to the expression 
        if(!enteredValue.includes(".")){
            // append char to the expression
            currentValue += ".";
        }
      return currentValue;
    }
  }