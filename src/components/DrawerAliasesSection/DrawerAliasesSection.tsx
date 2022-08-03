import React from 'react';
import { useSelector } from 'react-redux';
import { DrawerCell } from '../DrawerCell/DrawerCell';
import {
  aliasesComputedSelector,
  namespaceComputedSelector,
} from '../../store/aliasesSelectors';
import { Text, View } from 'react-native';
import { fonts } from '../../util/fonts';
import { IconButton } from '../IconButton';
import { colors } from '../../util/colors';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { DrawerCollapseNamespace } from '../DrawerCollapseAliases/DrawerCollapseAliases';
import { Route } from '@react-navigation/native';
import styles from './styles';

interface DrawerAliasesProps {
  navigation: DrawerNavigationHelpers;
  selectedRoute: Route<string>;
}

export default ({ navigation, selectedRoute }: DrawerAliasesProps) => {
  const aliases = useSelector(aliasesComputedSelector);
  const aliasNamespaces = useSelector(namespaceComputedSelector);

  const onManageAliases = () => {
    navigation.navigate('aliasManage');
  };

  return (
    <>
      <View style={styles.sectionTitle}>
        <Text style={fonts.title3}>{'Aliases'}</Text>
        <IconButton
          onPress={onManageAliases}
          name="options-outline"
          color={colors.primaryBase}
          style={styles.aliasManageButton}
        />
      </View>
      <View>
        {aliasNamespaces.map(aliasNamespace => (
          <DrawerCollapseNamespace
            navigation={navigation}
            selectedRoute={selectedRoute}
            key={aliasNamespace._id}
            aliases={aliases}
            namespaceKey={aliasNamespace.name}
          />
        ))}
        <DrawerCell
          label="Add Alias"
          rightIcon={{ name: 'add-outline', color: colors.primaryBase }}
          onPress={onManageAliases}
        />
      </View>
    </>
  );
};
