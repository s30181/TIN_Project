export const queryKeys = {
  // Auth
  currentUser: ['currentUser'] as const,

  // Users
  user: (id: number) => ['user', id] as const,
  userEvents: (id: number, page?: number, limit?: number) =>
    ['userEvents', id, page, limit] as const,
  userReservations: (id: number) => ['userReservations', id] as const,

  // Events
  events: (page?: number, limit?: number) => ['events', page, limit] as const,
  event: (id: number) => ['event', id] as const,
  eventReservations: (eventId: number) =>
    ['eventReservations', eventId] as const,
  myEvents: (page?: number, limit?: number) =>
    ['myEvents', page, limit] as const,

  // Reservations
  reservations: (page?: number, limit?: number) =>
    ['reservations', page, limit] as const,
  reservation: (id: number) => ['reservation', id] as const,
  myReservations: ['myReservations'] as const,
} as const
