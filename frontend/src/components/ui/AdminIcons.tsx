import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

type IconBaseProps = IconProps & {
  children: ReactNode
}

const IconBase = ({ size = 20, className, children, ...props }: IconBaseProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
)

export const BookOpenIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 7v14" />
    <path d="M3 5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M21 5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2z" />
  </IconBase>
)

export const CalendarPlusIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect height="18" rx="2" width="18" x="3" y="4" />
    <path d="M3 10h18" />
    <path d="M12 14v4" />
    <path d="M10 16h4" />
  </IconBase>
)

export const ChevronLeftIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m15 18-6-6 6-6" />
  </IconBase>
)

export const ChevronRightIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m9 18 6-6-6-6" />
  </IconBase>
)

export const CloudUploadIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M16 16l-4-4-4 4" />
    <path d="M12 12v9" />
    <path d="M20 16.5A4.5 4.5 0 0 0 17.5 8h-.6A7 7 0 0 0 4 10.5 5 5 0 0 0 5 20h3" />
  </IconBase>
)

export const EyeIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
)

export const EyeOffIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
    <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a16.3 16.3 0 0 1-3.2 4.2" />
    <path d="M6.5 6.6A16.1 16.1 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 4.2-.9" />
  </IconBase>
)

export const FileTextIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h6" />
  </IconBase>
)

export const FolderIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </IconBase>
)

export const ImageIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect height="16" rx="2" width="18" x="3" y="4" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 16-5-5L5 20" />
  </IconBase>
)

export const InfoIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </IconBase>
)

export const LayoutDashboardIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect height="8" rx="1" width="7" x="3" y="3" />
    <rect height="5" rx="1" width="7" x="14" y="3" />
    <rect height="8" rx="1" width="7" x="14" y="13" />
    <rect height="5" rx="1" width="7" x="3" y="16" />
  </IconBase>
)

export const LocateFixedIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </IconBase>
)

export const LockIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect height="11" rx="2" width="18" x="3" y="11" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
)

export const LogOutIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </IconBase>
)

export const MailIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect height="14" rx="2" width="18" x="3" y="5" />
    <path d="m3 7 9 6 9-6" />
  </IconBase>
)

export const MapPinIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
)

export const PlusIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
)

export const PlusCircleIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </IconBase>
)

export const SaveIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </IconBase>
)

export const SproutIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 20v-9" />
    <path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7z" />
    <path d="M12 11c0-4-3-7-7-7 0 4 3 7 7 7z" />
    <path d="M6 20h12" />
  </IconBase>
)
