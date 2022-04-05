import { StockDetails } from './stock-details';
export class StockInfo {

    stockInfo : Array<StockDetails> = [];
    investedAmount: number = 0.0;
    currentMarketTotalAmount: number = 0.0;
    difference: number = 0.0;
    profitLossStatus: string ="";
    lastAccessed: string ="";
    simpleStatus: string = "";
}
