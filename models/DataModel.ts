export enum Size{
    S="S",
    M="M",
    L="L"
}

export interface IApparel{
    type:string,
    code:number
}

export interface IStock{
    code:number,
    size:Size,
    price:number,
    units:number
}



