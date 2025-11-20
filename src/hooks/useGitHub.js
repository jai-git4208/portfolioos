import { useState, useEffect } from 'react'
import { GITHUB_API } from '../utils/constants'

export const useGitHub = () => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(GITHUB_API + '?sort=updated&per_page=10')
        if (!response.ok) throw new Error('Failed to fetch repositories')
        const data = await response.json()
        setRepos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  return { repos, loading, error }
}
