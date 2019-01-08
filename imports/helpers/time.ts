import * as moment from "moment";

export const formatMomentToDb = date => [date.hours(), date.minutes()];
