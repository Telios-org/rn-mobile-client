import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';

import { format } from 'date-fns';
import DescriptionLayout from '../../components/DescriptionLayout/DescriptionLayout';
import Section from './components/Section/Section';
import { Icon } from '../../components/Icon';
import { selectAccountStats } from '../../store/selectors/account';
import { useAppSelector } from '../../hooks';

import { humanFileSize } from '../../util/attachment';
import { colors } from '../../util/colors';
import { Result } from '../../util/types';
import envApi from '../../../env_api.json';

import styles from './styles';

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  order: number;
  features: string[];
  maxOutgoingEmails: number;
  maxAliasNames: number;
  maxAliasAddresses: number;
  maxGBCloudStorage: number;
  maxGBBandwidth: number;
};
const DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy p';

const PlanAndUsage = () => {
  const stats = useAppSelector(selectAccountStats);
  const [currentPlan, setCurrentPlan] = useState<Plan | undefined>(undefined);

  useEffect(() => {
    getMyCurrentPlan();
  }, [stats?.plan]);

  const getMyCurrentPlan = async () => {
    const availablePlans = await getAvailableAllPlans();
    const myCurrentPlan = availablePlans?.find(
      plan => plan?.id?.toUpperCase() === stats?.plan?.toUpperCase(),
    );
    setCurrentPlan(myCurrentPlan);
  };

  const getAvailableAllPlans = useCallback(async () => {
    const availablePlansResp = await getAvailablePlans();
    let currentPlans: Array<Plan> | undefined;
    if (availablePlansResp?.type === 'success') {
      currentPlans = availablePlansResp?.value?.plans;
    }
    return currentPlans;
  }, []);

  const formattedEmailResetDate = stats?.dailyEmailResetDate
    ? format(new Date(stats?.dailyEmailResetDate), DISPLAY_DATE_FORMAT)
    : '';

  return (
    <ScrollView>
      <View style={styles.container}>
        <DescriptionLayout
          title="Current Plan"
          description="Lists your current subscription with Telios and allows you to manage your billing preferences">
          <View style={[styles.sectionContainer, styles.content]}>
            <Image
              source={{ uri: 'logo-no-text' }}
              style={styles.logo}
              resizeMode={'contain'}
            />
            <View style={styles.sectionHeaderTitle}>
              <Text style={styles.sectionHeader}>
                {stats?.plan && `${stats?.plan} Plan`}
              </Text>
              <Text style={styles.sectionDescription} numberOfLines={3}>
                {currentPlan?.description}
              </Text>
            </View>
          </View>
        </DescriptionLayout>
        <DescriptionLayout
          title="Usage"
          description="An accounting of your plan resource consumption.">
          <Section
            title={'Email Traffic'}
            description={`Limit will reset on ${formattedEmailResetDate}`}
            leftIcon={
              <Icon
                name={'ios-trending-up'}
                color={colors.secondaryBase}
                size={34}
              />
            }
            percentData={[
              {
                name: 'Emails Sent out of Network',
                total: stats?.maxOutgoingEmails,
                completed: stats?.dailyEmailUsed,
              },
            ]}
          />
          <Section
            title={'Namespaces'}
            description={'Includes disabled aliases and namespaces'}
            leftIcon={<Text style={styles.hashtagText}>#</Text>}
            percentData={[
              {
                name: 'Namespaces',
                total: stats?.maxAliasNames,
                completed: stats?.namespaceUsed,
              },
              {
                name: 'Alias Addresses',
                total: stats?.maxAliasAddresses,
                completed: stats?.aliasesUsed,
              },
            ]}
          />
          <Section
            title={'Storage'}
            description={'Includes all of your encrypted data and metadata'}
            leftIcon={
              <Icon
                name={'ios-server-outline'}
                color={colors.secondaryBase}
                size={34}
              />
            }
            percentData={[
              {
                name: 'Server Backup',
                total: humanFileSize({
                  bytes: (stats?.maxGBCloudStorage || 0) * 1000000000,
                  si: true,
                  dp: 2,
                }),
                completed: humanFileSize({
                  bytes: stats?.storageSpaceUsed,
                  si: true,
                  dp: 2,
                }),
              },
            ]}
          />
        </DescriptionLayout>
      </View>
    </ScrollView>
  );
};

export default PlanAndUsage;

const getAvailablePlans = async (): Promise<Result<{ plans: Array<Plan> }>> => {
  const emailPostfix = envApi.dev;
  try {
    const response = await fetch(`${emailPostfix}/stripe/plans`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const jsonResp = await response.json();
      const plans = jsonResp?.plans;
      return { type: 'success', value: { plans: plans } };
    } else {
      return {
        type: 'error',
        error: new Error('An error occurred. Please try again later.'),
      };
    }
  } catch (error) {
    return {
      type: 'error',
      error: new Error('An error occurred. Please try again later.'),
    };
  }
};
