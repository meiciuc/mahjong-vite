import { defineNode } from '@ash.ts/ash';
import { PathAnimatedAroundTileView } from '../../../view/PathAnimatedAroundTileView';

export class AroundTileNode extends defineNode({
    around: PathAnimatedAroundTileView
}) { }
