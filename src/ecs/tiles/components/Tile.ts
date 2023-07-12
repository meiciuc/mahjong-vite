import { EntityStateMachine } from "@ash.ts/ash";

export enum TileStateEnum {
    IDLE = 'idle',
    SELECTED = 'selected',
    NON_INTERACTIVE = 'non_interactive',
}

export class Tile {
    private static __id = 1;

    constructor(
        public fsm: EntityStateMachine
    ) {}

    public readonly id = Tile.__id++;
}