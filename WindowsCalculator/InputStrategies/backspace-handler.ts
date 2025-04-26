import { HandlerStrategy } from './handler-strategy';
export class BackspaceHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        // Remove last character
        if(currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        }
        // Clear input
        else {
            currentValue = "0";
        }
        
        return currentValue;
    }
}