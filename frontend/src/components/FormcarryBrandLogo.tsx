import type { SVGProps } from 'react'

interface BrandLogoProps extends SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/**
 * Custom, original Formhop brand icon.
 * Modern geometric document with folded corner.
 * 100% original design with zero copyright conflict.
 */
export function FormhopIcon({ size = 24, className = '', ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background squircle */}
      <rect width="32" height="32" rx="7" fill="#005DFF" />
      {/* Crisp White Form Sheet */}
      <path
        d="M8.5 7.5C8.5 6.67 9.17 6 10 6H17.5L23.5 12V24.5C23.5 25.33 22.83 26 22 26H10C9.17 26 8.5 25.33 8.5 24.5V7.5Z"
        fill="white"
      />
      {/* Sheet folded corner */}
      <path
        d="M17.5 6V12H23.5"
        fill="#DCE7FE"
      />
      {/* Form input lines */}
      <path
        d="M12 14H18M12 17.5H19M12 21H16"
        stroke="#005DFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const FormcarryIcon = FormhopIcon

export function FormcarryBrandLogo({
  className = '',
  iconSize = 24,
  textSize = 'text-[17px]',
}: {
  className?: string
  iconSize?: number
  textSize?: string
}) {
  return (
    <div className={`flex items-center gap-1.5 font-bold tracking-tight select-none ${className}`}>
      <FormhopIcon size={iconSize} />
      <div className="flex items-baseline">
        <span className={`${textSize} font-extrabold text-[#0E0B3D] tracking-[-0.035em]`}>
          formhop
        </span>
        <span className={`${textSize} font-extrabold text-[#005DFF]`}>.</span>
      </div>
    </div>
  )
}

export const FormhopBrandLogo = FormcarryBrandLogo

/**
 * Headline lightning bolt icon matching Formcarry's electric blue bold accent.
 */
export function HeadlineLightningIcon({ className = 'w-7 h-7 sm:w-10 sm:h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-middle mx-1 transition-transform hover:scale-110 ${className}`}
      aria-label="Lightning bolt"
    >
      <path
        d="M13.5 2L3 13.5H11L9.5 22L21 9.5H13L13.5 2Z"
        fill="#1463FF"
      />
    </svg>
  )
}

/**
 * Headline form submission document badge matching Formcarry's blue squircle.
 */
export function HeadlineSubmissionIcon({ className = 'w-7 h-7 sm:w-9 sm:h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-middle mx-1 rounded-lg shadow-xs transition-transform hover:scale-110 ${className}`}
      aria-label="Form submission badge"
    >
      <rect width="36" height="36" rx="8" fill="#1463FF" />
      <rect x="8" y="9.5" width="13" height="3.2" rx="1.6" fill="white" />
      <rect x="8" y="16.4" width="20" height="3.2" rx="1.6" fill="white" />
      <rect x="8" y="23.3" width="15" height="3.2" rx="1.6" fill="white" />
    </svg>
  )
}

