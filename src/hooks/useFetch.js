import { useCallback, useEffect, useRef, useState } from "react"

export const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const abortController = useRef()

  
  const fetchData = useCallback(async () => {
    abortController.current = new AbortController()
    setIsLoading(true)
    try {
      
      const response = await fetch(url, { signal: abortController.current.signal })
      const json = response.json()
      
      setData(json)
      setIsLoading(false)
    } catch (e) {
      const messsage = e instanceof Error ? e.message : String(e)
      setError(messsage)
    }
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