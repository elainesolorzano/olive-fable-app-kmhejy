
export interface ModalDemo {
  route: string;
  title: string;
  description: string;
  icon: string;
  iosIcon: string;
}

export const modalDemos: ModalDemo[] = [
  {
    route: '/learn',
    title: 'Learn',
    description: 'Educational content library with posing tips, session prep guides, and photography tutorials.',
    icon: 'school',
    iosIcon: 'book.fill',
  },
  {
    route: '/book',
    title: 'Book a Session',
    description: 'Discover our luxury pet portrait sessions and book with Olive & Fable.',
    icon: 'calendar-today',
    iosIcon: 'calendar',
  },
  {
    route: '/workshops',
    title: 'Workshops',
    description: 'Coming soon: Workshops for pet parents who want better photos and deeper connection.',
    icon: 'event',
    iosIcon: 'star.fill',
  },
  {
    route: '/my-studio',
    title: 'My Studio',
    description: 'Your account hub with membership status, saved content, and client portal access.',
    icon: 'person',
    iosIcon: 'person.circle.fill',
  },
];
