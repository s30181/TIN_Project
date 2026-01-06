import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { UserAvatarIcon } from './shared/user-avatar'
import { UserRoleBadge } from './shared/user-role-badge'
import type { UserDto } from '@/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoginDialog } from '@/components/auth/login-dialog'
import { RegisterDialog } from '@/components/auth/register-dialog'
import { CreateEventDialog } from '@/components/events/create-event-dialog'
import { CreateReservationDialog } from '@/components/reservation/create-reservation-dialog'
import { useAuth } from '@/hooks/use-auth'

export function Navbar() {
  const { t } = useTranslation()
  const { user, logout, isLoggingOut } = useAuth()
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showCreateReservation, setShowCreateReservation] = useState(false)

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex min-h-16 items-center justify-between px-4 mx-auto flex-wrap ">
          <NavbarLogo />

          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              to="/events"
              search={{ page: 1 }}
              className="hover:text-primary transition-colors"
            >
              {t('navbar.events', 'Events')}
            </Link>

            {user && (
              <Link
                to="/reservations"
                search={{ page: 1 }}
                className="hover:text-primary transition-colors"
              >
                {t('navbar.reservations', 'Reservations')}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <CreateDropdown
                  onCreateEvent={() => setShowCreateEvent(true)}
                  onCreateReservation={() => setShowCreateReservation(true)}
                />
                <UserDropdown
                  user={user}
                  onLogout={logout}
                  isLoggingOut={isLoggingOut}
                />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </nav>

      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
      />
      <CreateReservationDialog
        open={showCreateReservation}
        onOpenChange={setShowCreateReservation}
      />
    </>
  )
}

function CreateDropdown({
  onCreateEvent,
  onCreateReservation,
}: {
  onCreateEvent: () => void
  onCreateReservation: () => void
}) {
  const { t } = useTranslation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button size="sm" className="gap-2">
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>{t('navbar.create', 'Create')}</span>
            <Icon icon="lucide:chevron-down" className="w-3 h-3" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={onCreateEvent}
        >
          <Icon icon="lucide:calendar-plus" className="w-4 h-4" />
          {t('navbar.createEvent', 'Create Event')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={onCreateReservation}
        >
          <Icon icon="lucide:ticket-plus" className="w-4 h-4" />
          {t('navbar.createReservation', 'Create Reservation')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-xl"
    >
      <div className="bg-primary text-primary-foreground p-1 rounded-lg">
        <Icon icon="lucide:ticket" className="w-6 h-6" />
      </div>
      <span>TicketMaster</span>
    </Link>
  )
}

function UserDropdown({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: UserDto
  onLogout: () => void
  isLoggingOut: boolean
}) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"ghost"} size="lg" className="gap-2 rounded-xl">
            <NavbarUserDisplay user={user} />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <Link to="/users/$userId" params={{ userId: user.id.toString() }}>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Icon icon="lucide:user" className="w-4 h-4" />
            {t('navbar.profile', 'Profile')}
          </DropdownMenuItem>
        </Link>
        <LanguageSubmenu />
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <Icon icon="lucide:log-out" className="w-4 h-4" />
          {isLoggingOut ? t('navbar.loggingOut', 'Logging out...') : t('navbar.signOut', 'Sign Out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LanguageSubmenu() {
  const { i18n, t } = useTranslation()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
        <Icon icon="lucide:globe" className="w-4 h-4" />
        {t('navbar.language', 'Language')}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
          <DropdownMenuRadioItem value="en">
            {t('navbar.language.en', 'English')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pl">
            {t('navbar.language.pl', 'Polish')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

function AuthButtons() {
  const { t } = useTranslation()

  return (
    <>
      <LoginDialog>
        <Button variant="ghost" size="sm">
          {t('navbar.signIn', 'Sign In')}
        </Button>
      </LoginDialog>
      <RegisterDialog>
        <Button size="sm" className="rounded-xl">
          {t('navbar.getStarted', 'Get Started')}
        </Button>
      </RegisterDialog>
    </>
  )
}

function NavbarUserDisplay({ user }: { user: UserDto }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatarIcon size="sm" />
      <span className="max-w-[150px] truncate">{user.email}</span>
      <UserRoleBadge role={user.role} size="sm" />
      <Icon icon="lucide:chevron-down" className="w-3 h-3" />
    </div>
  )
}
