'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/login')
  }, [router])

  return (
    <div className="h-screen bg-white flex items-center justify-center font-sans">
      <div className="text-zinc-500 font-medium">Redirecting to Sign In...</div>
    </div>
  )
}
