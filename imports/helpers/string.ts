import { placeZero } from "./number";

export const formatTime = (time: number[]) =>
  `${placeZero(time[0])}:${placeZero(time[1])}`;
