import axios from 'axios'

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const generateDataset = async (prompt: string, nRows: number) => {
  const res = await API.post('/api/generate', { prompt, n_rows: nRows })
  return res.data
}