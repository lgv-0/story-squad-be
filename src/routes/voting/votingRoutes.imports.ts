import { Stories } from '../../database/entity';
import { Transcribed_Pages } from '../../database/entity/Pages';

export class illustrationReturn {
    childId: number;
    illustration: string;

    constructor() {
        this.childId = null;
        this.illustration = null;
    }
}

export class storyReturn {
    childId: number;
    doc_length: number;
    story: Stories;
    transcribed_text: Transcribed_Pages;

    constructor() {
        this.childId = null;
        this.doc_length = null;
        this.story = null;
        this.transcribed_text = null;
    }
}

export const emojiSelection = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😇',
    '😋',
    '😜',
    '😝',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '😞',
    '😪',
    '😴',
    '😷',
    '😎',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '😦',
    '😧',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😩',
    '😫',
    '😤',
];
