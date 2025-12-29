import { useState, useEffect } from 'react'
import { GITHUB_API } from '../utils/constants'
import { fetchWithTimeout } from '../utils/api'

export const useGitHub = () => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetchWithTimeout(GITHUB_API + '?sort=updated&per_page=10', {
          timeout: 8000,
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        })

        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.')
        }

        if (!response.ok) throw new Error('Failed to fetch repositories (Server Error)')

        const data = await response.json()
        setRepos(Array.isArray(data) ? data : [])
      } catch (err) {
        console.warn('GitHub Repo fetch failed:', err.message)
        setError(err.message === 'The user aborted a request.' ? 'Request timed out' : err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  return { repos, loading, error }
}

