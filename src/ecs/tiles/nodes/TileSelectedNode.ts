import { defineNode } from '@ash.ts/ash';
import { Display } from '../../display/components/Display';
import { Transform } from '../../display/components/Transform';
import { GridPosition } from '../components/GridPosition';
import { Icon } from '../components/Icon';
import { Selected } from '../components/Selected';
import { Tile } from '../components/Tile';

export class TileSelectedNode extends defineNode({
    tile: Tile,
    gridPosition: GridPosition,
    icon: Icon,
    display: Display,
    transform: Transform,
    selected: Selected,
}) {}
