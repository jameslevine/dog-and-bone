import { NavLink as RouterNavLink, type NavLinkProps } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface NavLinkComponentProps extends NavLinkProps {
  className?: string
}

export function NavLink({ className, children, ...props }: NavLinkComponentProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          'text-sm font-bold transition-colors duration-150 relative py-1',
          'hover:text-[#FFB703] focus-visible:text-[#FFB703] focus-visible:outline-none',
          isActive
            ? 'text-[#FFB703] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FFB703] after:rounded-full'
            : 'text-[#2C1503]',
          className,
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  )
}
