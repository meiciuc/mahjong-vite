import { defineNode } from '@ash.ts/ash';
import { Display } from '../components/Display';
import { Transform } from '../components/Transform';

export class DisplayNode extends defineNode({
    display: Display,
    transform: Transform,
}) {}
