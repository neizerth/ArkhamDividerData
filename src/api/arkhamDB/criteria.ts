import { hasPropEquals, hasPropNotEquals } from "../../util/criteria";

export const withCode = hasPropEquals('code');
export const withoutCode = hasPropNotEquals('code');