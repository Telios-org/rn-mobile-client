import { Alias } from '../../store/aliases';
import React, { useEffect, useMemo, useState } from 'react';
import { Route, View } from 'react-native';
import { DrawerCell } from '../DrawerCell/DrawerCell';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import styles from './styles';

interface DrawerCollapseItemProps {
  navigation: DrawerNavigationHelpers;
  selectedRoute: Route;
  aliases: Alias[];
  namespaceKey: string;
}

export const DrawerCollapseNamespace = (
  { navigation, selectedRoute, aliases, namespaceKey }: DrawerCollapseItemProps,
  key: string,
) => {
  const [expanded, setExpanded] = useState(false);
  const [filteredAliases, setFilteredAliases] = useState<Alias[]>([]);

  const onPressNamespace = () => {
    setExpanded(!expanded);
  };

  const onPressAlias = (aliasId: string) => {
    navigation.navigate('aliasInbox', { aliasId, namespaceKey });
  };

  const totalUnreadCount = useMemo(() => {
    return filteredAliases.reduce((acc, alias) => acc + alias.count, 0);
  }, [filteredAliases]);

  useEffect(() => {
    if (expanded) {
      setFilteredAliases(
        aliases.filter(alias => alias.namespaceKey === namespaceKey),
      );
    }
  }, [expanded, aliases]);

  return (
    <View>
      <DrawerCell
        key={key}
        focused={
          selectedRoute.name === 'aliasInbox' &&
          selectedRoute.params.namespaceKey === namespaceKey
        }
        rightText={totalUnreadCount > 0 ? `${totalUnreadCount}` : undefined}
        label={`# ${namespaceKey}`}
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
                  item.aliasId === selectedRoute.params.aliasId
                }
                rightText={item.count > 0 ? `${item.count}` : undefined}
                label={`@ ${item.name}`}
                onPress={() => onPressAlias(item.aliasId)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};
