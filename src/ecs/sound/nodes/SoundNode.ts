import { defineNode } from '@ash.ts/ash';
import { SoundComponent } from '../components/SoundComponent';

export class SoundNode extends defineNode({
    sound: SoundComponent,
}) { }
