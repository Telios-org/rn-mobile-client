import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../util/colors';

export const TestScreen = () => {
  const onPress = () => {
    console.log('press');
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <Button title="Test" onPress={onPress} />
      <Button title="Test" type="secondary" onPress={onPress} />
      <Button title="Test" type="outline" onPress={onPress} />
      <Button title="Test" type="text" onPress={onPress} />
      <Button size="large" title="Test with long title" onPress={onPress} />
      <Button size="small" title="Test with long title" onPress={onPress} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button size="small" title="Test" type="secondary" onPress={onPress} />
      </View>
    </ScrollView>
  );
};
