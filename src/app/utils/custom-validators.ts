import { AbstractControl, ValidatorFn } from '@angular/forms';

export function DateAfterValidator(
    beforeControl: AbstractControl,
    currentDate: Date,
): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value && beforeControl.value) {
            let startDate: Date | null = convertTimeStringToDate(
                beforeControl.value,
                currentDate,
            );
            let endDate: Date | null = convertTimeStringToDate(
                control.value,
                currentDate,
            );

            if (
                startDate &&
                endDate &&
                startDate.getTime() >= endDate.getTime()
            ) {
                return { DateAfterValidator: { value: control.value } };
            } else if (!beforeControl.valid) {
                beforeControl.updateValueAndValidity();
            }
        }

        return null;
    };
}

export function DateBeforeValidator(
    afterControl: AbstractControl,
    currentDate: Date,
): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value && afterControl.value) {
            let startDate: Date | null = convertTimeStringToDate(
                control.value,
                currentDate,
            );
            let endDate: Date | null = convertTimeStringToDate(
                afterControl.value,
                currentDate,
            );

            if (
                startDate &&
                endDate &&
                startDate.getTime() >= endDate.getTime()
            ) {
                return { DateBeforeValidator: { value: control.value } };
            } else if (!afterControl.valid) {
                afterControl.updateValueAndValidity();
            }
        }

        return null;
    };
}

function convertTimeStringToDate(timeString: string, date: Date) {
    const convertedDate = new Date(date);

    // Regular expression to match time string in the format "11:15 pm"
    const regex = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i;
    const match = timeString.match(regex);

    if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3]?.toLowerCase(); // "am" or "pm" if present

        // Convert hours to 24-hour format if needed
        if (period === 'pm' && hours < 12) {
            hours += 12;
        } else if (period === 'am' && hours === 12) {
            hours = 0; // midnight
        }

        convertedDate.setHours(hours);
        convertedDate.setMinutes(minutes);
        convertedDate.setSeconds(0); // Optional: Set seconds to zero

        return convertedDate;
    }

    return null; // Return null if the time string doesn't match the expected format
}
