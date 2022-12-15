import Config from 'react-native-config';

export const BASE_URL: string = Config.API_URL || '';

export const API_MEMBERSHIP_PLANS: string = `${BASE_URL}/stripe/plans`;
export const API_MAIL_AVAILABILITY: string = `${BASE_URL}/mailbox/addresses`;
