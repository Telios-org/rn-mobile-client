import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';

export const SearchScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={fonts.large.medium}>Not Implemented</Text>
      </View>
    </ScrollView>
  );
};
