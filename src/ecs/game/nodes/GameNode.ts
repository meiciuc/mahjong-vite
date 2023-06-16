import { defineNode } from '@ash.ts/ash';
import { Game } from '../components/Game';

export class GameNode extends defineNode({
    game: Game,
}) {}
