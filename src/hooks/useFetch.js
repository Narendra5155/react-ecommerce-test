import { useCallback, useEffect, useRef, useState } from "react"

export const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const abortController = useRef()

  
  const fetchData = useCallback(async () => {
    if(abortController.current) abortController.current.abort()
    abortController.current = new AbortController()
    setIsLoading(true)
    try {
      
      const response = await fetch(url, { signal: abortController.current.signal })
      const json = await response.json()
      
      setData(json)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
    }
    setIsLoading(false)
  }, [url])
  
  useEffect(() => {
    const initial = async ()=>{await fetchData()}
    initial()
  }, [fetchData])
  

  return {
    data,
    isLoading,
    error,
    refetch:fetchData
  }
}