import { useDate } from 'vuetify/framework';
import {
  TodoShortTimeObj,
  TodoWithMultipleDates,
} from '@/types';

export function useDateConfigurator() {
  const {
    isValid,
    getDate,
    endOfMonth,
    setDate,
    isSameDay,
    getHours,
    getMinutes,
  } = useDate();

  const getDaysFromCurrentForTheEndOfMonth = (
    value: Date,
  ): Date[] => {
    if (!isValid(value)) {
      console.error('Не верный формат даты', value);
    }

    const startDayNum = getDate(value);
    const endDayNum = getDate(endOfMonth(value));
    // кол-во задач, которые нужно добавить до конца месяца
    const daysNum = endDayNum - startDayNum;
    const daysArray: Date[] = new Array(daysNum);

    daysArray[0] = value;
    for (let i = 1; i <= daysNum; i++) {
      daysArray[i] = getNextDayDate(daysArray[i - 1]);
    }

    return daysArray;
  };

  const setTimeForDate = (
    value: Date,
    hours = 0,
    minutes = 0,
  ) => {
    if (!isValid(value)) {
      console.error('Не верный формат даты', value);
    }

    const newDate = new Date(value);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
  };

  const getDatesTimeObjects = ({
    deferred,
    start,
    end,
  }: TodoWithMultipleDates): TodoShortTimeObj[] => {
    return deferred.map((item): TodoShortTimeObj => {
      return <TodoShortTimeObj>{
        deferred: item,
        start: setTimeForDate(
          item,
          getHours(start),
          getMinutes(start),
        ),
        end: setTimeForDate(
          item,
          getHours(end),
          getMinutes(end),
        ),
      };
    });
  };

  const getEveryNDayForTheEndOfMonth = (
    startDate: Date,
    selectedDaysNum: number[],
  ) => {
    const datesArr =
      getDaysFromCurrentForTheEndOfMonth(startDate);

    return datesArr.reduce((accum, item) => {
      const dayNum = new Date(item).getDay();
      if (selectedDaysNum.includes(dayNum)) {
        accum.push(item);
      }
      return accum;
    }, [] as Date[]);
  };

  /**
   * Изменяет только дату. Время остается тем же
   * @param value
   */
  const getNextDayDate = (value: Date) => {
    if (!isValid(value)) {
      console.error('Не верный формат даты', value);
    }
    if (isSameDay(value, endOfMonth(value))) {
      return value;
    }
    const dayNum = getDate(value);
    return setDate(value, dayNum + 1) as Date;
  };

  /**
   * Возвращает функцию для вычитания указанного количества месяцев из даты.
   * Реализует паттерн частичного применения.
   *
   * @param monthsCount - Количество месяцев для вычитания
   * @returns Функция, принимающая дату и возвращающая новую дату
   */
  const getSeveralMonthsAgoDate = (
    monthsCount: number = 1,
  ) => {
    return (date: Date): Date => {
      return new Date(
        date.getFullYear(),
        date.getMonth() - monthsCount,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      );
    };
  };

  const getThreeMonthsAgoDate = getSeveralMonthsAgoDate(3);

  const getHumanizedDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return {
    getDaysFromCurrentForTheEndOfMonth,
    getEveryNDayForTheEndOfMonth,
    getDatesTimeObjects,
    setTimeForDate,
    getHumanizedDate,
    getThreeMonthsAgoDate,
    isSameDay,
  };
}
