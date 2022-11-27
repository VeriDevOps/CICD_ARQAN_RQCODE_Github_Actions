import axios from 'axios'

namespace ApiService {
  export async function getSecuritySentences(requirement: string) {
    const response = await axios.post('http://51.178.12.108:8502/text', null, {
      params: { requirement }
    })
    return response.data
  }

  export async function getRecommendedStigs(requirement: string, platform: string): Promise<string[]> {
    const response = await axios.post('http://51.178.12.108:8502/stigs', null, {
      params: { requirement, platform }
    })
    return response.data
  }
}

export default ApiService
