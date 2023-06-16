import { defineNode } from '@ash.ts/ash';
import { Grid } from '../components/Grid';

export class GridNode extends defineNode({
    grid: Grid
}) {}
