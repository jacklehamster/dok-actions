import { ValueOf } from "../types/ValueOf";
import { ObjectResolution } from "./ObjectResolution";
export declare function calculateObject<T extends any = object, U = object | undefined>(value: ObjectResolution, defaultValue?: U): ValueOf<T | U>;
