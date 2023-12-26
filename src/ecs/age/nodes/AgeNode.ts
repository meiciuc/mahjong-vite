import { defineNode } from '@ash.ts/ash';
import { AgeComponent } from '../components/AgeComponent';

export class AgeNode extends defineNode({
    age: AgeComponent,
}) { }
