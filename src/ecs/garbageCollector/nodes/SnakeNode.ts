import { defineNode } from '@ash.ts/ash';
import { PathAnimatedLikeSnakeView } from '../../../view/PathAnimatedLikeSnakeView';

export class SnakeNode extends defineNode({
    snake: PathAnimatedLikeSnakeView
}) { }
