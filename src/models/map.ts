export interface Path {
    path: number[][];
    color: string;
}

export interface Point {
    name: string;
    lng: number;
    lat: number;
    color: string;
}

export interface Map {
    bookIndex: number;
    chapterIndex: number;
    paths: Path[];
    points: Point[];
}
