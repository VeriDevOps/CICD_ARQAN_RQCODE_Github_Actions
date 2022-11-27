import axios from 'axios'

namespace ApiService {
  export async function getSecuritySentences(requirement: string) {
    const response = await axios.post('http://51.178.12.108:8502/text', requirement, {
      headers: { 'Content-type': 'text/plain;' }
    })
    return response.data
  }

  export async function getRecommendedStigs(requirement: string, platform: string): Promise<{ [id: string]: string }> {
    const response = await axios.get('http://51.178.12.108:8502/stigs', {
      params: { text: requirement, t_type: 1, platform: platform }
    })
    return response.data
  }
}

export default ApiService
