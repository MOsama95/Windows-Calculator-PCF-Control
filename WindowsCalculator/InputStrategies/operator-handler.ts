import { HandlerStrategy } from './handler-strategy';
export class OperatorHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        if(currentValue.length == 0) {
            // do nothing
        } 
        else if(this._operators.includes(currentValue[currentValue.length-1])){
            // if last char is operator, overwrite repeated operators
            currentValue = currentValue.slice(0, -1);
            currentValue += input;
        } else if(currentValue[currentValue.length-1] === ".") {
            // if last char is decimal point, check preivous char
            if(this._operators.includes(currentValue[currentValue.length-2])) {
                // previous char is also an operator, overwrite it
                currentValue = currentValue.slice(0, -2);
                currentValue += input;
            }
            else{
                // previous char is not an operator, overwrite the last char only
                currentValue = currentValue.slice(0, -1);
                currentValue += input; 
            }
        } else {
            // append char to the expression
            currentValue += input;
        }
      return currentValue;
    }
  }