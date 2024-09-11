export const NAVBAR_CATEGORY = {
  ANNOUNCEMENT: {
    name: '공지사항',
    path: 'announcement',
  },
  COLUMN: {
    name: '칼럼',
    path: 'column',
  },
  FAQ: {
    name: 'FAQ',
    path: 'faq',
  },
} as const;

export type NavbarCategory =
  (typeof NAVBAR_CATEGORY)[keyof typeof NAVBAR_CATEGORY];
