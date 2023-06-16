import { defineNode } from '@ash.ts/ash';
import { Display } from '../../display/components/Display';
import { Transform } from '../../display/components/Transform';
import { GridPosition } from '../components/GridPosition';
import { Icon } from '../components/Icon';
import { Tile } from '../components/Tile';

export class TileNode extends defineNode({
    tile: Tile,
    icon: Icon,
    display: Display,
    transform: Transform,
    gridPosition: GridPosition,
}) {}
