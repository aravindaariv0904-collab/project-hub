'use client'

import ApplicationCard from '@/components/ApplicationCard'
import { useRouter } from 'next/navigation'

export default function ApplicationCardWrapper({ application, projectId, isDemo }) {
  const router = useRouter()
  return (
    <ApplicationCard
      application={application}
      projectId={projectId}
      isDemo={isDemo}
      onStatusChange={() => router.refresh()}
    />
  )
}
