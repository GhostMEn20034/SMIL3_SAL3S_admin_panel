import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function ControlledDateTimePicker(props) {

  const showHours =  props.showHours ? props.showHours : false;
  const showMinutes = props.showMinutes ? props.showMinutes : false;
  const showSeconds = props.showSeconds ? props.showSeconds : false;

  let viewRenderers = {}

  if (showHours) {
    viewRenderers["hours"] = renderTimeViewClock;   
  }
  if (showMinutes) {
    viewRenderers["minutes"] = renderTimeViewClock;
  }
  if (showSeconds) {
    viewRenderers["seconds"] = renderTimeViewClock;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={props.label}
          value={props.value}
          onChange={(newValue) => props.setValue(newValue)}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
    </LocalizationProvider>
  );
}