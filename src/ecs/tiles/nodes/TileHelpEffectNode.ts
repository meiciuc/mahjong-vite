import { defineNode } from '@ash.ts/ash';
import { Display } from '../../display/components/Display';
import { Transform } from '../../display/components/Transform';
import { TileHelpEffect } from '../components/TileHelpEffect';

export class TileHelpEffectNode extends defineNode({
    help: TileHelpEffect,
    display: Display,
    transform: Transform,
}) {}
