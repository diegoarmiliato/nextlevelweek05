export const convertDurationToTimeString = (duration: number) => {
  const hour = Math.floor(duration / (60 * 60));
  const minute = Math.floor((duration % (60 * 60)) / 60);
  const second = duration % 60;

  const timeString = [ hour, minute, second ]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

  return timeString;
}