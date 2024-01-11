import { useContext } from "react"
import type { RsiProps } from "../types"
import type { MarkRequired } from "ts-essentials"
import type { Translations } from "../translationsRSIProps"
import {RsiContext} from "../Providers";
import {translations} from "../translationsRSIProps";

export const defaultRSIProps: Partial<RsiProps<any>> = {
    allowInvalidSubmit: true,
    translations: translations,
    uploadStepHook: async (value) => value,
    selectHeaderStepHook: async (headerValues, data) => ({ headerValues, data }),
    matchColumnsStepHook: async (table) => table,
    dateFormat: "yyyy-mm-dd", // ISO 8601,
    parseRaw: true,
} as const

export const useRsi = <T extends string>() =>
    useContext<MarkRequired<RsiProps<T>, keyof typeof defaultRSIProps> & { translations: Translations }>(RsiContext)
