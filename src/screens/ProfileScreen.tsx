import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch } from '../hooks';
import { accountLogout } from '../mainSlice';
import { colors } from '../util/colors';
import { TableCell } from '../components/TableCell';
import { spacing } from '../util/spacing';

export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'profile'>,
  NativeStackScreenProps<RootStackParams>
>;

export const ProfileScreen = (props: ProfileScreenProps) => {
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();

  const onLogout = () => {
    dispatch(accountLogout());
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={{ marginTop: headerHeight }}>
      <View
        style={{ marginHorizontal: spacing.lg, marginVertical: spacing.lg }}>
        <TableCell
          label="Log Out"
          onPress={onLogout}
          iconLeft={{ name: 'log-out-outline' }}
          iconRight={{
            name: 'chevron-forward-outline',
            color: colors.inkLighter,
            size: 22,
          }}
        />
      </View>
    </ScrollView>
  );
};
