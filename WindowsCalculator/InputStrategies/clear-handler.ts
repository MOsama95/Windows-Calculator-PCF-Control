import { HandlerStrategy } from './handler-strategy';
export class ClearHandler extends HandlerStrategy {
    handle(currentValue:string, input:string):string {
        return "0";
    }
}