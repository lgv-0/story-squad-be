export interface Transcribable {
    images: string[];
}

export interface Transcription {
    images: string[];
    metadata: Metadata[];
}

export interface Metadata {
    [key: string]: string;
}

export interface Readable {
    story: string;
}

export interface Readability {
    flesch_reading_ease: number;
    smog_index: number;
    flesch_kincaid_grade: number;
    coleman_liau_index: number;
    automated_readability_index: number;
    dale_chall_readability_score: number;
    difficult_words: number;
    linsear_write_formula: number;
    gunning_fog: number;
    consolidated_score: number;
    doc_length: number;
    quote_count: number;
}

// An interface used to determine what scripts are valid for `runScripts()`
export interface Scripts {
    // Each script path should be used as a key here, the keys are used in the `keyof Scripts` param of `runScripts()`
    './src/util/scripts/transcription.py': {
        input: Transcribable; // This is the data shape that the script is built for
        output: Transcription; // This is the data shape of the expected output of the script
    };
    './src/util/scripts/readability.py': {
        input: Readable; // This is the data shape that the script is built for
        output: Readability; // This is the data shape of the expected output of the script
    };
}
