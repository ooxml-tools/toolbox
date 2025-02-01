"use client"
import validate from "@ooxml-tools/validate";
import { expose } from "comlink";

export type ValidateFn = typeof validate 

expose(validate);