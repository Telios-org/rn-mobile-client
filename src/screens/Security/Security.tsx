import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';

import { loginAccountSelector } from '../../store/selectors/account';
import { useAppSelector } from '../../hooks';

import DescriptionLayout from '../../components/DescriptionLayout/DescriptionLayout';
import InformationFiled from './components/InformationFiled';
import { sections } from './constants';
import styles from './styles';

const Security = () => {
  const account = useAppSelector(loginAccountSelector);

  const sectionRender = (section, index) => (
    <DescriptionLayout
      key={`section_${index}`}
      title={section.title}
      description={section.description}>
      <View style={styles.content}>
        {section?.fields?.map((item, index) => (
          <InformationFiled
            {...item}
            value={account?.[item.key]}
            key={`${item.key}_${index}`}
          />
        ))}
      </View>
    </DescriptionLayout>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        {sections.map((section, index) => sectionRender(section, index))}
      </View>
    </ScrollView>
  );
};

export default Security;
