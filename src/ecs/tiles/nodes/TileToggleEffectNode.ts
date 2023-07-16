import { defineNode } from '@ash.ts/ash';
import { Display } from '../../display/components/Display';
import { Transform } from '../../display/components/Transform';
import { TileToggleEffect } from '../components/TileToggleEffect';

export class TileToggleEffectNode extends defineNode({
    effect: TileToggleEffect,
    display: Display,
    transform: Transform,
}) {}
