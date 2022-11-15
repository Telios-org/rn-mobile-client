import React, { useMemo, useState } from 'react';
import { Route, View } from 'react-native';
import { DrawerCell } from '../DrawerCell/DrawerCell';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import styles from './styles';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { filterAliasesByNamespace } from '../../store/selectors/aliases';

interface DrawerCollapseItemProps {
  navigation: DrawerNavigationHelpers;
  selectedRoute: Route;
  namespaceKey: string;
}

export const DrawerCollapseNamespace = (
  { navigation, selectedRoute, namespaceKey }: DrawerCollapseItemProps,
  key: string,
) => {
  const [expanded, setExpanded] = useState(false);
  const aliasesByNamespace = useSelector(filterAliasesByNamespace);
  const filteredAliases = aliasesByNamespace[namespaceKey];
  const isRandom = namespaceKey === 'random';

  const totalUnreadCount = useMemo(() => {
    return filteredAliases.reduce((acc, alias) => acc + alias.count, 0);
  }, [filteredAliases]);

  const onPressNamespace = () => {
    setExpanded(!expanded);
  };

  const onPressAlias = (aliasId: string) => {
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'aliasInbox');
      return CommonActions.reset({
        ...state,
        routes: [
          ...routes,
          { name: 'aliasInbox', params: { aliasId, namespaceKey } },
        ],
        index: routes.length - 1,
      });
    });
    navigation.navigate('aliasInbox', { aliasId, namespaceKey });
  };

  return (
    <View>
      <DrawerCell
        key={key}
        focused={
          selectedRoute.name === 'aliasInbox' &&
          selectedRoute.params.namespaceKey === namespaceKey
        }
        rightText={totalUnreadCount > 0 ? `${totalUnreadCount}` : undefined}
        label={namespaceKey}
        leftIcon={
          isRandom
            ? { name: 'flash-outline', size: 16 }
            : { name: 'arrow-redo-outline', size: 16 }
        }
        leftIconStyle={styles.iconWidth}
        onPress={onPressNamespace}
      />
      {filteredAliases.length > 0 && expanded && (
        <View style={styles.collapseContainer}>
          {filteredAliases.map(item => {
            return (
              <DrawerCell
                key={`aliasitem-${item.name}`}
                focused={
                  selectedRoute.name === 'aliasInbox' &&
                  item._id === selectedRoute.params.aliasId
                }
                leftIcon={{ name: 'at', size: 14 }}
                leftIconStyle={styles.iconWidth}
                rightText={item.count > 0 ? `${item.count}` : undefined}
                label={item.name}
                onPress={() => onPressAlias(item._id)}
                titleStyle={styles.aliasTitle}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};
