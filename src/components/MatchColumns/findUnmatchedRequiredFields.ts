import { Fields} from "../../types";
import {Columns} from "../Steps/MatchColumns";

export const findUnmatchedRequiredFields = <T extends string>(fields: Fields<T>, columns: Columns<T>) =>
  fields
    .filter((field) => field.validations?.some((validation) => validation.rule === "required"))
    .filter((field) => columns.findIndex((column) => "value" in column && column.value === field.key) === -1)
    .map((field) => field.label) || []
