import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text } from 'react-native';
import moment from 'moment-timezone';

const CountdownToMidnight = () => {
  const [timeRemaining, setTimeRemaining] = useState('00 : 00 : 00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = moment.tz("Europe/Madrid");
      const midnight = moment.tz("Europe/Madrid").endOf('day');
      const diff = midnight.diff(now);
      const duration = moment.duration(diff);
      const hours = String(duration.hours()).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');

      setTimeRemaining(`${hours} : ${minutes} : ${seconds}`);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      <Text style={styles.countdown}>{timeRemaining}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  countdown:{
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
  }

});

export default CountdownToMidnight;
