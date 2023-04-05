export class RetornoDTO<T>{
    data : T | undefined;
    success: boolean = false
    message: string = ''
}