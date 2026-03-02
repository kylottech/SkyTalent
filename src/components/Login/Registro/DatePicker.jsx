import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from "../../../context/useUser";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;

// Fecha base
const today = new Date();
const fallbackDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
const maxYear = today.getFullYear() - 16;
const minYear = today.getFullYear() - 100;

// Función que devuelve el número de días de un mes, teniendo en cuenta los años bisiestos
const getDaysInMonth = (month, year) => {
  if (month === 1) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }
  return 31;
};

export default function DatePicker({ onDateChange, initialDate }) {
  const { texts } = useUser();
  const screenTexts = texts.components.Login.Registro.DatePicker;

  const MONTHS = [
    screenTexts.January, screenTexts.February, screenTexts.March, screenTexts.April,
    screenTexts.May, screenTexts.June, screenTexts.July, screenTexts.August,
    screenTexts.September, screenTexts.October, screenTexts.November, screenTexts.December
  ];

  // Usar initialDate si se proporciona, si no usar fallback
  let parsedDate = fallbackDate;
  if (initialDate && typeof initialDate === 'string') {
    const parts = initialDate.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      parsedDate = new Date(year, month - 1, day);
    }
  }

  const [selectedMonth, setSelectedMonth] = useState(parsedDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(parsedDate.getDate());
  const [selectedYear, setSelectedYear] = useState(parsedDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(parsedDate.getMonth(), parsedDate.getFullYear()));

  const scrollY = {
    month: useSharedValue(selectedMonth * ITEM_HEIGHT),
    day: useSharedValue((selectedDay - 1) * ITEM_HEIGHT),
    year: useSharedValue((selectedYear - minYear) * ITEM_HEIGHT),
  };

  useEffect(() => {
    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    onDateChange?.(formattedDate);
  }, [selectedMonth, selectedDay, selectedYear, onDateChange]);

  useEffect(() => {
    const days = getDaysInMonth(selectedMonth, selectedYear);
    setDaysInMonth(days);
    if (selectedDay > days) {
      setSelectedDay(days);
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  const createScrollHandler = (key, setSelected, items) => {
    return useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY[key].value = event.contentOffset.y;
      },
      onEndDrag: (event) => {
        const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
        const boundedIndex = Math.max(0, Math.min(index, items.length - 1));
        runOnJS(setSelected)(items[boundedIndex]);
      },
    });
  };

  const renderScrollColumn = (type, items, selected, setSelected, offset) => {
    return (
      <Animated.ScrollView
        style={styles.scrollColumn}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={createScrollHandler(type, setSelected, items)}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        contentOffset={{ y: offset }}
      >
        {items.map((item, index) => {
          const isSelected = selected === item;
          return (
            <View
              key={index}
              style={[styles.scrollItem, isSelected && styles.selectedScrollItem]}
            >
              <Text
                style={[styles.scrollText, isSelected && styles.selectedScrollText]}
              >
                {typeof item === 'number' ? item.toString().padStart(2, '0') : item}
              </Text>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        {renderScrollColumn('month', MONTHS, MONTHS[selectedMonth], (month) =>
          setSelectedMonth(MONTHS.indexOf(month)), selectedMonth * ITEM_HEIGHT)}
        {renderScrollColumn('day', days, selectedDay, (day) =>
          setSelectedDay(day), (selectedDay - 1) * ITEM_HEIGHT)}
        {renderScrollColumn('year', years, selectedYear, (year) =>
          setSelectedYear(year), (selectedYear - minYear) * ITEM_HEIGHT)}
      </View>
      <View style={styles.centerOverlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scrollColumn: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 100,
  },
  scrollItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedScrollItem: {
    opacity: 1,
  },
  scrollText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedScrollText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centerOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
