import React from 'react';
import { View, ScrollView } from 'react-native';
import get from 'lodash/get';

import { loginAccountSelector } from '../../store/selectors/account';
import { useAppSelector } from '../../hooks';

import DescriptionLayout from '../../components/DescriptionLayout/DescriptionLayout';
import InformationFiled from './components/InformationFiled';
import { Section, SectionField, sections } from './constants';
import styles from './styles';

const Security = () => {
  const account = useAppSelector(loginAccountSelector);

  const sectionRender = (section: Section, index: number) => (
    <DescriptionLayout
      key={`section_${index}`}
      title={section.title}
      description={section.description}>
      <View style={styles.content}>
        {section?.fields?.map((item: SectionField, _index: number) => (
          <InformationFiled
            {...item}
            value={get(account, item.key)}
            key={`${item.key}_${_index}`}
          />
        ))}
      </View>
    </DescriptionLayout>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        {sections.map((section: Section, index: number) =>
          sectionRender(section, index),
        )}
      </View>
    </ScrollView>
  );
};

export default Security;
