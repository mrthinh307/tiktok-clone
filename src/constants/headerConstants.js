import {
  ProfileIcon,
  CoinIcon,
  SettingIcon,
  CreatorIcon,
  LanguageIcon,
  FeedbackIcon,
  DarkModeIcon,
  LogoutIcon,
  ReportIcon,
  MarkIrrelevantIcon,
} from '~/assets/images/icons';

export const USER_MENU_BUTTON_PROPS = {
  buttonPadding: 'medium',
  iconSize: 'small',
  hoverType: 'background',
  hiddenDelayTime: 700,
};

const LANGUAGE_BUTTON_PROPS = {
  titleSize: 'small',
  fontType: 'regular',
};

export const LANGUAGE_LISTS = [
  {
    field: 'language',
    code: 'ar',
    title: 'Arabic',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'bn',
    title: 'Bengali',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'bg',
    title: 'Bulgarian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'my',
    title: 'Burmese',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ceb',
    title: 'Cebuano',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'zh-CN',
    title: 'Chinese (Simplified)',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'zh-TW',
    title: 'Chinese (Traditional)',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'hr',
    title: 'Croatian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'cs',
    title: 'Czech',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'da',
    title: 'Danish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'nl',
    title: 'Dutch',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'en',
    title: 'English',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'fil',
    title: 'Filipino',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'fi',
    title: 'Finnish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'fr',
    title: 'French',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'de',
    title: 'German',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'el',
    title: 'Greek',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'gu',
    title: 'Gujarati',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'hi',
    title: 'Hindi',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'hu',
    title: 'Hungarian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'id',
    title: 'Indonesian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'it',
    title: 'Italian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ja',
    title: 'Japanese',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'jv',
    title: 'Javanese',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'kn',
    title: 'Kannada',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'kk',
    title: 'Kazakh',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'km',
    title: 'Khmer',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ko',
    title: 'Korean',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'lv',
    title: 'Latvian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'lt',
    title: 'Lithuanian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ms',
    title: 'Malay',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ml',
    title: 'Malayalam',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'mr',
    title: 'Marathi',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'or',
    title: 'Odia',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'pl',
    title: 'Polish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'pt',
    title: 'Portuguese (Brazilian)',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'pa',
    title: 'Punjabi',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ro',
    title: 'Romanian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ru',
    title: 'Russian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'es',
    title: 'Spanish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'sv',
    title: 'Swedish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'ta',
    title: 'Tamil',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'te',
    title: 'Telugu',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'th',
    title: 'Thai',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'tr',
    title: 'Turkish',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'uk',
    title: 'Ukrainian',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'uz',
    title: 'Uzbek',
    ...LANGUAGE_BUTTON_PROPS,
  },
  {
    field: 'language',
    code: 'vi',
    title: 'Vietnamese',
    ...LANGUAGE_BUTTON_PROPS,
  },
];

export const USER_OPTIONS = [
  {
    icon: <ProfileIcon />,
    title: 'View profile',
  },
  {
    icon: <CoinIcon />,
    title: 'Get coins',
  },
  {
    icon: <CreatorIcon />,
    title: 'Creator tools',
  },
  {
    icon: <SettingIcon />,
    title: 'Settings',
  },
  {
    icon: <LanguageIcon />,
    title: 'English (US)',
    children: {
      title: 'Language',
      data: LANGUAGE_LISTS,
    },
  },
  {
    icon: <FeedbackIcon />,
    title: 'Feedback and help',
  },
  {
    icon: <DarkModeIcon />,
    title: 'Dark mode',
  },
  {
    icon: <LogoutIcon />,
    title: 'Log out',
    seperate: true,
  },
];

export const SEARCH_ACCOUNT_OPTIONS = [
  {
    icon: <ReportIcon />,
    title: 'Report',
  },
  {
    icon: <MarkIrrelevantIcon />,
    title: 'Mark as irrelevant',
    seperate: true,
  },
];

export const SEARCH_ACCOUNT_BUTTON_PROPS = {
  buttonPadding: 'small',
  iconSize: 'medium',
  hoverType: 'font',
};
