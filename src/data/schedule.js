import { getISOWeek, getDay } from 'date-fns';

export const getWorkoutForDate = (date) => {
    const dayOfWeek = getDay(date); // 0 = Sun, 1 = Mon, ..., 3 = Wed, 5 = Fri
    const weekNumber = getISOWeek(date);
    const isEvenWeek = weekNumber % 2 === 0;

    // Active days: Wednesday (3), Friday (5), Sunday (0)
    if (dayOfWeek !== 3 && dayOfWeek !== 5 && dayOfWeek !== 0) {
        return 'Rest';
    }

    // Schedule Pattern:
    // Odd Week: Wed(A), Fri(B), Sun(A)
    // Even Week: Wed(B), Fri(A), Sun(B)

    if (!isEvenWeek) {
        // Odd Week
        if (dayOfWeek === 3) return 'A';
        if (dayOfWeek === 5) return 'B';
        if (dayOfWeek === 0) return 'A';
    } else {
        // Even Week
        if (dayOfWeek === 3) return 'B';
        if (dayOfWeek === 5) return 'A';
        if (dayOfWeek === 0) return 'B';
    }

    return 'Rest'; // Fallback
};
