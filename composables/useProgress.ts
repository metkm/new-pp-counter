export const useProgress = () => {
  const optimizedCount = useState('optimized:count', () => 0)

  return {
    optimizedCount
  }
}
