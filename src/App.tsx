import { useEffect, useState } from 'react'
import { initLiff } from './lib/liff'

export default function App() {
  const [name, setName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initLiff()
      .then(async (liff) => {
        if (!liff) return
        const profile = await liff.getProfile()
        setName(profile.displayName)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <h1 className="text-2xl font-bold">ร้านหมูครอบครัว</h1>
      {name && <p className="mt-4">สวัสดี {name}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </main>
  )
}
