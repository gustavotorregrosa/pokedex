//demonstrational purpose
import { IPokemon } from "./domain.interface";

export class Pokemon implements IPokemon {
    private _id: string;
    private _name: string;
    private _moves: string[];
    private _images: string[];

    constructor(id: string, name: string, moves: string[], images: string[]) {
        this._id = id;
        this._name = name;
        this._moves = moves;
        this._images = images;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get moves(): string[] {
        return this._moves;
    }

    set moves(value: string[]) {
        this._moves = value;
    }

    get images(): string[] {
        return this._images;
    }

    set images(value: string[]) {
        this._images = value;
    }
}
