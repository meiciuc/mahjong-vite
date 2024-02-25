import { BoosterType } from "./GameModel";

export enum CurrencyType {
    POINTS = 'points',
    VIDEO = 'video',
}

export interface ItemProposal {
    product: BoosterType,
    count: number,
}

export interface ItemProposalPrice {
    valute: CurrencyType,
    price: number,
}

export interface Proposal {
    id: string,
    items: ItemProposal[],
    price: ItemProposalPrice
}

export interface ShopModel {
    proposales: Proposal[]
}